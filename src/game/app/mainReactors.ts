import { RailRunEntity } from "@game/data/entities/RailRunEntity";
import { StationEntity } from "@game/data/entities/StationEntity";
import { TrainEntity } from "@game/data/entities/TrainEntity";
import { checkForStoryProgress } from "@game/gameplay/checkForStoryProgress";
import { claimRailRunRewards } from "@game/gameplay/claimRailRunRewards";
import { startNewRailRun } from "@game/railruns/startNewRailRun";
import { openStationContextMenu } from "@game/ui/asorted/openStationContextMenu";
import { HUD } from "@game/ui/hud/HUD";
import { CogWheelMenuMode } from "@game/ui/wheel/CogWheelMenu";
import { World, WorldZoomLevel } from "@game/world/World";
import { ReadonlyObjectDeep } from "type-fest/source/readonly-deep";
import { GameContext } from "./app";
import { GameViewMode } from "./main";

/**
 * Input reactor
 */
export function handleInputEvents(context: GameContext) {
  const { input, sfx, main, mapData, userData, userDataCtrl, contracts, spinner, modals } = context;

  input.on({
    enterEditTrainView(train) {
      main.selection.selectedTrain = train;
      main.selection.selectedStation = main.faq.getTrainCurrentStation(train);
      main.setViewMode(GameViewMode.EDIT_TRAIN) || main.setViewMode(GameViewMode.NORMAL);
    },

    enterLoadingDockView(train) {
      main.selection.selectedTrain = train;
      main.selection.selectedStation = main.faq.getTrainCurrentStation(train);
      main.setViewMode(GameViewMode.LOADING_DOCK) || main.setViewMode(GameViewMode.NORMAL);
    },

    enterNextStopView(train) {
      main.selection.selectedTrain = train;
      main.selection.selectedStation = main.faq.getTrainCurrentStation(train);
      main.setViewMode(GameViewMode.NEXT_STOP) || main.setViewMode(GameViewMode.NORMAL);
    },

    enterDispatchView(train, destination) {
      main.selection.selectedTrain = train;
      main.selection.selectedStation = main.faq.getTrainCurrentStation(train);
      main.selection.selectedDestination = destination;
      main.setViewMode(GameViewMode.DISPATCH);
    },

    selectDestination(station) {
      main.selection.selectedDestination = station;
      main.popups.dispatchDestination.clear();
      main.popups.editTrainDestination.clear();

      if (main.viewMode === GameViewMode.DISPATCH && main.selection.selectedTrain) {
        main.setViewMode(GameViewMode.NEXT_STOP);
        return;
      }

      if (main.viewMode === GameViewMode.EDIT_TRAIN && main.selection.selectedTrain) {
        return;
      }

      main.setViewMode(GameViewMode.NORMAL);
    },

    selectTrain(train) {
      main.selection.selectedTrain = train;
      if (train) {
        if (train.currentStationId) {
          const station = mapData.stations.get(train.currentStationId) || null;
          main.selection.selectedStation = station;
        }
      } else {
        input.dispatch("resetSelection");
      }
    },

    selectStation(station) {
      main.selection.selectedTrain = null;
      if (station) {
        main.selection.selectedStation = station;
      } else {
        input.dispatch("resetSelection");
      }
    },

    resetSelection() {
      main.selection.clear();
      main.popups.clear();
      main.setViewMode(GameViewMode.NORMAL);
    },

    openStationDashboard(station) {
      input.dispatch("resetSelection");
      main.popups.myStationDashboard.setCurrentStation(station);
    },

    async claimRunRewards(unclaimedRun: ReadonlyObjectDeep<RailRunEntity>) {
      main.popups.clear();

      await claimRailRunRewards(unclaimedRun);

      context.HACKS.__lastSelectedTrain = userData.trains.get(unclaimedRun.trainName);
      await checkForStoryProgress();
    },

    async clickOnStation(station, interactionData) {
      sfx.play("clickTiny");

      if (station === main.selection.selectedStation) {
        input.dispatch("resetSelection");
      } else {
        switch (main.viewMode) {
          case GameViewMode.NORMAL:
            /**
             * In any case, if the user clicked with any button other than the
             * left mouse button, then there is nothing to do here
             */
            if (interactionData.button !== 0) {
              if (interactionData.button === 2) {
                openStationContextMenu(station);
              }
              return;
            }

            /**
             * Whether this was a "dismiss" click, or new popups will be
             * spawned as part of the next step in a ux flow, any previously
             * open popups should be cleared in every case.
             */
            main.popups.clear();

            /**
             * First check if there's an unclaimed rail run at this station.
             * If there is, then override any other functionality and perform
             * the claim action for that the rail run, which will include
             * confirmation popups, any potential NPC encounter cinematics,
             * and the rail run report modal.
             */
            const unclaimedRun = main.faq.getUnclaimedRailRun(station) || null;
            if (unclaimedRun) {
              return input.dispatch("claimRunRewards", unclaimedRun);
            }

            /**
             * Check whether this is a station currently owned by the user.
             * If so, then show the "Station Dashboard" popup.
             */
            const isMyStation = station.ownerName === userData.name;
            if (isMyStation) {
              return input.dispatch("openStationDashboard", station);
            }

            /**
             * The correct popup service will hear about this change and
             * show the appropriate popup.
             */
            const firstTrain = main.faq.getFirstTrainAtStation(station);
            if (firstTrain) {
              input.dispatch("selectTrain", firstTrain);
            } else {
              input.dispatch("selectStation", station);
            }

            break;

          case GameViewMode.NEXT_STOP:
            if (!main.selection.isViablelDestination(station)) {
              break;
            }

            const selectedStation = main.selection.selectedStation;
            if (!selectedStation) {
              throw new Error("No selected station");
            }

            const selectedTrain = main.selection.selectedTrain;
            if (!selectedTrain) {
              throw new Error("No selected train");
            }

            input.dispatch("enterDispatchView", selectedTrain, station);
            break;

          case GameViewMode.DISPATCH:
            if (main.selection.isViablelDestination(station)) {
              main.selection.selectedDestination = station;
              main.popups.dispatchDestination.setCurrentStation(station);
              break;
            }

            main.setViewMode(GameViewMode.NORMAL);
            main.selection.clear();
            break;

          case GameViewMode.EDIT_TRAIN:
          case GameViewMode.LOADING_DOCK:
            if (main.selection.selectedDestination == station) {
              main.selection.selectedDestination = null;
              main.popups.editTrainDestination.setCurrentStation(null);
            } else if (main.selection.isViablelDestination(station)) {
              main.selection.selectedDestination = station;
              main.popups.editTrainDestination.setCurrentStation(station);
            }
            break;
        }
      }
    },

    async startRun(runStats) {
      const departureStation = runStats.departureStation;
      if (!departureStation) {
        throw new Error("No starting station selected");
      }

      const destinationStation = runStats.destinationStation;
      if (!destinationStation) {
        throw new Error("No destination station selected");
      }

      const train = runStats.train;
      if (!train) {
        throw new Error("No train on starting station");
      }

      ///////////////////////////////////////////////////////////////////////////////

      const hasTrainEmptyRailcar = context.main.faq.hasTrainEmptyRailcar(train);
      if (hasTrainEmptyRailcar == true) {
        const choice = await modals.confirm({
          title: "Empty Rail Car",
          content:
            "It looks like one or more of your equipped rail cars is empty! If you have extra commodities, add them to make the most of your rail run!",
          acceptButtonText: "Proceed Anyway",
          cancelButtonText: "Stop Rail Run",
          cornerDetailType: null,
        });
        if (!choice) return;
      }

      main.selection.clear();

      main.setViewMode(GameViewMode.BUSY);
      main.hud.title.setText(`Dispatching from ${departureStation.name} to ${destinationStation.name}...`);
      await spinner.showDuring(startNewRailRun(main.context, train, destinationStation), `Starting new Rail Run`);
      await spinner.showDuring(userDataCtrl.updateAll(), "Updating data after starting a new Rail Run...");

      sfx.play("chooChoo");

      // departureStation.trains.splice(departureStation.trains.indexOf(train), 1);
      // train.currentStationId = null;

      // const dot = makeRevolvingTocIcon(main.context);
      // dot.scale.set(0.5);
      // dot.position.x = departureStation.x * 32;
      // dot.position.y = departureStation.y * 32;
      // world.addChild(dot);
      // await animator.tween.from(dot, {
      //   pixi: { scale: 0 },
      //   duration: 0.15,
      //   delay: 0.25,
      // });
      // await animator.tween.to(dot, {
      //   x: destinationStation.x * 32,
      //   y: destinationStation.y * 32,
      //   duration: 2.5,
      //   ease: 'linear',
      // });
      // await animator.tween.to(dot, {
      //   pixi: { scale: 0 },
      //   duration: 0.1,
      // });
      // dot.destroy();
      // world.getStationVisual(destinationStation).playArrivalAnimation();

      // train.currentStationId = destinationStation.uid;
      // destinationStation.trains.push(train);

      main.setViewMode(GameViewMode.NORMAL);
    },

    async clearAndVerifyTrain(train) {
      console.log({ train }, `clearAndVerifyTrain`);
      await spinner.showDuring(
        context.contracts.clearAndVerifyTrain(train.name),
        `Clearing and verifying train ${train.name}`
      );
      await context.spinner.showDuring(
        Promise.all([
          context.input.dispatch("closeRailRunsWindow"),
          context.input.dispatch("closeMarketWindow"),
          context.userDataCtrl.updateAll(),
        ]),
        "Updating data after clearing and verifying a train..."
      );
    },

    toggleCardsDrawer() {
      switch (main.viewMode) {
        case GameViewMode.NORMAL:
        case GameViewMode.NEXT_STOP: {
          return main.cards.setCardDrawerState(main.cards.getCardDrawerState() ? null : { type: "inventory" });
        }
      }
    },

    closeCardsDrawer() {
      main.cards.setCardDrawerState(null);
    },

    async logOut() {
      const choice = await modals.confirm({
        title: contracts.currentUserName || "",
        content: "Are you sure you want to log out?",
      });

      if (!choice) {
        return;
      }

      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith("ual-") && key.startsWith("anchor-link-")) {
          localStorage.removeItem(key);
        }
      }

      context.firebase.auth.signOut();

      context.externals.logout();
    },
  });
}

