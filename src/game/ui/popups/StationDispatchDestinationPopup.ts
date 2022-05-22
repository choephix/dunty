import { PotentialRailRunStats } from "@game/data/entities/PotentialRailRunStats";
import { EventBus, EventBusKey } from "@sdk/core/EventBus";
import { toPotentialRunStatsString } from "../formatters/formatRailRunStats";
import { StationPopup } from "./bases/StationPopup";
import { StationPopupBackgroundType } from "./components/StationPopupBackgroundType";
import { PopupPlacementFunction } from "./util/PopupPlacementFunction";

type StationDispatchDestinationPopupEvents = EventBus<
  EventBusKey<StationPopup["events"]> & {
    onClick_Dispatch: () => void;
  }
>;

export class StationDispatchDestinationPopup extends StationPopup {
  public readonly placementFunc: PopupPlacementFunction = PopupPlacementFunction.sideways;

  public declare readonly events: StationDispatchDestinationPopupEvents;

  public potentialRunStats: PotentialRailRunStats | null = null;

  async fillContent_Default() {
    const { station } = this;

    if (!station) {
      throw new Error("StationDashboardPopup: station is not set");
    }

    const { assets, main, mapData } = this.context;

    this.setPadBackground(StationPopupBackgroundType.IDLE_CLICK_AND_DISPATCHES);

    {
      const floatyText = `Destination`;
      const floaty = this.componentFactory.createFloatyTitle(floatyText, this.width);
      this.addChild(floaty);
    }

    {
      const titleText = station.name;
      const title = this.componentFactory.createTitle(titleText, this.width);
      this.addChild(title);
    }

    try {
      const { train, trainStation: departureStation } = main.faq.getSelectedTrainAndStation();
      const destinationStation = station;
      this.potentialRunStats = new PotentialRailRunStats(train, departureStation, destinationStation);

      if (this.potentialRunStats.isBacktracking) {
        this.componentFactory.addWarning_BackTracking();
      }

      {
        const potentialRunStatsText = toPotentialRunStatsString(this.potentialRunStats);
        const potentialRunStatsRibbon = this.componentFactory.createInfoRibbon(
          potentialRunStatsText,
          `ui-popups/bg-lvl2-info.png`
        );
        potentialRunStatsRibbon.position.set(this.centerX, 165);
        this.addChild(potentialRunStatsRibbon);
      }

      {
        const labelText = `COMMODITY RATES`;
        const label = this.componentFactory.createLabel(labelText, this.width, {
          style: {
            fontSize: 16,
            strokeThickness: 0,
          },
          position: {
            x: 0.5 * this.width,
            y: 207,
          },
          anchor: {
            x: 0.5,
            y: 0.5,
          },
          scaleFactor: 2.0,
        });
        this.addChild(label);
      }

      this.componentFactory.addCommodityRatesInfoBox(220, 365);

      //// BUTTONS ////

      //// Dispatch
      {
        const buttonText = `Dispatch`;
        const button = this.componentFactory.createBottomButton("fill", buttonText);
        button.setEnabled(!train.getInvalidReason());
        button.onClick = () => this.events.dispatch("onClick_Dispatch");
        this.onDestroy(() => button.removeAllListeners());
        this.addChild(button);
      }
    } catch (e) {
      console.error(e);
    }

    //// X Close Button
    this.componentFactory.addXCloseButton();

    await this.fadeChildrenIn();
  }
}
