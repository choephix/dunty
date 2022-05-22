import { __DEBUG__ } from "@debug/__DEBUG__";
import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { env } from "@game/app/global";
import { formatDateTimeHumanReadable } from "@game/asorted/formatDateTimeHumanReadable";
import { formatTimeDurationHumanReadable } from "@game/asorted/formatTimeDurationHumanReadable";
import { FontIcon } from "@game/constants/FontIcon";
import { Container, IDestroyOptions } from "@pixi/display";
import { formatToMaxDecimals } from "@sdk-ui/utils/formatToMaxDecimals";
import { ReadonlyDeep } from "type-fest";
import { RailRunsHistoryListBox } from "../components/RailRunsHistoryListBox";
import { RailRunsWindowComponentFactory } from "../components/RailRunsWindowComponentFactory";

export interface RailRunsHistoryListRowData {
  name: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  distance: string;
  fuelAmount: string;
  runEarnings: string;
  passengerTips: string;
  totalEarnings: string;
}

export class RailRunsHistoryPage extends Container {
  private readonly context: GameContext = GameSingletons.getGameContext();

  private list: RailRunsHistoryListBox | null = null;

  constructor(public readonly componentFactory: RailRunsWindowComponentFactory) {
    super();

    //// //// //// //// //// //// //// //// ////
    //// Page Title
    //// //// //// //// //// //// //// //// ////
    const title = this.componentFactory.addTitle("HISTORY");
    title.position.set(165, 100);
    this.addChild(title);

    //add history header row
    const historyHeaderRow = this.componentFactory.createHistoryHeaderRow();
    this.addChild(historyHeaderRow);
  }

  private async loadHistoryData(): Promise<RailRunsHistoryListRowData[]> {
    const { historyDataCtrl, userData } = this.context;

    if (env.BLOCKCHAIN === "testnet" && __DEBUG__) {
      // return mockRailRunsHistoryData;
      // @ts-ignore
      // userData.name = "pglrg.wam";
      // userData.name = ".bdhs.wam";
      userData.name = "jgyra.wam";
    }

    const railRunsLog = await historyDataCtrl.api.getRailRunsStats({
      railroader: userData.name,
      limit: 50,
      simple: false,
    });

    if (!railRunsLog?.length) {
      return [];
    }

    return railRunsLog.map(log => {
      const duration = log.run_complete - log.run_start;

      function getEarns() {
        const total = log.railroader_reward * 0.0001;
        if (!log.logtip?.total_tips) {
          return {
            runEarnings: FontIcon.Tocium + " " + formatToMaxDecimals(total, 2),
            passengerTips: "",
            totalEarnings: FontIcon.Tocium + " " + formatToMaxDecimals(total, 2),
          };
        }

        const beforeTips = log.logtip.before_tips * 0.0001;
        const tipsPercent = log.logtip.total_tips || 0;
        const tipsMultiplier = 0.01 * tipsPercent;
        const tipsCash = beforeTips * tipsMultiplier;
        return {
          runEarnings: FontIcon.Tocium + " " + formatToMaxDecimals(beforeTips, 2),
          passengerTips: FontIcon.Tocium + " " + formatToMaxDecimals(tipsCash, 2),
          totalEarnings: FontIcon.Tocium + " " + formatToMaxDecimals(total, 2),
        };
      }

      return {
        name: log.train_name,
        departureTime: formatDateTimeHumanReadable(log.run_start * 1000),
        arrivalTime: formatDateTimeHumanReadable(log.run_complete * 1000),
        duration: formatTimeDurationHumanReadable(duration),
        distance: formatToMaxDecimals(log.distance, 2),
        fuelAmount: formatToMaxDecimals(log.quantity, 2) + " " + log.fuel_type,
        ...getEarns(),
      };
    });
  }

  async populateList() {
    if (this.list) {
      this.list.destroy({ children: true });
      this.list = null;
    }

    let historyData: ReadonlyDeep<RailRunsHistoryListRowData>[];
    historyData = await this.loadHistoryData();

    //add history table rows
    this.list = new RailRunsHistoryListBox(this.context, historyData, this.componentFactory, 25);
    this.addChild(this.list);
  }

  destroy(options?: boolean | IDestroyOptions): void {
    if (this.list) {
      this.list.destroy({ children: true });
      this.list = null;
    }

    super.destroy(options);
  }
}