/**
 *  On VIEW MODE or current active window change
 * - Update the screen title
 */
export function onViewModeChangeUpdateTitlePlate(context: GameContext) {
  const { main, stage } = context;

  stage.enchantments.watch.array(
    () => [
      main.viewMode,
      main.marketWindow.currentWindow?.isOpen,
      main.railRunsWindow.currentWindow?.isOpen,
      main.hud.railroaderDashboard.isOpen,
      main.immersiveMode,
    ],
    ([viewMode, isMarketWindowOpen, isRailRunsWindowdOpen, isRailroaderDashboardOpen, isImmersiveModeActive]) => {
      if (isImmersiveModeActive) {
        return main.hud.title.setText(null);
      }

      if (isRailroaderDashboardOpen) {
        return main.hud.title.setText(null);
      }

      if (isMarketWindowOpen) {
        return main.hud.title.setText("Market");
      }

      if (isRailRunsWindowdOpen) {
        return main.hud.title.setText("Rail Runs");
      }

      switch (viewMode) {
        case GameViewMode.NEXT_STOP:
          return main.hud.title.setText("Next Stop");
        case GameViewMode.DISPATCH:
          return main.hud.title.setText("Dispatch");
        case GameViewMode.EDIT_TRAIN:
          return main.hud.title.setText("Edit Train");
        case GameViewMode.LOADING_DOCK:
          return main.hud.title.setText("Loading Dock");
        case GameViewMode.BUSY:
          return main.hud.title.setText(null);
        default:
          return main.hud.title.setText(HUD.DEFAULT_HEADER_TEXT);
      }
    }
  );
}

