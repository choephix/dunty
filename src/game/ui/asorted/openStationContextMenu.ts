import { GameSingletons } from "@game/app/GameSingletons";
import { FontIcon } from "@game/constants/FontIcon";
import { StationEntity } from "@game/data/entities/StationEntity";
import { TrainEntity } from "@game/data/entities/TrainEntity";
import { DropdownMenuButtonOptions } from "../popups/components/DropdownMenu";

export function openStationContextMenu(station: StationEntity) {
  const { input, main, userData, mapData } = GameSingletons.getGameContext();

  const unclaimedRuns = [...main.faq.iterateUnclaimedRailRunsAtStation(station)];
  const trainsAtStation = [...main.faq.iterateIdleTrainsAtStation(station)];
  const trainsAtNeighbouringStations = [...main.faq.iterateIdleTrainsNearStation(station)];

  const SEPARATOR = "  ";
  const buttonsOptions: DropdownMenuButtonOptions[] = [
    {
      text: `${FontIcon.CenturyTrain}${SEPARATOR}Station Info`,
      disabled: false,
      onClick: () => {
        main.popups.clear();
        main.popups.__autoExpandPopups__ = true;
        input.dispatch("selectStation", station);
      },
    },
    ...unclaimedRuns.map(unclaimedRun => ({
      text: `${FontIcon.Tocium}${SEPARATOR}Claim! (${unclaimedRun.trainName.toUpperCase()})`,
      disabled: false,
      onClick: () => {
        return input.dispatch("claimRunRewards", unclaimedRun);
      },
    })),
    ...trainsAtStation.map(train => ({
      text: `${FontIcon.LocoAlt}${SEPARATOR}${train.name.toUpperCase()}`,
      disabled: false,
      onClick: () => {
        main.popups.clear();
        input.dispatch("selectTrain", train as TrainEntity);
      },
    })),
    ...trainsAtNeighbouringStations.map(train => ({
      text: `${FontIcon.Fuel}${SEPARATOR}Dispatch ${train.name.toUpperCase()} this way`,
      disabled: false,
      onClick: () => {
        main.popups.clear();
        const trainStation = mapData.stations.get(train.currentStationId!);
        if (!trainStation) {
          throw new Error("Train station not found");
        }
        main.selection.selectedTrain = train as TrainEntity;
        input.dispatch("enterDispatchView", train as TrainEntity, station);
      },
    })),
    {
      text: `${FontIcon.CenturyTrain}${SEPARATOR}View ${station.ownerName.toUpperCase()}'s Profile`,
      // disabled: station.ownerName == userData.name,
      disabled: false,
      onClick: async () => {
        main.popups.clear();
        main.social.open(station.ownerName);
      },
    },
    {
      text: `${FontIcon.CenturyTrain}${SEPARATOR}Station Owner Dashboard`,
      disabled: station.ownerName !== userData.name,
      onClick: async () => {
        main.popups.clear();
        main.popups.myStationDashboard.setCurrentStation(station);
      },
    },
  ];

  main.popups.clear();
  main.hud.contextMenu.setCurrentMenu(buttonsOptions);
}
