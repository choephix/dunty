import { FontIcon } from "@game/constants/FontIcon";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { EventBus, EventBusKey } from "@sdk/core/EventBus";
import { StationPopup } from "./bases/StationPopup";
import { ExpansionArrow } from "./components/ExpansionArrow";
import { StationPopupBackgroundType } from "./components/StationPopupBackgroundType";
import { PopupPlacementFunction } from "./util/PopupPlacementFunction";

type StationClickWithMyTrainEvents = EventBus<
  EventBusKey<StationPopup["events"]> & {
    onClick_EditTrain: () => void;
    onClick_NextStop: () => void;
  }
>;

export class StationClickWithMyTrain extends StationPopup {
  public readonly placementFunc: PopupPlacementFunction = PopupPlacementFunction.sidewaysSmart;

  interactive = true;
  buttonMode = true;

  mouseIsOver = false;
  isExpanded = false;

  arrow: ExpansionArrow | null = null;

  public declare readonly events: StationClickWithMyTrainEvents;

  setExpanded(expanded: boolean) {
    this.isExpanded = expanded;

    this.clearContent();

    if (expanded) {
      this.fillContent_Expanded();
    } else {
      this.fillContent_Collapsed();
    }
  }

  async fillContent_Collapsed() {
    const { main, ticker } = this.context;
    const { station } = this;

    if (!station) {
      throw new Error(`You're trying to fill in a station popup that doesn't have a station reference.`);
    }

    await this.setPadBackground(StationPopupBackgroundType.NEXT_STOP);

    {
      const titleText = station.name;
      const title = this.componentFactory.createTitle(titleText, this.padWidth);
      title.y = 32;
      title.anchor.set(0.0);
      this.addChild(title);
    }

    {
      try {
        const ribbonText = "Owned by: " + station.ownerName;
        const ribbon = this.componentFactory.createInfoRibbon("", `ui-popups/bg-lvl1-btm-info.png`);
        ribbon.updateText(ribbonText, 0.5);
        ribbon.position.set(this.centerX, 132);
        this.addChild(ribbon);
      } catch (e) {
        console.error(e);
      }
    }

    {
      try {
        const train = main.selection.selectedTrain;
        const ribbonText = !train ? `N/A` : `${FontIcon.Loco} ${train.name}`;
        const ribbon = this.componentFactory.createInfoRibbon("", `ui-popups/idle-first-click-footer-bg.png`);
        ribbon.updateText(ribbonText, 0.5);
        ribbon.position.set(this.centerX, 161);
        this.addChild(ribbon);
      } catch (e) {
        console.error(e);
      }
    }

    // DRY
    this.arrow = new ExpansionArrow(station.rarity.toString());
    this.arrow.position.set(this.padWidth / 2, this.padHeight);
    this.addChild(this.arrow);

    this.arrow.enchantments.watch(
      () => this.mouseIsOver,
      (mouseIsOver: boolean) => {
        if (this.arrow) {
          this.arrow.mouseIsOver = mouseIsOver;
        }
      }
    );

    await this.fadeChildrenIn();
  }

  async fillContent_Expanded() {
    const { main, ticker, input } = this.context;
    const { station } = this;

    if (!station) {
      throw new Error(`You're trying to expand a station info popup that doesn't have a station reference.`);
    }

    const train = main.selection.selectedTrain;

    await this.setPadBackground(StationPopupBackgroundType.IDLE_CLICK_AND_DISPATCHES);

    console.log([this._height, this._width]);

    {
      const titleText = station.name;
      const title = this.componentFactory.createTitle(titleText, this.padWidth);
      this.addChild(title);
    }

    {
      const ownerName = station.ownerName;
      const labelText = `Owned by ${ownerName}`;
      const label = this.componentFactory.createLabel(labelText, this.padWidth, {
        style: {
          fontSize: 12,
        },
        position: { x: 26, y: 157 },
        scaleFactor: 2.0,
      });
      this.addChild(label);
    }

    let y = 190;

    if (!train) {
      const labelText = `No train selected.`;
      const label = this.componentFactory.createLabel(labelText, this.padWidth, {
        style: {
          fontSize: 12,
          strokeThickness: 0,
        },
        position: {
          x: 31,
          y: y,
        },
        scaleFactor: 2.0,
        disabled: !train,
      });
      this.addChild(label);

      y += label.height;
    }

    if (train) {
      const trains = [train];
      for (const [i, train] of trains.entries()) {
        const trainName = train.name.toUpperCase();
        const labelText = `${FontIcon.LocoAlt} ${trainName} is at this station`;
        const label = this.componentFactory.createLabel(
          labelText,
          this.padWidth,
          {
            style: {
              fontSize: 12,
              strokeThickness: 0,
            },
            position: { x: 47, y: y },
            scaleFactor: 2.0,
          },
          false
        );
        this.addChild(label);

        y += 30;
      }

      this.componentFactory.addTrainCardsInfoScrollBox(206, 370, train);
    }

    //// BUTTONS ////

    {
      const buttonText = `Edit train`;
      const button = this.componentFactory.createBottomButton("left", buttonText);
      buttonizeDisplayObject(button, () => this.events.dispatch("onClick_EditTrain"));
      button.setEnabled(!!train);
      this.onDestroy(() => button.removeAllListeners());
      this.addChild(button);
    }

    {
      const buttonText = `Next stop`;
      const button = this.componentFactory.createBottomButton("right", buttonText);
      button.setEnabled(!!train && !train?.getInvalidReason());
      buttonizeDisplayObject(button, () => this.events.dispatch("onClick_NextStop"));
      this.onDestroy(() => button.removeAllListeners());
      this.addChild(button);
    }

    {
      const floatyText = `Click to view Station Info`;
      const floaty = this.componentFactory.createFloatyFooter(floatyText, this.padWidth, async () => {
        input.dispatch("selectStation", null);
        await ticker.nextFrame();
        main.popups.__autoExpandPopups__ = true;
        await ticker.nextFrame();
        input.dispatch("selectStation", station, true);
      });
      this.addChild(floaty);
    }

    await this.fadeChildrenIn(0.04);
  }
}