/**
 *  On VIEW MODE or current active window change
 * - Update the main menu wheel (show tick if in edit mode)
 */
export function onViewModeChangeUpdateCogWheelMenu(context: GameContext) {
  const { main, stage } = context;

  stage.enchantments.watch(
    () => main.viewMode,
    viewMode => {
      const editModes = [GameViewMode.EDIT_TRAIN, GameViewMode.LOADING_DOCK];
      if (editModes.includes(viewMode)) {
        main.immersiveMode = false;
        main.hud.cogWheelMenu.setCurrentMode(CogWheelMenuMode.Confirm);
        main.hud.reasonsToHideCogWheelMenu.clear();
      } else {
        main.hud.cogWheelMenu.setCurrentMode(CogWheelMenuMode.Logo);
      }
    }
  );
}

/**
 *  On VIEW MODE change
 * - Hide all popups
 * - Show the correct new popup(s)
 */
export function onViewModeChangeUpdateStationPopups(context: GameContext) {
  const { main, stage, ticker, mapData } = context;

  stage.enchantments.watch(
    () => main.viewMode,
    async (viewMode, prevViewMode) => {
      main.popups.clear();

      await ticker.delay(0.08);

      if (viewMode === GameViewMode.NEXT_STOP) {
        const departureStation = main.selection.selectedStation;
        if (!departureStation) {
          throw new Error("No starting station selected");
        }

        const potentialDestinations = departureStation.links.map(link => mapData.stations.get(link.assetId)!);
        await ticker.delay(0.22);
        main.popups.nextStop.setCurrentStations([...potentialDestinations]);
      } else if (prevViewMode === GameViewMode.NEXT_STOP) {
        main.popups.nextStop.setCurrentStations([]);
      }

      if (viewMode === GameViewMode.DISPATCH) {
        const departureStation = main.selection.selectedStation;
        if (!departureStation) {
          throw new Error("No starting station selected");
        }
        const destinationStation = main.selection.selectedDestination;
        if (!destinationStation) {
          throw new Error("No destination station selected");
        }

        await ticker.delay(0.1);
        main.popups.dispatchDeparture.setCurrentStation(departureStation);
        main.popups.dispatchDestination.setCurrentStation(destinationStation);
      } else if (prevViewMode === GameViewMode.DISPATCH) {
        main.popups.dispatchDeparture.setCurrentStation(null);
        main.popups.dispatchDestination.setCurrentStation(null);
      }

      if (viewMode === GameViewMode.EDIT_TRAIN) {
        await ticker.delay(0.1);

        const departureStation = main.selection.selectedStation;
        const destinationStation = main.selection.selectedDestination;

        await ticker.delay(0.1);
        main.popups.editTrainComposition.setCurrentStation(departureStation);
        main.popups.editTrainDestination.setCurrentStation(destinationStation);
      } else if (prevViewMode === GameViewMode.EDIT_TRAIN) {
        main.popups.editTrainComposition.setCurrentStation(null);
        main.popups.editTrainDestination.setCurrentStation(null);
      }

      if (viewMode === GameViewMode.LOADING_DOCK) {
        await ticker.delay(0.1);

        const departureStation = main.selection.selectedStation;
        const destinationStation = main.selection.selectedDestination;

        await ticker.delay(0.1);
        main.popups.editTrainLoadout.setCurrentStation(departureStation);
        main.popups.editTrainDestination.setCurrentStation(destinationStation);
      } else if (prevViewMode === GameViewMode.EDIT_TRAIN) {
        main.popups.editTrainLoadout.setCurrentStation(null);
        main.popups.editTrainDestination.setCurrentStation(null);
      }
    }
  );
}

