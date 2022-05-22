import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { env } from "@game/app/global";
import { CardEntity } from "@game/data/entities/CardEntity";
import { AccountName } from "@sdk-integration/contracts";
import { GoldenRunCheckResult, GRSMembersData, MyGoldenRunSubmissionData } from "./models";

const TINY_CONDUCTORS_HEADS = {
  1001: "orson",
  1002: "ned",
  1003: "tommy",
  1004: "shayan",
  1005: "ash",
  1006: "billy",
  1007: "jame",
  1008: "paloma",
  1009: "missy",
  1010: "tobia",
  1011: "osipov",
  1012: "johnny",
  1013: "wes",
  1014: "gutshot",
  1015: "kc",
};

const CONDUCTOR_NAMES = {
  1001: "Orson Brisk",
  1002: "Piggy Back Ned",
  1003: "Tommy Two-Pair",
  1004: "Shayan Kahree",
  1005: "Whiplash Ash",
  1006: "Billy Clover",
  1007: "Speedy Jame",
  1008: "Paloma Haulita",
  1009: "Missy Sweetluck",
  1010: "Brute Force Tobias",
  1011: "Big Break Osipov",
  1012: "Johnny Quick-Knuckles",
  1013: "Wesley Strike",
  1014: "Gutshot Gauthier",
  1015: "KC Jones",
};

export class GoldenRunsDataService {
  protected readonly context: GameContext = GameSingletons.getGameContext();

  async checkTransactionForGoldenRun(transactionId: string) {
    const { firebase } = this.context;

    type ResponseData =
      | { isGoldenRun: false; details: {} }
      | {
          isGoldenRun: true;
          details: {
            commodity: number;
            locomotive: number;
            railcar: number;
            railroader: AccountName;
            trxId: string;
            rewardId: string;
          };
        };

    const doTheCheck = env.BLOCKCHAIN === "mainnet" ? firebase.fn_checkGoldenRun : firebase.fn_checkGoldenRunAuth;
    const grResponse = await doTheCheck({ trx_id: transactionId });
    const grResponseJsonData = grResponse.data as ResponseData;
    console.log(`Response:`, grResponseJsonData);

    const status: GoldenRunCheckResult = !grResponseJsonData.isGoldenRun
      ? GoldenRunCheckResult.NotGoldenRun
      : grResponseJsonData.details.trxId != transactionId
      ? GoldenRunCheckResult.LateGoldenRun
      : GoldenRunCheckResult.GoldenRun;

    await firebase.setUserGoldenRunCheckResult(transactionId, status);

    return status;
  }

  async getGRSMembersTestData(): Promise<GRSMembersData[]> {
    const { firebase } = this.context;

    const members = await firebase.getGoldenRunSocietyMembers();

    return Object.entries(CONDUCTOR_NAMES).map(([cardid, name]) => {
      const data = members[cardid] as typeof members[keyof typeof members] | undefined;
      return {
        conductor: name,
        railroader: "",
        ...data,
      };
    });
  }

  async getMySubmissionsTestData(): Promise<MyGoldenRunSubmissionData[]> {
    const { firebase, historyDataCtrl, userData } = this.context;

    const firestoreUserData = await firebase.getUserData();

    // Can use "jgyra.wam" for testing
    const username = this.context.contracts.currentUserName;
    const runLogs = await historyDataCtrl.api.getRailRunsStats({
      railroader: username,
      after: "2022-03-15T00:00:00.000",
      limit: 50,
      simple: false,
    });

    if (!runLogs) {
      return [];
    }

    const results = new Array<MyGoldenRunSubmissionData>();
    for (const runLog of runLogs) {
      const [conductor] = runLog.conductors;
      const conductorId = conductor.cardid as keyof typeof TINY_CONDUCTORS_HEADS;
      const cardInfos = [runLog.conductors[0], runLog.locomotives[0], runLog.cars[0]?.car, ...runLog.cars[0]?.loads];

      const cardAssetIds = cardInfos.filter(c => !!c).map(cardInfo => cardInfo.asset_id);

      // const cards = new Array<CardEntity>();
      // for (const c of cardInfos) {
      //   if (c && c.asset_id) {
      //     try {
      //       // const card = userData.cards.get(c.asset_id) || (await CardEntity.fromAssetId(c.asset_id));
      //       const card = userData.cards.get(c.asset_id);
      //       if (!card) throw new Error(`Card not found: ${c.asset_id}`);
      //       cards.push(card);
      //     } catch (error) {
      //       console.warn(error);
      //       continue;
      //     }
      //   }
      // }

      results.push({
        transactionId: runLog.trx_id,
        train: runLog.train_name,
        arrivalTime: runLog.block_time,
        status: firestoreUserData.goldenRunCheckResults?.[runLog.trx_id] ?? null,
        conductorImg: `${TINY_CONDUCTORS_HEADS[conductorId]}.png`,
        cardAssetIds: cardAssetIds,
        // cards: cards,
      });
    }

    return results;
  }
}
