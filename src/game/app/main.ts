import { onKeyPress } from "@debug/utils/onKeyPress";
import { GameContext } from "@game/app/app";
import { SelectionManager } from "@game/app/components/SelectionManager";
import { MainFAQ } from "@game/app/mainFAQ";
import { initializeDocumentTitleUpdateService } from "@game/app/misc/initializeDocumentTitleUpdateService";
import { CardsDrawer } from "@game/ui/cards/CardsDrawer";
import { CardsDrawerManager } from "@game/ui/cards/CardsDrawerManager";
import { HUD } from "@game/ui/hud/HUD";
import { MapDotsManager } from "@game/ui/in-map/MapDotsManager";
import { StationLabelsManager } from "@game/ui/in-map/StationLabelsManager";
import { StationSignsManager } from "@game/ui/in-map/StationSignsManager";
import { PopupInstancesManager } from "@game/ui/popups/PopupInstancesManager";
import { CogWheelMenuMode } from "@game/ui/wheel/CogWheelMenu";
import { MarketWindowService } from "@game/ui/windows/market/MarketWindowService";
import { RailRunsWindowService } from "@game/ui/windows/railruns/RailRunsWindowService";
import { World } from "@game/world/World";
import { MultipleReasons } from "@sdk/core/MultipleReasons";
import {
  handleInputEvents,
  onAnyChangeUpdateStationHighlights,
  onAnyWindowOpenDimTheScreenBehindIt,
  onDashboardOpenApplyLowPassFilterToMusic,
  onEmptyViewportClickDismissAllStationPopups,
  onImmersiveModeHideTheHUD,
  onImmersiveModeZoomIn,
  onRailroaderDashboardFoldCogWheelButtons,
  onRailroaderDashboardOpenZoomOut,
  onStationHoverUpdateStationPopups,
  onStationSelectedUpdateStationPopups,
  onTrainTamperedPromptUserToClearOrVerifyTrain,
  onUnsavedTrainChangesUpdateCogWheelMenu,
  onViewModeChangeUpdateCogWheelMenu,
  onViewModeChangeUpdateRailTrackHighlights,
  onViewModeChangeUpdateStationPopups,
  onViewModeChangeUpdateTitlePlate,
} from "./mainReactors";

export enum GameViewMode {
  NORMAL,
  NEXT_STOP,
  DISPATCH,
  EDIT_TRAIN,
  LOADING_DOCK,
  BUSY,
}

export class Main {
  public readonly cards: CardsDrawerManager;
  public readonly popups = new PopupInstancesManager(this.context);

  public readonly signs: StationSignsManager;
  public readonly stationLabels: StationLabelsManager;
  public readonly dots: MapDotsManager;

  public readonly marketWindow: MarketWindowService;
  public readonly railRunsWindow: RailRunsWindowService;
  public get anyWindowOpen() {
    return this.marketWindow.currentWindow?.isOpen || this.railRunsWindow.currentWindow?.isOpen || false;
  }
  public get dashboardOrWindowOpen() {
    return (
      this.hud.railroaderDashboard.isOpen ||
      this.marketWindow.currentWindow?.isOpen ||
      this.railRunsWindow.currentWindow?.isOpen ||
      false
    );
  }

  public readonly hud: HUD;

  public readonly world: World;

  public readonly faq = new MainFAQ(this.context);

  public viewMode = GameViewMode.NORMAL;
  public immersiveMode = false;

  public readonly selection: SelectionManager;

  public readonly reasonsToDisableWorldInteraction = new MultipleReasons();

  constructor(public readonly context: GameContext) {
    const { input, mapData, viewSize } = context;

    if (mapData == null) {
      throw new Error("mapData is null");
    }

    initializeDocumentTitleUpdateService(context);

    this.selection = new SelectionManager(context);

    //// Create the game world
    const world = (this.world = new World(context));
    context.stageContainers._world.addChild(world);

    this.hud = new HUD(this.context);

    this.marketWindow = new MarketWindowService(context);
    this.railRunsWindow = new RailRunsWindowService(context);

    this.signs = new StationSignsManager(this.context);
    this.dots = new MapDotsManager(this.context);
    this.stationLabels = new StationLabelsManager(this.context);

    const cardsDrawer = new CardsDrawer(context, () => {
      const insetLeft = viewSize.width * 0.1;
      const insetRight = 400 * this.hud.cogWheelMenu.scale.x;
      const width = Math.min(viewSize.width - insetLeft - insetRight, viewSize.height);
      return [viewSize.width - insetRight - width, viewSize.width - insetRight];
    });
    cardsDrawer.initialize();
    context.stageContainers._worldHud.addChild(cardsDrawer.container);
    this.cards = new CardsDrawerManager(context, cardsDrawer);
  }