/**
 *  On VIEW MODE change
 * - Update RAIL TRACK highlights
 */
export function onViewModeChangeUpdateRailTrackHighlights(context: GameContext) {
  const { main, stage, ticker } = context;

  stage.enchantments.watch.array(
    () =>
      [
        main.viewMode,
        main.selection.selectedStation,
        main.selection.selectedDestination,
        main.selection.hoverStation,
      ] as const,
    async ([viewMode, departureStation, destinationStation, hoverStation]) => {
      //// CLEANUP FROM PREVIOUS VIEW MODE

      for (const track of main.world.zoomLayers.operationsLayer.tracksContainer.tracks) {
        if (track.glowColor != null) {
          track.glowColor = null;
          await ticker.delay(0.0167);
        }
      }

      //// //// //// //// //// //// //// //// //// ////

      const canSelectedTrainMakeItBetweenStations = (
        departureStation: StationEntity,
        destinationStation: StationEntity
      ) => {
        const train = main.selection.selectedTrain;
        const trainMaxDistance = train?.maxDistance || 0;
        const stationsDistance = departureStation.getDistanceTo(destinationStation) || 0;
        const trainCanMakeIt = trainMaxDistance >= stationsDistance;
        return trainCanMakeIt;
      };

      if (viewMode === GameViewMode.NEXT_STOP) {
        if (!departureStation) {
          throw new Error("No starting station selected");
        }

        for (const track of main.world.zoomLayers.operationsLayer.tracksContainer.tracks) {
          const shouldHighlight = track.railPath.hasStation(departureStation);
          if (shouldHighlight) {
            const trainCanMakeIt = canSelectedTrainMakeItBetweenStations(
              track.railPath.stationA!,
              track.railPath.stationB!
            );
            track.glowColor = trainCanMakeIt ? 0xffeebb : 0xd83939;
            await ticker.nextFrame();
          } else {
            track.glowColor = null;
          }
        }
      }

      if (departureStation && destinationStation) {
        for (const track of main.world.zoomLayers.operationsLayer.tracksContainer.tracks) {
          if (!track.isVisible) {
            continue;
          }

          const isDestination = track.railPath.hasStations(departureStation, destinationStation);
          const isPotentialDestination = hoverStation && track.railPath.hasStations(departureStation, hoverStation);
          if (isDestination) {
            const trainCanMakeIt = canSelectedTrainMakeItBetweenStations(
              track.railPath.stationA!,
              track.railPath.stationB!
            );
            track.glowColor = trainCanMakeIt ? 0x00ffff : 0xd83939;
          } else if (isPotentialDestination) {
            track.glowColor = 0xffeebb;
          } else {
            track.glowColor = null;
          }
        }
      }
    }
  );
}

