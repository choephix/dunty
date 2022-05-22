import { FontIcon } from "@game/constants/FontIcon";
import { StationPopup } from "./bases/StationPopup";
import { StationPopupBackgroundType } from "./components/StationPopupBackgroundType";
import { PopupPlacementFunction } from "./util/PopupPlacementFunction";

export class StationHoverPopup extends StationPopup {
  public readonly placementFunc: PopupPlacementFunction = PopupPlacementFunction.sidewaysSmart;

  interactive = false;
  interactiveChildren = false;

  async fillContent_Default() {
    const { station, componentFactory } = this;
    const { main } = this.context;

    if (!station) {
      throw new Error("StationDashboardPopup: station is not set");
    }

    this.setPadBackground(StationPopupBackgroundType.IDLE_HOVER);

    {
      const titleText = station.name;
      const title = componentFactory.createTitle(titleText, this.width);
      this.addChild(title);
    }

    {
      const ownerName = station.ownerName;
      const labelText = `Owned by ${ownerName}`;
      const label = componentFactory.createLabel(labelText, this.width, {
        style: {
          fontSize: 12,
        },
        position: { x: 26, y: 157 },
        scaleFactor: 2.0,
      });
      this.addChild(label);
    }

    {
      const labelText = `My trains at this location:`;
      const label = componentFactory.createLabel(labelText, this.width, {
        style: {
          fontSize: 12,
          strokeThickness: 0,
        },
        position: {
          x: 31,
          y: 190,
        },
        scaleFactor: 2.0,
      });
      this.addChild(label);
    }

    const trains = [...main.faq.iterateIdleTrainsAtStation(station)];
    const addInfoLine = (labelText: string, y: number) => {
      const label = componentFactory.createLabel(labelText, this.width, {
        style: {
          fontSize: 12,
          strokeThickness: 0,
        },
        position: { x: 50, y: y },
        scaleFactor: 2.0,
      });
      this.addChild(label);
    };

    const MAX_TRAINS_TO_DISPLAY = 1;
    for (const [i, train] of trains.entries()) {
      const { name } = train;

      if (i < MAX_TRAINS_TO_DISPLAY) {
        addInfoLine(`${FontIcon.LocoLegacy} ${name}`, 213 + i * 26);
      } else {
        addInfoLine(`And ${trains.length - i} more...`, 213 + i * 26);
        break;
      }
    }

    {
      const labelText = `(click for more options)`;
      const label = componentFactory.createLabel(labelText, this.width, {
        style: {
          fontSize: 8,
          strokeThickness: 0,
        },
        position: { x: 144, y: 271 },
        anchor: { x: 0.5, y: 0.5 },
        scaleFactor: 2.0,
      });
      this.addChild(label);
    }

    await this.fadeChildrenIn();
  }
}
