import { FontIcon } from "@game/constants/FontIcon";
import { ThemeColors } from "@game/constants/ThemeColors";
import { EventBus, EventBusKey } from "@sdk/core/EventBus";
import { StationPopup } from "./bases/StationPopup";
import { StationPopupBackgroundType } from "./components/StationPopupBackgroundType";
import { PopupPlacementFunction } from "./util/PopupPlacementFunction";

type StationEditTrainLoadoutPopupEvents = EventBus<
  EventBusKey<StationPopup["events"]> & {
    onClick_EditTrain: () => void;
  }
>;

export class StationEditTrainLoadoutPopup extends StationPopup {
  public readonly placementFunc: PopupPlacementFunction = PopupPlacementFunction.sidewaysSmart;

  public declare readonly events: StationEditTrainLoadoutPopupEvents;

  async fillContent_Default() {
    const { station } = this;

    if (!station) {
      throw new Error("StationDashboardPopup: station is not set");
    }

    const { main } = this.context;

    const train = main.selection.selectedTrain;
    if (!train) {
      return console.error(`No train selected at station ${station.name}.`);
    }

    this.setPadBackground(StationPopupBackgroundType.TRAIN_LOADOUT);
    if (this.context.main.selection.selectedDestination) {
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
      const ribbonText = [`${FontIcon.LocoLegacy}  ${train.name}`, `Rail Cars`] as const;
      const ribbon = this.componentFactory.createInfoRibbon(ribbonText);
      ribbon.updateText(ribbonText, 0.7);
      ribbon.position.set(this.width * 0.5, 162);
      this.addChild(ribbon);
    }

    {
      const ribbon = this.componentFactory.createInfoRibbon("");
      ribbon.position.set(this.width * 0.5, 429);
      this.addChild(ribbon);

      const updateRibbon = () => {
        const train = this.context.main.cards.changes.unsavedTrain;
        ribbon.updateText(
          [`Haul Weight:`, train ? `${train.currentTotalWeight}/${train.maxWeight}` : `N/A`],
          0.7,
          train && train.currentTotalWeight > train.maxWeight ? ThemeColors.DANGER_COLOR.toInt() : undefined
        );
      };
      updateRibbon();

      const cleanup = main.cards.events.on({
        hypotheticalTrainChange: () => updateRibbon(),
      });
      this.onDestroy(cleanup);
    }

    //// STATS ////

    {
      const scrollbox = this.componentFactory.addTrainLoadoutScrollBox(180, 411);
      scrollbox.updateContent(this.context.main.cards.changes.unsavedTrain);

      const cleanup = main.cards.events.on({
        hypotheticalTrainChange: hypo => scrollbox.updateContent(this.context.main.cards.changes.unsavedTrain),
      });
      this.onDestroy(cleanup);
    }

    //// BUTTONS ////

    {
      const buttonText = `Edit Train`;
      const button = this.componentFactory.createBottomButton("fill", buttonText, 63);
      button.y += 3;
      button.setEnabled(true);
      button.onClick = () => this.events.dispatch("onClick_EditTrain");
      this.onDestroy(() => button.removeAllListeners());
      this.addChild(button);
    }

    //// X Close Button
    this.componentFactory.addXCloseButton();

    await this.fadeChildrenIn();
  }
}