/**
 */
export function onAnyChangeUpdateStationHighlights(context: GameContext, world: World) {
  const operationsLayer = world.zoomLayers.operationsLayer;
  operationsLayer.onEnterFrame.add(() => {
    const { main, stage, ticker } = context;
    const { selection: selection, viewMode, popups, faq } = main;

    for (const station of operationsLayer.stationsContainer.stationsArray) {
      const { data } = station;

      //// UPDATE NEXT STOP GLOW
      {
        if (viewMode === GameViewMode.NEXT_STOP) {
          const ok = selection.isViablelDestination(data);
          station.nextStopGlow.setActive(ok);
        } else if (data === selection.selectedDestination) {
          const ok = selection.isViablelDestination(data);
          station.nextStopGlow.setActive(ok);
        } else if (
          data === selection.hoverStation &&
          (viewMode === GameViewMode.DISPATCH || viewMode === GameViewMode.EDIT_TRAIN)
        ) {
          const ok = selection.isViablelDestination(data);
          station.nextStopGlow.setActive(ok);
        } else {
          station.nextStopGlow.setActive(false);
        }
      }

      //// UPDATE HOVER GLOW

      {
        const isSelected = selection.selectedStation === data && viewMode === GameViewMode.NORMAL;
        const isHovered = data === selection.hoverStation;
        station.hoverGlow.setActive(isSelected || isHovered);
      }

      //// UPDATE TRAIN GLOW

      const sittingTrain = faq.getFirstTrainAtStation(data);
      const incomingTrain = faq.getFirstTrainInTransitToStation(data);
      const hasOwnedTrain = !!(sittingTrain || incomingTrain);
      const isSelected = data === selection.selectedStation;
      if (viewMode === GameViewMode.NORMAL) {
        station.highlightGlow.setActive(hasOwnedTrain);
      } else {
        station.highlightGlow.setActive(viewMode != GameViewMode.BUSY && isSelected);
      }
      station.highlightGlow.pulseSpeed = !sittingTrain && !!incomingTrain ? 5 : null;
    }
  });
}

