import { GameSingletons } from "@game/app/GameSingletons";
import { StationClickWithMyTrain } from "@game/ui/popups/StationClickWithMyTrain";
import { StationDispatchDeparturePopup } from "@game/ui/popups/StationDispatchDeparturePopup";
import { StationDispatchDestinationPopup } from "@game/ui/popups/StationDispatchDestinationPopup";
import { StationHoverPopup } from "@game/ui/popups/StationHoverPopup";
import { StationNextStopPopup } from "@game/ui/popups/StationNextStopPopup";
import { InteractionData } from "@pixi/interaction";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { buttonizeInstance } from "@sdk-ui/buttonize";
import { StationPopup } from "./bases/StationPopup";
import { popupsServiceFactory } from "./popup-service-factory";
import { StationAddonConductorLoungePopup } from "./StationAddonConductorLoungePopup";
import { StationAddonRailYardPopup } from "./StationAddonRailYardPopup";
import { StationClickUnrelatedInfoPopup } from "./StationClickUnrelatedInfoPopup";
import { StationDashboardPopup } from "./StationDashboardPopup";
import { StationEditTrainCompositionPopup } from "./StationEditTrainCompositionPopup";
import { StationEditTrainDestinationPopup } from "./StationEditTrainDestinationPopup";
import { StationEditTrainLoadoutPopup } from "./StationEditTrainLoadoutPopup";

const factory = popupsServiceFactory;

export function makeStationHoverPopupService() {
  const service = factory.makeSingletonStationPopupService(StationHoverPopup);
  return service;
}

export function makeStationEditTrainCompositionPopupService() {
  const context = GameSingletons.getGameContext();
  const { input } = context;
  const service = factory.makeSingletonStationPopupService(StationEditTrainCompositionPopup, currentPopup => {
    const { station } = currentPopup;
    if (station == null) {
      throw new Error("station is null");
    }
    currentPopup.events.on({
      onClick_LoadingDock: () => input.dispatch("enterLoadingDockView", context.main.selection.selectedTrain!),
      onClick_Close: () => input.dispatch("resetSelection"),
    });
  });
  return service;
}

export function makeStationEditTrainLoadoutPopupService() {
  const context = GameSingletons.getGameContext();
  const { input } = context;
  const service = factory.makeSingletonStationPopupService(StationEditTrainLoadoutPopup, currentPopup => {
    const { station } = currentPopup;
    if (station == null) {
      throw new Error("station is null");
    }
    currentPopup.events.on({
      onClick_EditTrain: () => input.dispatch("enterEditTrainView", context.main.selection.selectedTrain!),
      onClick_Close: () => input.dispatch("resetSelection"),
    });
  });
  return service;
}

export function makeStationEditTrainDestinationPopupService() {
  const context = GameSingletons.getGameContext();
  const { input } = context;
  const service = factory.makeSingletonStationPopupService(StationEditTrainDestinationPopup, currentPopup => {
    currentPopup.events.on({
      onClick_Close: () => input.dispatch("selectDestination", null),
    });
  });
  return service;
}

export function makeStationClickWithMyTrainService() {
  const context = GameSingletons.getGameContext();
  const { input, sfx, contracts } = context;
  const service = factory.makeSingletonStationPopupService(StationClickWithMyTrain, currentPopup => {
    const { station } = currentPopup;
    if (station == null) {
      throw new Error("station is null");
    }
    currentPopup.events.on({
      onClick_NextStop: () => input.dispatch("enterNextStopView", context.main.selection.selectedTrain!),
      onClick_EditTrain: () => input.dispatch("enterEditTrainView", context.main.selection.selectedTrain!),
      onClick_Close: () => input.dispatch("resetSelection"),
    });

    const hasBillboard = !!station.billboardIPFSHash;
    if (hasBillboard && station.ownerName !== contracts.currentUserName) {
      currentPopup.setExpanded(false);
      buttonizeDisplayObject(currentPopup, () => {
        sfx.play("clickRegular");
        currentPopup.setExpanded(true);
      });
    } else {
      currentPopup.setExpanded(true);
    }
  });
  return service;
}

