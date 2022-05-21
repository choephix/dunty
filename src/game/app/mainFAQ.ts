import { __DEBUG__ } from "@debug/__DEBUG__";
import { PotentialRailRunStats } from "@game/data/entities/PotentialRailRunStats";
import { RailRunEntity } from "@game/data/entities/RailRunEntity";
import { StationEntity } from "@game/data/entities/StationEntity";
import { TrainEntity } from "@game/data/entities/TrainEntity";
import { StationAssetId, TrainName } from "@sdk-integration/contracts";
import { clamp } from "@sdk/utils/math";
import { ReadonlyDeep, ReadonlyObjectDeep } from "type-fest/source/readonly-deep";
import { GameContext } from "./app";

export class MainFAQ {
  public constructor(private readonly context: GameContext) {}

  getStationToStationRailTrack(stationA: StationEntity, stationB: StationEntity) {
    const { railPaths } = this.context.mapData;

    const path = railPaths.find(path => path.hasStations(stationA, stationB));
    if (!path) {
      return null;
    }

    return path;
  }

  getTrainCurrentTrack(train: ReadonlyDeep<TrainEntity>) {
    const { stations } = this.context.mapData;

    const currentStation = train.currentStationId && stations.get(train.currentStationId);
    if (!currentStation) {
      return null;
    }

    const destinationStation = train.currentDestinationStationId && stations.get(train.currentDestinationStationId);
    if (!destinationStation) {
      return null;
    }

    const ongoingRun = train.currentOngoingRun;
    if (!ongoingRun) {
      return null;
    }

    if (ongoingRun.isReadyToClaim) {
      return null;
    }

    return this.getStationToStationRailTrack(currentStation, destinationStation);
  }

  getTrainLocationOnMap(train: ReadonlyDeep<TrainEntity>) {
    const { stations } = this.context.mapData;

    const currentStation = train.currentStationId && stations.get(train.currentStationId);
    if (!currentStation) {
      return null;
    }

    const destinationStation = train.currentDestinationStationId && stations.get(train.currentDestinationStationId);
    if (!destinationStation) {
      return currentStation;
    }

    const ongoingRun = train.currentOngoingRun;
    if (!ongoingRun) {
      return currentStation;
    }

    if (ongoingRun.isReadyToClaim) {
      return destinationStation;
    }

    const track = this.getStationToStationRailTrack(currentStation, destinationStation);
    if (!track) {
      return currentStation;
    }

    let progress = this.getRailRunProgress(ongoingRun);
    if (track.stationB == destinationStation) {
      progress = 1 - progress;
    }

    return track.getPointLocationAtLength(progress * track.length);
  }

  getRailRunProgress(run: ReadonlyObjectDeep<RailRunEntity>) {
    const { userData, mapData } = this.context;
    const train = userData.trains.get(run.trainName);
    const currentStation = mapData.stations.get(run.origin);
    const destinationStation = mapData.stations.get(run.destination);

    const ongoingRunStats = new PotentialRailRunStats(train, currentStation, destinationStation);
    return clamp(run.secondsLeft / ongoingRunStats.duration, 0, 1);
  }

  hasTrainEmptyRailcar(train: ReadonlyDeep<TrainEntity> | TrainName) {
    train = typeof train === "string" ? this.context.userData.trains.get(train)! : train;

    let emptyRC: boolean = false;
    for (let i = 0; i < train.railCars.length; i++) {
      const stats = train.getRailCarLoadStats(train.railCars[i]);
      if (stats.capacityUtilized == 0) {
        emptyRC = true;
        break;
      }
    }
    return emptyRC;
  }

  hasIdleTrainsAtStation(station: ReadonlyDeep<StationEntity> | StationAssetId) {
    return [...this.iterateIdleTrainsAtStation(station)].length > 0;
  }

  *iterateIdleTrainsAtStation(station: ReadonlyDeep<StationEntity> | StationAssetId) {
    const stationId = typeof station === "string" ? station : station.assetId;
    for (const train of this.context.userData.trains.values()) {
      if (train.currentOngoingRun == null) {
        if (train.currentStationId === stationId) {
          yield train;
        }
      }
    }
  }

  *iterateIdleTrainsNearStation(station: ReadonlyDeep<StationEntity> | StationAssetId) {
    station = typeof station === "string" ? this.context.mapData.stations.get(station)! : station;

    if (!station) throw new Error("Station not found");

    for (const link of station.links) {
      const nearStationId = link.assetId;
      for (const train of this.context.userData.trains.values()) {
        if (train.currentOngoingRun == null) {
          if (train.currentStationId === nearStationId) {
            yield train;
          }
        }
      }
    }
  }

  getFirstTrainAtStation(station: ReadonlyDeep<StationEntity> | StationAssetId) {
    const stationId = typeof station === "string" ? station : station.assetId;
    for (const train of this.context.userData.trains.values()) {
      if (train.currentOngoingRun == null) {
        if (train.currentStationId === stationId) {
          return train as TrainEntity;
        }
      }
    }
    return null;
  }

  getFirstTrainInTransitToStation(station: ReadonlyDeep<StationEntity> | StationAssetId) {
    const stationId = typeof station === "string" ? station : station.assetId;
    for (const train of this.context.userData.trains.values()) {
      if (train.currentDestinationStationId === stationId) {
        return train;
      }
    }
    return null;
  }

  getSelectedTrainAndStation() {
    const station = this.context.main.selection.selectedStation;
    if (!station) {
      throw new Error("No station selected");
    }
    const train = this.context.main.selection.selectedTrain;
    if (!train) {
      throw new Error(`No user train found on station ${station.name}.`);
    }
    return { train, trainStation: station };
  }

  *iterateUnclaimedRailRunsAtStation(station: ReadonlyDeep<StationEntity>) {
    for (const [, run] of this.context.userData.trainsOngoingRuns) {
      if (run.destination === station.assetId && run.isReadyToClaim) {
        yield run;
      }
    }
  }

  getTrainCurrentStation(train: ReadonlyDeep<TrainEntity> | TrainName) {
    train = typeof train === "string" ? this.context.userData.trains.get(train)! : train;
    if (!train) throw new Error("Train not found");
    if (!train.currentStationId) throw new Error("Train has no current station");
    const station = this.context.mapData.stations.get(train.currentStationId);
    if (!station) throw new Error("Train has invalid current station");
    return station;
  }

  getUnclaimedRailRun = (station: ReadonlyDeep<StationEntity>) => {
    const currentArrivingRun = this.context.userData.stationsIncomingRuns.get(station.assetId);
    return currentArrivingRun?.isReadyToClaim && currentArrivingRun;
  };
}