//// On station selected (normal mode) ////
export function onStationSelectedUpdateStationPopups(context: GameContext) {
  const { main, world, stage, ticker, userData } = context;

  const isInOperationsNormalView = () =>
    world.getCurrentZoomLevel() === WorldZoomLevel.OPERATIONS && main.viewMode === GameViewMode.NORMAL;

  stage.enchantments.watch.array(
    () =>
      isInOperationsNormalView()
        ? ([main.selection.selectedStation, main.selection.selectedTrain] as const)
        : ([null, null] as const),
    async ([station, train]) => {
      main.selection.selectedDestination = null;

      if (station === main.selection.hoverStation) {
        main.selection.hoverStation = null;
        await ticker.delay(0.1);
      }

      if (station) {
        if (train) {
          main.popups.clickWithMyTrain.setCurrentStation(station);
          return;
        }

        /**
         * Else, show the generic expandable station popup by default.
         */
        main.popups.clickUnrelated.setCurrentStation(station);
      }
    }
  );
}

//// On station hover (normal mode) ////
export function onStationHoverUpdateStationPopups(context: GameContext) {
  const { main, world, stage, ticker } = context;

  stage.enchantments.watch(
    () =>
      world.getCurrentZoomLevel() === WorldZoomLevel.OPERATIONS && main.viewMode === GameViewMode.NORMAL
        ? main.selection.hoverStation
        : null,
    station => {
      if (station) {
        const train = main.faq.getFirstTrainAtStation(station);
        if (train == null) {
          station = null;
        }
        if (main.selection.selectedStation) {
          station = null;
        }
        if (main.popups.myStationDashboard.currentPopup != null) {
          station = null;
        }
      }
      main.popups.hover.setCurrentStation(station);
    }
  );
}

export function onEmptyViewportClickDismissAllStationPopups(context: GameContext) {
  const { viewport, main } = context;
  const viewModesToIgnoreOn = [GameViewMode.EDIT_TRAIN, GameViewMode.LOADING_DOCK];
  viewport.on("clicked", () => {
    if (viewModesToIgnoreOn.includes(main.viewMode)) {
      return;
    }

    main.selection.clear();
    main.popups.clear();
    main.setViewMode(GameViewMode.NORMAL);
    if (main.cards.state?.type === "inventory") {
      main.cards.setCardDrawerState(null);
    }
  });
}

/**
 * On unsaved changes, make the central main menu button glow.
 * On unsaved changes, if unsaved potential train is invalid, gray out the central main menu button
 */
export function onUnsavedTrainChangesUpdateCogWheelMenu(context: GameContext) {
  const { main, stage } = context;

  stage.enchantments.watch(
    () => !main.cards.changes.unsavedTrain?.getInvalidReason() && main.cards.changes.hasUnsavedDiff,
    diff => {
      main.hud.cogWheelMenu.setHighlightGlowMode(diff);
    }
  );

  stage.enchantments.watch(
    () => main.cards.changes.unsavedTrain?.getInvalidReason() ?? false,
    invalidReason => {
      main.hud.cogWheelMenu.setGrayedOutMode(!!invalidReason);
    }
  );
}