export function makeStationNextStopPopupService() {
  const context = GameSingletons.getGameContext();
  const { input, animator } = context;
  const service = factory.makeMultipleStationPopupsService(StationNextStopPopup, currentPopup => {
    buttonizeInstance(currentPopup).behavior.on({
      trigger: (edata: InteractionData) => {
        const { station } = currentPopup;
        if (station == null) {
          throw new Error("station is null");
        }
        input.dispatch("clickOnStation", station, edata);
      },
      hoverIn: () =>
        animator.tween.to(currentPopup, {
          pixi: { scale: StationPopup.SCALE * 1.1 },
          duration: 0.12,
        }),
      hoverOut: () =>
        animator.tween.to(currentPopup, {
          pixi: { scale: StationPopup.SCALE },
          duration: 0.18,
        }),
    });
  });
  return service;
}

export function makeStationDispatchDeparturePopup() {
  const context = GameSingletons.getGameContext();
  const { input } = context;
  const service = factory.makeSingletonStationPopupService(StationDispatchDeparturePopup, currentPopup => {
    const { station } = currentPopup;
    if (station == null) {
      throw new Error("station is null");
    }
    currentPopup.events.on({
      onClick_LoadingDock: () => input.dispatch("enterLoadingDockView", context.main.selection.selectedTrain!),
      onClick_EditTrain: () => input.dispatch("enterEditTrainView", context.main.selection.selectedTrain!),
      onClick_Close: () => input.dispatch("resetSelection"),
    });
  });
  return service;
}

export function makeStationDispatchDestinationPopup() {
  const context = GameSingletons.getGameContext();
  const { input, modals } = context;
  const service = factory.makeSingletonStationPopupService(StationDispatchDestinationPopup, currentPopup => {
    const { station } = currentPopup;
    if (station == null) {
      throw new Error("station is null");
    }
    currentPopup.events.on({
      onClick_Dispatch: () => {
        const runStats = currentPopup.potentialRunStats;
        if (runStats == null) {
          throw new Error("runStats is null");
        }
        if (runStats.errors.length > 0) {
          return modals.warning(`Rail run is not possible.\n\n` + runStats.errors.join("\n"));
        }
        input.dispatch("startRun", runStats);
      },
      onClick_Close: () => input.dispatch("selectDestination", null),
    });
  });
  return service;
}

export function makeUnrelatedStationInfoPopupService() {
  const context = GameSingletons.getGameContext();
  const { sfx } = context;
  const service = factory.makeSingletonStationPopupService(StationClickUnrelatedInfoPopup, currentPopup => {
    //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP ////
    if (context.main.popups.__autoExpandPopups__) {
      currentPopup.setExpanded(true);
      return;
    }
    //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP ////

    currentPopup.setExpanded(false);

    const { behavior } = buttonizeInstance(currentPopup);
    const stopHoverEvents = behavior.on({
      hoverIn: () => void (currentPopup.mouseIsOver = true),
      hoverOut: () => void (currentPopup.mouseIsOver = false),
    });
    const stopClickEvents = behavior.on({
      trigger: () => {
        stopClickEvents();
        stopHoverEvents();
        sfx.play("clickRegular");
        currentPopup.setExpanded(true);
      },
    });
  });
  return service;
}

export function makeStationDashboardPopupService() {
  const service = factory.makeSingletonStationPopupService(StationDashboardPopup);
  return service;
}

export function makeStationAddonRailYardPopupService() {
  const service = factory.makeSingletonStationPopupService(StationAddonRailYardPopup);
  return service;
}

export function makeStationAddonConductorLoungePopupService() {
  const service = factory.makeSingletonStationPopupService(StationAddonConductorLoungePopup);
  return service;
}
