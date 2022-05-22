export enum UnclaimedRewardType {
  NPCEncounter = "npcEncounter",
}

export interface UnclaimedReward {
  id: number;
  description: string;
  type: UnclaimedRewardType;
}
