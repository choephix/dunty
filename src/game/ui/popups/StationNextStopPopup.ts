import { PotentialRailRunStats } from "@game/data/entities/PotentialRailRunStats";
import { toPotentialRunStatsString } from "../formatters/formatRailRunStats";
import { StationPopup } from "./bases/StationPopup";
import { StationPopupBackgroundType } from "./components/StationPopupBackgroundType";
import { PopupPlacementFunction } from "./util/PopupPlacementFunction";

export class StationNextStopPopup extends StationPopup {
  public readonly placementFunc: PopupPlacementFunction = PopupPlacementFunction.topTooltip;

  interactive = true;
  buttonMode = true;

  async fillContent_Default() {
    const { station } = this;

    if (!station) {
      throw new Error("StationDashboardPopup: station is not set");
    }

    const { assets, main, mapData } = this.context;

    this.setPadBackground(StationPopupBackgroundType.NEXT_STOP);

    {
      const titleText = station.name;
      const title = this.componentFactory.createTitle(titleText, this.width);
      title.y = 32;
      title.anchor.set(0.0);
      this.addChild(title);
    }

    {
      try {
        const destinationStation = station;
        const { train, trainStation: departureStation } = main.faq.getSelectedTrainAndStation();

        const potentialRun = new PotentialRailRunStats(train, departureStation, destinationStation);

        {
          const potentialRunStatsText = toPotentialRunStatsString(potentialRun);
          const potentialRunStatsRibbon = this.componentFactory.createInfoRibbon(
            potentialRunStatsText,
            `ui-popups/bg-lvl1-btm-info.png`
          );
          potentialRunStatsRibbon.position.set(this.centerX, 130);
          this.addChild(potentialRunStatsRibbon);
        }

        if (potentialRun.isBacktracking) {
          this.componentFactory.addWarning_BackTracking();
        }
      } catch (e) {
        console.error(e);
      }
    }

    const commodityRateIcons = this.componentFactory.addCommodityRateIcons(station);
    commodityRateIcons.position.set(this.centerX, 164);

    await this.fadeChildrenIn();
  }
}
