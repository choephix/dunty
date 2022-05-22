import { CenturyTrainPartData, CenturyTrainPartTokenSymbol } from "./models";

type CenturyTrainPartAdditionalProperties = {
  discountPercent?: number;
  expiryTime?: Date;
  inventoryCount?: number;
  purchasableCount?: number;
  forceActive?: boolean;
  discountClaimed?: boolean;
};

export class CenturyTrainPartEntity implements CenturyTrainPartData, CenturyTrainPartAdditionalProperties {
  readonly rarity!: string;
  readonly tokenSymbol!: CenturyTrainPartTokenSymbol;
  readonly part!: string;
  readonly probability!: string;
  readonly information!: string;
  readonly speechBubble!: string;
  readonly distance!: number | null;
  readonly haulingPower!: number | null;
  readonly speed!: number | null;
  readonly luck!: number | null;
  readonly imgUrl!: string;
  readonly cost!: number;

  readonly discountPercent?: number;
  readonly expiryTime?: Date;
  readonly purchasableCount: number = 0;
  readonly forceActive: boolean = false;
  readonly inventoryCount: number = 0;
  readonly discountClaimed?: boolean;

  constructor(data: CenturyTrainPartData, additionalProperties: CenturyTrainPartAdditionalProperties) {
    Object.assign(this, data, additionalProperties);
  }

  public getCostWithDiscountApplied() {
    if (!this.shouldDiscount()) {
      return this.cost;
    }

    if (!this.discountPercent) {
      return this.cost;
    }

    return Math.ceil((this.cost * (100 - this.discountPercent)) / 100);
  }

  public shouldDiscount() {
    return this.discountPercent != null && !this.inventoryCount && !this.isExpired() && !this.isDiscountClaimed();
  }

  public isDiscountClaimed() {
    return this.discountClaimed;
  }

  public getTimeLeftInSeconds() {
    if (!this.expiryTime) {
      return null;
    }

    const timeLeft = this.expiryTime.getTime() - new Date().getTime();
    const timeLeftInSeconds = Math.floor(timeLeft / 1000);

    return timeLeftInSeconds;
  }

  public canPurchase() {
    if (this.inventoryCount > 0) return false;
    return this.purchasableCount > 0;
  }

  public canRedeem() {
    return this.inventoryCount > 0 && this.tokenSymbol === "BETABAR";
  }

  public isExpired() {
    // if (__DEBUG__) return true;

    // if (this.purchasableCount === 0) {
    //   return true;
    // }

    if (!this.expiryTime) {
      return false;
    }

    return this.expiryTime.getTime() < new Date().getTime();
  }

  public isInactive() {
    if (this.forceActive) return false;
    return !this.canRedeem() && !this.canPurchase();
  }
}
