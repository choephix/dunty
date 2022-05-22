import { GameContext } from "@game/app/app";
import { Container, IDestroyOptions } from "@pixi/display";
import { RailRunsWindowComponentFactory } from "../components/RailRunsWindowComponentFactory";
import { RailRunsMyTrainsListBox } from "../components/RailRunsMyTrainsListBox";
import { formatTimeDurationHumanReadable } from "@game/asorted/formatTimeDurationHumanReadable";
import { GameSingletons } from "@game/app/GameSingletons";

/**
 * The "declare" keyword is used to make sure only types can live inside the
 * module, producing no javascript code on build.
 */
export declare module RailRunsMyTrainsListRowData {
  export type QuickActionType = null | "claim" | "clear";
}

export interface RailRunsMyTrainsListRowData {
  name: string;
  region: string;
  status: string;
  quickAction: RailRunsMyTrainsListRowData.QuickActionType;
}

export class RailRunsMyTrainsPage extends Container {
  private readonly context: GameContext = GameSingletons.getGameContext();

  private list: RailRunsMyTrainsListBox | null = null;

  constructor(public readonly componentFactory: RailRunsWindowComponentFactory) {
    super();

    //// //// //// //// //// //// //// //// ////
    //// Page Title
    //// //// //// //// //// //// //// //// ////
    const title = this.componentFactory.addTitle("MY TRAINS");
    title.position.set(165, 100);
    this.addChild(title);

    //add trains header row
    const trainsHeaderRow = this.componentFactory.createTrainsHeaderRow();
    this.addChild(trainsHeaderRow);
  }

  private async loadTrainsData(): Promise<RailRunsMyTrainsListRowData[]> {
    const { userData, mapData } = this.context;
    const myTrains = [...userData.trains.values()];

    // return mockRailRunTrainsData;

    return myTrains.map(train => {
      const currentStation = train.currentStationId && mapData.stations.get(train.currentStationId);

      function getTrainStatusText() {
        const run = train.currentOngoingRun;
        const currentDestination =
          train.currentDestinationStationId && mapData.stations.get(train.currentDestinationStationId);
        if (run && currentDestination) {
          const stationName = currentDestination?.name || "?";
          const timeLeft = formatTimeDurationHumanReadable(run.secondsLeft);
          if (run.isReadyToClaim) {
            return `In Transit to ${stationName}`;
          } else {
            return `In Transit to ${stationName} (${timeLeft})`;
          }
        } else {
          const stationName = currentStation?.name || "?";
          return `Idle at ${stationName}`;
        }
      }

      const getTrainActionType = () => {
        if (train.isTampered) {
          return "clear";
        }
        if (train.currentOngoingRun?.isReadyToClaim) {
          return "claim";
        }
        return null;
      };

      return {
        name: train.name.toUpperCase(),
        region: currentStation?.region.toUpperCase() || "?",
        status: getTrainStatusText(),
        quickAction: getTrainActionType(),
      };
    });
  }

  async populateList() {
    if (this.list) {
      this.list.destroy({ children: true });
      this.list = null;
    }

    const trainsData = await this.loadTrainsData();

    //add trains table rows
    this.list = new RailRunsMyTrainsListBox(trainsData, this.componentFactory, this.context);
    this.list.x = 200;
    this.list.y = 360;
    this.addChild(this.list);
  }

  destroy(options?: boolean | IDestroyOptions): void {
    if (this.list) {
      this.list.destroy({ children: true });
      this.list = null;
    }

    super.destroy(options);
  }
}
