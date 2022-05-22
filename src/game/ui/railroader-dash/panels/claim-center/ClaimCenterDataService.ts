import { GameContext } from "@game/app/app";
import { ContractName } from "@sdk-integration/contracts";
import { formatToMaxDecimals } from "@sdk-ui/utils/formatToMaxDecimals";
import { UnclaimedReward, UnclaimedRewardType } from "./models";

export class ClaimCenterDataService {
  constructor(protected readonly context: GameContext) {}

  async getUnclaimedRewards() {
    const { contracts } = this.context;
    const rows = await contracts.tables.loadRows<{
      reward_id: number;
      reward: `${number} ${string}`;
    }>(
      "rewards",
      {
        scope: contracts.currentUserName,
        limit: 1000,
      },
      ContractName.RR
    );

    const data: UnclaimedReward[] = rows.map(row => {
      const [rewardAmount, rewardType] = row.reward.split(" ");
      return {
        id: +row.reward_id,
        description: `${formatToMaxDecimals(+rewardAmount)} ${rewardType}`,
        type: UnclaimedRewardType.NPCEncounter,
      };
    });

    return data;
  }
}
