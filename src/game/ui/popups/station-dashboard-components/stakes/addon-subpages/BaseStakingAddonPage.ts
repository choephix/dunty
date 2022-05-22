import { __window__ } from "@debug/__";
import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { StakingAddonType } from "@game/asorted/StakingType";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { StationEntity } from "@game/data/entities/StationEntity";
import { StakingAddonStatusData_Unlocked } from "@game/data/staking/models";
import { getStakingAddonDataService } from "@game/data/staking/StakingAddonDataService";
import { EventBus } from "@sdk/core/EventBus";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";

export abstract class BaseStakingAddonPage extends EnchantedContainer {
  public abstract subpageTitle: string;

  public readonly addonDataService = getStakingAddonDataService(this.addonType);
  public addonData!: StakingAddonStatusData_Unlocked;

  protected readonly events?: EventBus;

  protected readonly tweeener = new TemporaryTweeener(this);
  protected readonly assets = GameSingletons.getResources();
  protected readonly spinner = GameSingletons.getSpinner();
  protected readonly modals = GameSingletons.getGenericModalsFactory();
  protected readonly ticker = GameSingletons.getTicker();

  constructor(public readonly station: StationEntity, public readonly addonType: StakingAddonType) {
    super();

    __window__.pg = this;
  }

  async refreshAddonData() {
    const promise = this.addonDataService.getAddonStatusData(this.station.assetId);
    const addonData = await this.spinner.showDuring(promise);

    if (!addonData) {
      throw new Error("Addon data is not assigned");
    }

    if (!addonData.unlocked) {
      throw new Error("Addon data is not unlocked");
    }

    return (this.addonData = addonData);
  }

  async load() {
    if (this.addonData && this.addonData.unlocked) {
      return;
    }

    await this.refreshAddonData();

    this.enchantments.onDestroyCallbacks.add(() => {
      if (this.events) {
        this.events.clear();
      }
    });
  }

  async initialize() {
    if (!this.addonData) {
      return;
    }

    // ...
  }

  playShowAnimation() {
    return this.tweeener.from([...this.children], {
      pixi: {
        alpha: 0,
        pivotY: 50,
      },
      duration: 0.18,
      ease: "power.out",
      stagger: 0.06,
    });
  }
}
