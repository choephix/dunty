import { FontIcon } from "@game/constants/FontIcon";
import { EventBus, EventBusKey } from "@sdk/core/EventBus";
import { StationPopup } from "./bases/StationPopup";
import { StationPopupBackgroundType } from "./components/StationPopupBackgroundType";
import { PopupPlacementFunction } from "./util/PopupPlacementFunction";

type StationDispatchDeparturePopupEvents = EventBus<
  EventBusKey<StationPopup["events"]> & {
    onClick_EditTrain: () => void;
    onClick_LoadingDock: () => void;
  }
>;

export class StationDispatchDeparturePopup extends StationPopup {
  public readonly placementFunc: PopupPlacementFunction = PopupPlacementFunction.sideways;

  public declare readonly events: StationDispatchDeparturePopupEvents;

  async fillContent_Default() {
    const { station } = this;

    if (!station) {
      throw new Error("StationDashboardPopup: station is not set");
    }

    const { main } = this.context;
    const train = main.selection.selectedTrain;

    if (!train) {
      throw new Error("StationDispatchDeparturePopup: No train at station");
    }

    this.setPadBackground(StationPopupBackgroundType.IDLE_CLICK_AND_DISPATCHES);

    {
      const floatyText = `Departure`;
      const floaty = this.componentFactory.createFloatyTitle(floatyText, this.width);
      this.addChild(floaty);
    }

    {
      const titleText = station.name;
      const title = this.componentFactory.createTitle(titleText, this.width);
      this.addChild(title);
    }

    {
      const infoText = `${FontIcon.LocoLegacy}  ${train.name}`;
      const info = this.componentFactory.createInfoRibbon(infoText, "ui-popups/bg-lvl2-info.png");
      info.position.set(this.width * 0.5, 165);
      this.addChild(info);
    }

    this.componentFactory.addTrainCardsInfoScrollBox(188, 365, train);

    //// BUTTONS ////

    {
      const buttonText = `Edit train`;
      const button = this.componentFactory.createBottomButton("left", buttonText);
      button.setEnabled(!!train);
      button.onClick = () => this.events.dispatch("onClick_EditTrain");
      this.onDestroy(() => button.removeAllListeners());
      this.addChild(button);
    }

    {
      const buttonText = `Loading dock`;
      const button = this.componentFactory.createBottomButton("right", buttonText);
      button.setEnabled(!!train && !train.getInvalidReason() && train.railCars.length > 0);
      button.onClick = () => this.events.dispatch("onClick_LoadingDock");
      this.onDestroy(() => button.removeAllListeners());
      this.addChild(button);
    }

    await this.fadeChildrenIn();
  }
}
