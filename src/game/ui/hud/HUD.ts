import { GameSingletons } from "@game/app/GameSingletons";
import { createScreenTitleVisual, MapTitle } from "@game/ui/createScreenTitleVisual";
import { AppVersionIndicator, createAppVersionIndicator } from "@game/ui/hud/AppVersionIndicator";
import { AudioIndicator, createAudioIndicator } from "@game/ui/hud/AudioIndicator";
import { BalanceCounters, createBalanceCounters } from "@game/ui/hud/BalanceCounters";
import { HUDBillboardController } from "@game/ui/hud/HUDBillboardController";
import { createUserAccountIndicator, UserAccountIndicator } from "@game/ui/hud/UserAccountIndicator";
import { createUserFuelIndicatorsList, UserFuelIndicatorsList } from "@game/ui/hud/UserFuelIndicatorList";
import { RailroaderDashService } from "@game/ui/railroader-dash/RailroaderDashService";
import { CogWheelMenu, createCogWheelMenu } from "@game/ui/wheel/CogWheelMenu";
import { MultipleReasons } from "@sdk/core/MultipleReasons";
import { SocialProfileDashService } from "../social/SocialProfileDashService";
import { HUDAvatarBadgeController } from "./HUDAvatarBadgeController";
import { createMapToggleMenu, MapToggle } from "./MapToggleMenu";
import { ContextMenuManager } from "./services/ContextMenuManager";
import { TooltipManager } from "../../../client/display/ui/TooltipManager";

export class HUD {
  public static readonly DEFAULT_HEADER_TEXT = "The Modern Century";

  public readonly title: MapTitle;
  public readonly appVersionIndicator: AppVersionIndicator;
  public readonly audioIndicator: AudioIndicator;
  public readonly mapToggle: MapToggle;
  public readonly usernameIndicator: UserAccountIndicator;
  public readonly fuelIndicators: UserFuelIndicatorsList;
  public readonly balanceCounters: BalanceCounters;
  public readonly cogWheelMenu: CogWheelMenu;

  public readonly billboardCtrl: HUDBillboardController;
  public readonly stationOwnerAvatarCtrl: HUDAvatarBadgeController;

  public readonly railroaderDashboard: RailroaderDashService;
  public readonly socialDashboard: SocialProfileDashService;

  public readonly contextMenu: ContextMenuManager;
  public readonly tooltips: TooltipManager;

  public readonly reasonsToHideCogWheelMenu = new MultipleReasons();
  public readonly reasonsToHideFuelCounters = new MultipleReasons();
  public readonly reasonsToHideHUD = new MultipleReasons();

  private readonly context = GameSingletons.getGameContext();

  private readonly container_SystemHUD = this.context.stageContainers._hud;
  private readonly container_WorldHUD = this.context.stageContainers._worldHud;

  constructor() {
    this.title = createScreenTitleVisual();
    this.container_WorldHUD.addChild(this.title.component);

    this.billboardCtrl = new HUDBillboardController(this.container_WorldHUD);
    this.stationOwnerAvatarCtrl = new HUDAvatarBadgeController(this.container_WorldHUD);

    this.appVersionIndicator = createAppVersionIndicator();
    this.container_SystemHUD.addChild(this.appVersionIndicator);

    this.audioIndicator = createAudioIndicator();
    this.container_SystemHUD.addChild(this.audioIndicator);

    this.mapToggle = createMapToggleMenu();
    this.container_SystemHUD.addChild(this.mapToggle);

    this.usernameIndicator = createUserAccountIndicator();
    this.container_SystemHUD.addChild(this.usernameIndicator);

    this.fuelIndicators = createUserFuelIndicatorsList();
    this.container_WorldHUD.addChild(this.fuelIndicators);

    this.balanceCounters = createBalanceCounters();
    this.container_WorldHUD.addChild(this.balanceCounters);

    this.cogWheelMenu = createCogWheelMenu();
    this.cogWheelMenu.visible = false;
    this.container_WorldHUD.addChild(this.cogWheelMenu);

    this.tooltips = new TooltipManager(
      this.context.stageContainers._modals,
      this.context.app.renderer.plugins.interaction
    );
    this.contextMenu = new ContextMenuManager(
      this.context.stageContainers._modals,
      this.context.app.renderer.plugins.interaction
    );

    this.reasonsToHideHUD.makeParentTo(this.reasonsToHideCogWheelMenu);
    this.reasonsToHideHUD.makeParentTo(this.reasonsToHideFuelCounters);

    this.railroaderDashboard = new RailroaderDashService(this.container_WorldHUD);

    this.socialDashboard = new SocialProfileDashService(this.container_SystemHUD);

    this.initializeReactors();
  }

  async initializeReactors() {
    this.reasonsToHideHUD.on({
      change: shouldHide => {
        this.appVersionIndicator.visible = !shouldHide;
        this.usernameIndicator.visible = !shouldHide;
        this.balanceCounters.visible = !shouldHide;
      },
    });

    this.reasonsToHideFuelCounters.on({
      change: shouldHide => {
        this.fuelIndicators.visible = !shouldHide;
      },
    });

    this.context.stage.enchantments.watch(
      () => this.reasonsToHideCogWheelMenu.hasAny(),
      shouldHide => {
        if (shouldHide) {
          this.cogWheelMenu.close();
        } else {
          this.cogWheelMenu.open();
        }
      }
    );

    // this.reasonsToHideCogWheelMenu.on({
    //   change: shouldHide => {
    //     console.log({ shouldHide });
    //     if (shouldHide) {
    //       this.cogWheelMenu.close();
    //     } else {
    //       this.cogWheelMenu.open();
    //     }
    //   },
    // });
  }
}
