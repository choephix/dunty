import allPartsData from "../ctPartsData.json";

export interface CenturyTrainPartData {
  readonly rarity: string;
  readonly tokenSymbol: string;
  readonly part: string;
  readonly probability: string;
  readonly information: string;
  readonly speechBubble: string;
  readonly distance: number | null;
  readonly haulingPower: number | null;
  readonly speed: number | null;
  readonly luck: number | null;
  readonly imgUrl: string;
  readonly cost: number;
}

export type CenturyTrainPartTokenSymbol = keyof typeof allPartsData;
