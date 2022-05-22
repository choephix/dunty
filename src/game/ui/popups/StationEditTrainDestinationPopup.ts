import { formatTimeDurationHumanReadable } from "@game/asorted/formatTimeDurationHumanReadable";
import { FontIcon } from "@game/constants/FontIcon";
import { ThemeColors } from "@game/constants/ThemeColors";
import { PotentialRailRunStats } from "@game/data/entities/PotentialRailRunStats";
import { TrainEntity } from "@game/data/entities/TrainEntity";
import { formatToMaxDecimals } from "@sdk-ui/utils/formatToMaxDecimals";
import { StationPopup } from "./bases/StationPopup";
import { StationPopupBackgroundType } from "./components/StationPopupBackgroundType";
import { PopupPlacementFunction } from "./util/PopupPlacementFunction";

export class StationEditTrainDestinationPopup extends StationPopup {
  public readonly placementFunc: PopupPlacementFunction = PopupPlacementFunction.sidewaysSmart;

  async fillContent_Default() {
    const { station } = this;

    if (!station) {
      throw new Error("StationDashboardPopup: station is not set");
    }

    const { main, userData } = this.context;

    this.setPadBackground(StationPopupBackgroundType.EDIT_TRAIN_DESTINATION);

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
      const destinationStation = station;
      const { train: baseTrain, trainStation: departureStation } = main.faq.getSelectedTrainAndStation();

      let hypoTrain = null as null | TrainEntity;
      let trainToShow = hypoTrain ?? baseTrain;
      const potentialRun = new PotentialRailRunStats();
      function updateData(hypo: TrainEntity | null) {
        hypoTrain = hypo;
        trainToShow = hypoTrain ?? baseTrain;
        potentialRun.update(hypoTrain || baseTrain, departureStation, destinationStation);
      }

      const clearEventListener = main.cards.events.on({
        hypotheticalTrainChange: updateData,
      });
      this.onDestroy(clearEventListener);

      const COLUMNS_Y = 173;
      const COLUMNS_MARGIN_X = 63;
      const { NORMAL_COLOR, DANGER_COLOR } = ThemeColors;

      const get = {
        maxTrainDistance: () => trainToShow.locomotiveStats?.distance ?? 0,
        availableFuel: () => (trainToShow.fuelTypeLowerCase && userData.fuel[trainToShow.fuelTypeLowerCase]) ?? 0,
      };

      updateData(null);

      const columns = [
        {
          icon: FontIcon.Distance,
          title: `Distance`,
          value: () => potentialRun.distance,
          color: () => (potentialRun.distance <= get.maxTrainDistance() ? NORMAL_COLOR : DANGER_COLOR),
          format: (n: number) => formatToMaxDecimals(n, 1),
          x: COLUMNS_MARGIN_X,
        },
        {
          icon: FontIcon.Fuel,
          title: `Fuel`,
          value: () => potentialRun.fuelCost,
          color: () => (potentialRun.fuelCost <= get.availableFuel() ? NORMAL_COLOR : DANGER_COLOR),
          format: (n: number) => formatToMaxDecimals(n, 1),
          x: 0.5 * this.width,
        },
        {
          icon: FontIcon.Duration,
          title: `Time`,
          value: () => potentialRun.duration,
          format: formatTimeDurationHumanReadable,
          color: NORMAL_COLOR,
          x: this.width - COLUMNS_MARGIN_X,
        },
      ];

      for (const { x, icon, title, value, color, format } of columns) {
        const column = this.componentFactory.createStatsColumn();
        column.appendBigHugeFontIcon(icon, color);
        column.appendSpacing(8);
        column.appendSmallLabel(title, color);
        column.appendBigHugeNumber(value, color, format);
        column.position.set(x, COLUMNS_Y);
        this.addChild(column);
      }
    } catch (e) {
      console.error(e);
    }

    //// X Close Button
    this.componentFactory.addXCloseButton();

    await this.fadeChildrenIn();
  }
}
