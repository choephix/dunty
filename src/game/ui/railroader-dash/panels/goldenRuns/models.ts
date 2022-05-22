import { CardEntity } from "@game/data/entities/CardEntity";
import { CardAssetId } from "@sdk-integration/contracts";

export enum GoldenRunCheckResult {
  NotGoldenRun = "not",
  LateGoldenRun = "late",
  GoldenRun = "GOLDEN_RUN",
}

export interface GRSMembersData {
  conductor: string;
  railroader: string;
}

export interface MyGoldenRunSubmissionData {
  transactionId: string;
  conductorImg: string;
  train: string;
  arrivalTime: string | Date;
  status: GoldenRunCheckResult | null;
  cardAssetIds: CardAssetId[];
  // cards: CardEntity[];
}
