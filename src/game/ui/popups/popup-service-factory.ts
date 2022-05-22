import { GameContext } from "@game/app/app";

import { StationPopup } from "./bases/StationPopup";
import { StationEntity } from "@game/data/entities/StationEntity";
import { GameSingletons } from "@game/app/GameSingletons";

export const popupsServiceFactory = {
  makeSingletonStationPopupService<T extends StationPopup>(
    Constructor: new (context: GameContext) => T,
    onNewPopup?: (popup: T) => void
  ) {
    let currentPopup = null as null | InstanceType<typeof Constructor>;
    let currentStation = null as null | StationEntity;
    const context = GameSingletons.getGameContext();
    return {
      setCurrentStation(station: StationEntity | null) {
        try {
          const manager = context.main.popups;

          if (station === currentStation) {
            return;
          }

          if (currentPopup) {
            manager.remove(currentPopup);
            currentPopup = null;
          }

          currentStation = station;

          if (station != null) {
            const stationVisual = context.world?.getStationVisual(station)!;
            const popup = new Constructor(context);
            popup.station = station;
            popup.zIndex = 9;
            popup.fillContent_Default().catch(error => console.error(error));
            onNewPopup?.(popup);
            manager.add(popup, stationVisual);
            currentPopup = popup;
          }
        } catch (error) {
          console.error(error);
        }
      },
      clear() {
        this.setCurrentStation(null);
      },
      get currentStation() {
        return currentStation;
      },
      get currentPopup() {
        return currentPopup;
      },
    };
  },

  makeMultipleStationPopupsService<T extends StationPopup>(
    Constructor: new (context: GameContext) => T,
    onNewPopup?: (popup: T) => void
  ) {
    let currentPopups = new Array<StationPopup>();
    let currentStations = new Array<StationEntity>();
    const context = GameSingletons.getGameContext();
    return {
      setCurrentStations(stationDatas: StationEntity[]) {
        try {
          const manager = context.main.popups;

          for (const currentPopup of currentPopups) {
            manager.remove(currentPopup);
          }
          currentPopups.length = 0;
          currentStations.length = 0;

          currentStations.push(...stationDatas);
          for (const station of stationDatas) {
            const stationVisual = context.world?.getStationVisual(station)!;
            const popup = new Constructor(context);
            popup.station = station;
            popup.zIndex = 20;
            popup.fillContent_Default();
            onNewPopup?.(popup);
            manager.add(popup, stationVisual);
            currentPopups.push(popup);
          }
        } catch (error) {
          console.error(error);
        }
      },
      clear() {
        this.setCurrentStations([]);
      },
      get currentStations() {
        return currentStations;
      },
      get currentPopups() {
        return currentPopups;
      },
    };
  },
};

export type PopupsServiceFactory = typeof popupsServiceFactory;
export type PopupsService = ReturnType<PopupsServiceFactory["makeMultipleStationPopupsService"]> &
  ReturnType<PopupsServiceFactory["makeSingletonStationPopupService"]>;