  async initializeReactors() {
    const { context } = this;
    const { input, viewSize } = this.context;

    //// REACTORS ::::

    this.context.viewport.on("drag-start", () => {
      this.world.setInteractionEnabled(false);
      this.context.viewport.once("drag-end", () => {
        this.world.setInteractionEnabled(true);
      });
    });

    this.reasonsToDisableWorldInteraction.on({
      change: disableInteraction => {
        this.world.setInteractionEnabled(!disableInteraction);
        this.context.viewport.interactiveChildren = !disableInteraction;
        this.context.viewport.interactive = !disableInteraction;
      },
    });

    this.context.stage.enchantments.watch(
      () => this.dashboardOrWindowOpen,
      disableInteraction => {
        this.reasonsToDisableWorldInteraction.set("RRDashOrSomeWindowOpen", disableInteraction);
      },
      true
    );

    this.context.stage.enchantments.watch(
      () => this.hud.railroaderDashboard.isOpen && this.cards.drawer.isOpen,
      bothOpen => bothOpen && input.dispatch("closeCardsDrawer"),
      true
    );

    this.context.stage.enchantments.watch(
      () => (this.hud.railroaderDashboard.isOpen || this.cards.drawer.isOpen) && viewSize.width < viewSize.height,
      drawerOrDashOpen => this.hud.reasonsToHideFuelCounters.set("RRDashOrCardsDrawerOpen", drawerOrDashOpen),
      true
    );

    onKeyPress(" ", () => void (this.immersiveMode = !this.immersiveMode));

    onImmersiveModeHideTheHUD(context);

    onImmersiveModeZoomIn(context);

    onRailroaderDashboardOpenZoomOut(context);

    onRailroaderDashboardFoldCogWheelButtons(context);

    this.hud.cogWheelMenu.events.on({
      onClickCards: () => input.dispatch("toggleCardsDrawer"),
      onClickShop: async () => input.dispatch("toggleMarketWindow"),
      onClickRuns: async () => input.dispatch("toggleRailRunsWindow"),
      onClose: () => {
        this.setViewMode(GameViewMode.NORMAL);
        if (this.cards.drawer.isOpen) {
          input.dispatch("closeCardsDrawer");
        }
      },
      onClickCentralButton: () => {
        this.hud.cogWheelMenu.spinUp(false, true);

        const mode = this.hud.cogWheelMenu.getCurrentMode();
        switch (mode) {
          case CogWheelMenuMode.Logo:
            input.dispatch("toggleRailRoaderDashboard");
            break;
          case CogWheelMenuMode.Confirm:
            input.dispatch("confirm");
            break;
        }
      },
    });

    handleInputEvents(context);

    onViewModeChangeUpdateTitlePlate(context);

    onViewModeChangeUpdateCogWheelMenu(context);

    onViewModeChangeUpdateStationPopups(context);

    onViewModeChangeUpdateRailTrackHighlights(context);

    onAnyChangeUpdateStationHighlights(context, this.world);

    onStationSelectedUpdateStationPopups(context);

    onStationHoverUpdateStationPopups(context);

    onEmptyViewportClickDismissAllStationPopups(context);

    onUnsavedTrainChangesUpdateCogWheelMenu(context);

    onAnyWindowOpenDimTheScreenBehindIt(context);

    onTrainTamperedPromptUserToClearOrVerifyTrain(context);

    onDashboardOpenApplyLowPassFilterToMusic(context);

    /**
     * Fx
     */
    this.hud.cogWheelMenu.enchantments.watch(
      () => this.cards.drawer.isOpen,
      () => this.hud.cogWheelMenu.spinUp()
    );
  }

  async start() {
    const { app, ticker, viewport } = this.context;

    const stopHidingTheCogWheelMenu = this.hud.reasonsToHideCogWheelMenu.add("OngoingMainIntro");

    this.hud.billboardCtrl.initialize();

    await ticker.delayFrames(10);
    !this.hud.title.currentText && this.hud.title.setText(HUD.DEFAULT_HEADER_TEXT);

    await ticker.delay(0.425);
    stopHidingTheCogWheelMenu();

    await ticker.delay(0.68);
    this.cards.initialize();
  }

  /**
   * @returns True if changed, false if not.
   */
  public setViewMode(nextMode: GameViewMode) {
    if (nextMode === this.viewMode) {
      return false;
    }

    if (this.context.world == null) {
      throw new Error("World is null");
    }

    this.viewMode = nextMode;

    return true;
  }
}
