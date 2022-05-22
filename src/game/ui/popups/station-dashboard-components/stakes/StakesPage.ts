import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { StakingAddonType } from "@game/asorted/StakingType";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { StationEntity } from "@game/data/entities/StationEntity";
import { Sprite } from "@pixi/sprite";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { PageObjectManager } from "@sdk-pixi/ui-helpers/PageObjectManager";
import { EventBus } from "@sdk/core/EventBus";
import { StakingAddonPage } from "./addon-page/StakingAddonPage";
import { StakesAddonSelectionPage } from "./selection-page/StakesAddonSelectionPage";

export enum StakingAddonPageKey {
  SelectAddon = "selectAddon",
  RailYard = "railYard",
  ConductorLounge = "conductorLounge",
}

export class StakesPage extends EnchantedContainer {
  private readonly context: GameContext = GameSingletons.getGameContext();

  public readonly events = new EventBus<{
    stakesPageChange: (pageType: StakingAddonPageKey) => void;
  }>();

  private readonly backArrow: Sprite;

  constructor(public readonly station: StationEntity) {
    super();

    // if (__DEBUG__) {
    //   this.station = this.context.mapData.stations.get("1099521667568" as any)!;
    // }

    this.enchantments.onDestroyCallbacks.add(() => this.events.clear());

    //// Add back arrow
    this.backArrow = this.addBackArrow();
  }

  addBackArrow() {
    const textureId = "ui-station-dashboard/staking/manage-tab/manage-home/btn-back.png";
    const texture = this.context.assets.getTexture(textureId);
    const sprite = new Sprite(texture);
    sprite.addChild(sprite);
    sprite.position.set(40, 230);
    sprite.scale.set(0.5);
    sprite.interactive = true;
    sprite.buttonMode = true;
    return this.addChild(sprite);
  }

  async init() {
    const pages = new PageObjectManager(
      {
        [StakingAddonPageKey.RailYard]: {
          construct: () => {
            this.backArrow.visible = true;

            // const container = new StakesHomeSubpage(this.context, this.station, StakingAddonType.RailYard);
            const container = new StakingAddonPage(this.station, StakingAddonType.RailYard);
            return container;
          },
        },
        [StakingAddonPageKey.ConductorLounge]: {
          construct: () => {
            this.backArrow.visible = true;

            // const container = new StakesHomeSubpage(this.context, this.station, StakingAddonType.ConductorLounge);
            const container = new StakingAddonPage(this.station, StakingAddonType.ConductorLounge);
            return container;
          },
        },
        [StakingAddonPageKey.SelectAddon]: {
          construct: () => {
            this.backArrow.visible = false;

            const container = new StakesAddonSelectionPage(this.station);
            container.events.on({
              buildingSelected: async (type: StakingAddonType) => {
                const nextPageKey =
                  type === StakingAddonType.RailYard
                    ? StakingAddonPageKey.RailYard
                    : StakingAddonPageKey.ConductorLounge;
                await pages.setCurrentPage(nextPageKey);
              },
            });
            return container;
          },
        },
      },
      this
    );

    buttonizeDisplayObject(this.backArrow, () => {
      console.log(`Back to home`);
      pages.setCurrentPage(StakingAddonPageKey.SelectAddon);
    });

    /** When current sup-page changes, pass that knowledge upwards via own event dispatcher */
    pages.events.addListener("beforeChange", key => key != null && this.events.dispatch("stakesPageChange", key));

    pages.setCurrentPage(StakingAddonPageKey.SelectAddon);
  }
}
