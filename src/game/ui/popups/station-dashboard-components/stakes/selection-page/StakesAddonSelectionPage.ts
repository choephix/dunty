import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { StakingAddonType } from "@game/asorted/StakingType";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { StationEntity } from "@game/data/entities/StationEntity";
import { StakingAddonStatusData } from "@game/data/staking/models";
import { StakingAddonDataHelper } from "@game/data/staking/StakingAddonDataHelper";
import { getStakingAddonDataService } from "@game/data/staking/StakingAddonDataService";
import { formatToMaxDecimals } from "@sdk-ui/utils/formatToMaxDecimals";
import { EventBus } from "@sdk/core/EventBus";
import { StakesAddonSelectionBottomBar } from "./StakesAddonSelectionBottomBar";
import { StakesAddonSelectionLargeButton } from "./StakesAddonSelectionLargeButton";
import { getStakingAddonDisplayProperties } from "../utils/getStakingAddonDisplayProperties";

export class StakesAddonSelectionPage extends EnchantedContainer {
  private readonly context: GameContext = GameSingletons.getGameContext();

  events = new EventBus<{
    purchaseConfirmed: (type: StakingAddonType) => void;
    buildingSelected: (type: StakingAddonType) => void;
  }>();

  private data?: {
    railYardData: StakingAddonStatusData;
    conductorLoungeData: StakingAddonStatusData;
  };

  constructor(public readonly station: StationEntity) {
    super();

    this.enchantments.onDestroyCallbacks.add(() => this.events.clear());
  }

  async load() {
    return (this.data = await StakingAddonDataHelper.getBothStakingAddonsData(this.station.assetId));
  }

  async initialize() {
    let bottomBar: StakesAddonSelectionBottomBar | null = null;

    if (!this.data) {
      throw new Error("StakingAddonSelectionSubpage: data is not loaded");
    }

    const { railYardData, conductorLoungeData } = this.data;

    //// Check if there is any hub to unlock
    if (!railYardData.unlocked || !conductorLoungeData.unlocked) {
      //// Add confirm button
      bottomBar = new StakesAddonSelectionBottomBar(this.events);
      bottomBar.position.set(50, 400);
      this.addChild(bottomBar);
    }

    //// Add rail yard
    const railHub = new StakesAddonSelectionLargeButton(railYardData);
    railHub.position.set(100, 125);
    railHub.buttonMode = true;
    railHub.interactive = true;
    this.addChild(railHub);

    //// Add lounge
    const loungeHub = new StakesAddonSelectionLargeButton(conductorLoungeData);
    loungeHub.position.set(400, 125);
    loungeHub.buttonMode = true;
    loungeHub.interactive = true;
    this.addChild(loungeHub);

    //// Add event listeners

    const refresh = async (reloadData: boolean) => {
      await this.context.ticker.delay(0.5);

      if (!reloadData && !this.data) {
        reloadData = true;
      }

      const { railYardData, conductorLoungeData } = !reloadData ? this.data! : await this.load();

      console.log({
        railYardData,
        conductorLoungeData,
      });

      railHub.updateStatus(false, railYardData);
      loungeHub.updateStatus(false, conductorLoungeData);

      const selectBuildingType = (hubType: StakingAddonType) => {
        const data = hubType === StakingAddonType.RailYard ? railYardData : conductorLoungeData;

        if (data.unlocked) {
          this.events.dispatch("buildingSelected", hubType);
        } else {
          const [costAmount, costCurrency] = data.nextCost.split(" ");
          const hubCost = formatToMaxDecimals(+costAmount, 4, true);

          railHub.updateStatus(hubType === StakingAddonType.RailYard, railYardData);
          loungeHub.updateStatus(hubType === StakingAddonType.ConductorLounge, conductorLoungeData);

          if (bottomBar) {
            bottomBar.showPurchaseButton(true);
            bottomBar.showUnlockAddonMessage(hubCost, hubType);
          }
        }
      };

      railHub.onClick = () => selectBuildingType(StakingAddonType.RailYard);
      loungeHub.onClick = () => selectBuildingType(StakingAddonType.ConductorLounge);

      if (bottomBar) {
        if (railYardData.unlocked && conductorLoungeData.unlocked) {
          bottomBar.dispose();
          this.removeChild(bottomBar);
        } else {
          bottomBar.showPurchaseButton(false);
        }
      }
    };

    ////

    const performPurchaseAction = async (addonType: StakingAddonType) => {
      const addonDataService = getStakingAddonDataService(addonType);
      await this.context.spinner.showDuring(addonDataService.unlockStakingAddon(this.station.assetId));

      const { addonDisplayName: displayName } = getStakingAddonDisplayProperties(addonType);

      await this.context.modals.alert({
        title: `Success`,
        content: `You've unlocked tier 1 of your station's ${displayName.toUpperCase()}.\nRailroaders can begin staking in your public spots immediately.\nBe on the lookout for the VIP requests!`,
      });

      await this.context.spinner.showDuring(refresh(true));
    };

    this.events.on({
      purchaseConfirmed: async (type: StakingAddonType) => {
        await performPurchaseAction(type);
      },
    });

    await refresh(false);
  }
}