/**
 * On Market Window open/close -- Dim the map view
 */
export function onAnyWindowOpenDimTheScreenBehindIt(context: GameContext) {
  const { main, stage, world, stageContainers } = context;
  const hideTheCogWheelMenuWhileWindowIsOpen = true;
  stage.enchantments.watch(
    () => !!main.anyWindowOpen,
    hasModalWindowUp => {
      if (hideTheCogWheelMenuWhileWindowIsOpen) {
        main.hud.reasonsToHideCogWheelMenu.set("MarketOrRailRunsWindowOpen", hasModalWindowUp);
      }

      if (hasModalWindowUp) {
        main.setViewMode(GameViewMode.NORMAL);
        main.popups.clear();
        main.selection.clear();
        world.dimmer.show();
      } else {
        world.dimmer.hide();
      }
    }
  );
}

export function onTrainTamperedPromptUserToClearOrVerifyTrain(context: GameContext) {
  const { contracts, input, userData, userDataCtrl } = context;

  contracts.events.on({
    trainTampered: async (trainName, error) => {
      const choice = confirm(
        error + `\n\nWould you like to clear the train "${trainName}" and verify it?`
        // errorMessage + `\n\nWould you like to remove all unowned cards from train "${train}" and verify it?`
      );
      if (!choice) {
        return;
      }
      const train = userData.trains.get(trainName);
      if (train == null) {
        throw new Error(`Train "${trainName}" not found`);
      }
      await input.dispatch("clearAndVerifyTrain", train as TrainEntity);
    },
  });
}

export function onDashboardOpenApplyLowPassFilterToMusic(context: GameContext) {
  const { stage, main, music } = context;

  stage.enchantments.watch(
    () => main.hud.railroaderDashboard.isOpen,
    isDashboardOpen => music.setLowPassFilter(isDashboardOpen ? 1.0 : 0.0, 1.65),
    true
  );
}

export function onImmersiveModeHideTheHUD(context: GameContext) {
  const { stage, main } = context;

  stage.enchantments.watch(
    () => main.immersiveMode,
    immersiveMode => main.hud.reasonsToHideHUD.set("ImmersiveModeActive", immersiveMode),
    true
  );
}

export function onImmersiveModeZoomIn(context: GameContext) {
  const { world, main, viewport } = context;

  world.enchantments.watch(
    () => main.immersiveMode,
    immersiveMode => {
      const MAINMENU_ZOOM_MULTIPLIER = 1.04;
      if (immersiveMode) {
        viewport.animate({
          scale: viewport.scaled * MAINMENU_ZOOM_MULTIPLIER,
          time: 200,
        });
      } else {
        viewport.animate({
          scale: viewport.scaled / MAINMENU_ZOOM_MULTIPLIER,
          time: 200,
        });
      }
    },
    true
  );
}

export function onRailroaderDashboardOpenZoomOut(context: GameContext) {
  const { world, main, viewport } = context;

  world.enchantments.watch(
    () => main.hud.railroaderDashboard.isOpen,
    zoomOut => {
      const MAINMENU_ZOOM_MULTIPLIER = 0.86;
      if (zoomOut) {
        viewport.animate({
          scale: viewport.scaled * MAINMENU_ZOOM_MULTIPLIER,
          time: 500,
          ease: "easeOutQuad",
        });
      } else {
        viewport.animate({
          scale: viewport.scaled / MAINMENU_ZOOM_MULTIPLIER,
          time: 500,
          ease: "easeOutQuad",
        });
      }
    },
    true
  );
}

export function onRailroaderDashboardFoldCogWheelButtons(context: GameContext) {
  const { world, main } = context;

  world.enchantments.watch(
    () => main.hud.railroaderDashboard.isOpen,
    dashOpen => main.hud.cogWheelMenu.reasonsToHideRimButtons.set("RailroaderDashboardUp", dashOpen),
    true
  );
}
