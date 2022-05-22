import { __logFunctionCalls } from "@debug/decorators/__logFunctionCalls";
import { GameSingletons } from "@game/app/GameSingletons";
import { Container } from "@pixi/display";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { destroySafely } from "@sdk/pixi/helpers/destroySafely";
import { EditRRBadgePanel } from "../social/panel-edit-badge/EditRRBadgePanel";
import { FeaturedAchievementsPanel } from "../social/panel-achievements/FeaturedAchievementsPanel";
import { ProfileItemKey, MyProfileSideMenu } from "../social/myprofile-menu/MyProfileSideMenu";
import { ViewProfilePanel } from "../social/panel-view-profile/ViewProfilePanel";
import { RailroaderDashPanelType } from "./panels/models";
import { RailroaderDashPanelFactory } from "./panels/RailroaderDashPanelFactory";
import { RailroaderDashBackground } from "./RailroaderDashBackground";
import { RailroaderDashSideMenuLarge } from "./sidemenus/RailroaderDashSideMenuLarge";
import { RailroaderDashSideMenuSmall } from "./sidemenus/RailroaderDashSideMenuSmall";

type RailroaderDashPanel = Container & {
  init(): void;
  scaleMultiplier?: number;
  setLayoutMode?: (mode: "landscape" | "portrait") => void;
  playShowAnimation?: () => unknown;
  playHideAnimation?: () => unknown;
};

export class RailroaderDash extends Container {
  private readonly context = GameSingletons.getGameContext();
  private readonly tweeener = new TemporaryTweeener(this);

  public open = false;

  private background?: RailroaderDashBackground;

  private sideMenuLarge?: RailroaderDashSideMenuLarge;
  private sideMenuSmall?: RailroaderDashSideMenuSmall;

  private currentPanel: RailroaderDashPanel | null = null;
  private currentSideMenu: RailroaderDashPanel | null = null;

  private rightSideMenu: MyProfileSideMenu | null = null;

  private readonly panelFactory;

  constructor() {
    super();

    this.panelFactory = new RailroaderDashPanelFactory();
  }

  public selectTab = (index: RailroaderDashPanelType) => {
    this.setCurrentCentralPanelType(index + 1);
  };

  async init() {
    //// Add background
    if (!this.background) {
      this.background = new RailroaderDashBackground();
      this.addChild(this.background);
    }

    //// Add starting selection panel
    if (!this.sideMenuLarge) {
      this.sideMenuLarge = new RailroaderDashSideMenuLarge(this.selectTab);
      this.sideMenuLarge.zIndex = 2;
    }

    //// Add side expanded selection panel
    if (!this.sideMenuSmall) {
      this.sideMenuSmall = new RailroaderDashSideMenuSmall(this.selectTab);
      this.sideMenuSmall.zIndex = 2;
    }
  }

  createSocialProfileFullViewPanel() {
    const closeMyProfileSideMenu = async () => {
      const menu = this.rightSideMenu;
      if (menu) {
        this.rightSideMenu = null;
        await menu.playHideAnimation();
        menu.destroy();
      }
    };

    this.rightSideMenu = new MyProfileSideMenu();
    this.rightSideMenu.onItemSelected = (itemType: ProfileItemKey) => {
      if (itemType == "view") {
        const centralProfile = new ViewProfilePanel(this.panelFactory.getFactory());
        centralProfile.init(this.context.userData.name);
        this.setCurrentCentralPanel(centralProfile, false, true);
      } else if (itemType == "edit") {
        const editProfile = new EditRRBadgePanel(this.panelFactory.getFactory());
        editProfile.init();
        this.setCurrentCentralPanel(editProfile, false, true);
      } else {
        const featuredAchievements = new FeaturedAchievementsPanel(this.panelFactory.getFactory());
        featuredAchievements.init();
        this.setCurrentCentralPanel(featuredAchievements, false, true);
      }
    };
    this.rightSideMenu.onBackSelected = () => {
      this.setCurrentCentralPanel(null);
      closeMyProfileSideMenu();
    };
    this.addChild(this.rightSideMenu);

    this.rightSideMenu.playShowAnimation();

    //// Open the VIEW PROFILE panel by default
    this.rightSideMenu.navButtons.manager.setSelectedValue("view");

    this.setCurrentSideMenu(null);

    const centralProfile = new ViewProfilePanel(this.panelFactory.getFactory());
    return centralProfile;
  }

  openUpSocialProfileQuickView() {
    const quickViewManager = this.context.main.social;
    const onViewProfileClick = this.setCurrentCentralPanelType.bind(this, RailroaderDashPanelType.MySocialProfile);
    quickViewManager.open(this.context.userData.name, onViewProfileClick);
  }

  onEnterFrame() {
    const { viewSize } = this.context;

    if (this.currentPanel?.destroyed) {
      this.currentPanel = null;
    }
    
    const currentPage = this.currentPanel;
    if (currentPage && currentPage.parent && currentPage.worldVisible) {
      if (viewSize.ratio > 1.2) {
        const scale = (currentPage.scaleMultiplier ?? 1) && viewSize.vmin / 1024;
        currentPage.scale.set(scale);
        currentPage.position.set(viewSize.centerX, viewSize.height - scale * 410);
        currentPage.setLayoutMode?.("landscape");
      } else {
        const scale = (currentPage.scaleMultiplier ?? 1) && viewSize.vmin / 1440;
        currentPage.scale.set(scale);
        currentPage.position.set(viewSize.centerX, viewSize.centerY);
        currentPage.setLayoutMode?.("portrait");
      }
    }

    if (this.currentSideMenu?.destroyed) {
      this.currentSideMenu = null;
    }
    
    const currentSidebar = this.currentSideMenu;
    if (currentSidebar && currentSidebar.parent && currentSidebar.worldVisible) {
      const scale = (currentSidebar.scaleMultiplier ?? 1) && viewSize.vmin / 1440;
      currentSidebar.scale.set(scale);
      currentSidebar.position.set(0, viewSize.centerY - currentSidebar.height * 0.6);
    }

    if (this.rightSideMenu?.destroyed) {
      this.rightSideMenu = null;
    }

    const rightSidebar = this.rightSideMenu;
    if (rightSidebar && rightSidebar.parent && rightSidebar.worldVisible) {
      const scale = viewSize.vmin / 1640;
      rightSidebar.scale.set(scale);
      rightSidebar.position.set(viewSize.width - rightSidebar.width, viewSize.centerY - rightSidebar.height * 0.55);
    }
  }

  setCurrentCentralPanelType(nextPanelType: RailroaderDashPanelType | null, force: boolean = false) {
    if (nextPanelType != null) {
      this.sideMenuSmall?.setCurrentSelectedTabIndexGlow(+nextPanelType - 1);
    }

    if (nextPanelType === RailroaderDashPanelType.MySocialProfile) {
      const nextPanel = this.createSocialProfileFullViewPanel();
      nextPanel?.init();
      this.setCurrentCentralPanel(nextPanel, force, true);
    } else {
      const nextPanel = nextPanelType && this.panelFactory.createFromType(nextPanelType);
      nextPanel?.init();
      this.setCurrentCentralPanel(nextPanel, force);
    }
  }

  private async setCurrentCentralPanel(
    nextPanel: RailroaderDashPanel | null,
    force: boolean = false,
    skipSidePanel: boolean = false
  ) {
    if (!force && this.currentPanel === nextPanel) return;

    console.log("setCurrentCentralPanel", nextPanel);

    const prevPanel = this.currentPanel;
    this.currentPanel = nextPanel;

    if (prevPanel) {
      await Promise.resolve(prevPanel.playHideAnimation?.()).then(() => destroySafely(prevPanel));
    }
    const nextSideMenu = nextPanel ? this.sideMenuSmall : this.sideMenuLarge;
    if (!skipSidePanel) {
      this.setCurrentSideMenu(nextSideMenu || null);
    }

    const quickViewManager = this.context.main.social;
    quickViewManager.close();
    if (!skipSidePanel && nextSideMenu === this.sideMenuLarge) {
      this.openUpSocialProfileQuickView();
    }

    await this.tweeener.delay(0.15);

    if (nextPanel) {
      this.addChild(nextPanel);
      this.sortChildren();

      nextPanel.zIndex = 1;
      nextPanel.pivot.set(nextPanel.width / 2, nextPanel.height / 2);

      await nextPanel.playShowAnimation?.();
    }
  }

  private async setCurrentSideMenu(nextSideMenu: RailroaderDashPanel | null, force: boolean = false) {
    if (!force && this.currentSideMenu === nextSideMenu) return;

    console.log("setCurrentSideMenu", nextSideMenu);

    const prevSideMenu = this.currentSideMenu;
    this.currentSideMenu = nextSideMenu;

    if (prevSideMenu) {
      prevSideMenu.playHideAnimation?.();
    }

    if (nextSideMenu) {
      this.addChild(nextSideMenu);
      this.sortChildren();

      await nextSideMenu.playShowAnimation?.();
    }
  }

  async playShowAnimation() {
    const background = this.background;
    const currentPage = this.currentPanel;
    const currentSidebar = this.currentSideMenu;

    await Promise.all([
      background?.playShowAnimation(),
      currentPage && currentPage.parent && currentPage.worldVisible && currentPage.playShowAnimation?.(),
      currentSidebar && currentSidebar.parent && currentSidebar.worldVisible && currentSidebar.playShowAnimation?.(),
    ]);
  }

  async playHideAnimation() {
    const quickViewManager = this.context.main.social;
    quickViewManager.close();

    if (this.rightSideMenu) {
      const menu = this.rightSideMenu;
      menu.playHideAnimation();
      this.rightSideMenu = null;
    }

    const background = this.background;
    const currentPage = this.currentPanel;
    const currentSidebar = this.currentSideMenu;

    this.currentPanel = null;
    this.currentSideMenu = null;

    await Promise.all([
      background?.playHideAnimation(),
      currentPage && currentPage.parent && currentPage.worldVisible && currentPage.playHideAnimation?.(),
      currentSidebar && currentSidebar.parent && currentSidebar.worldVisible && currentSidebar.playHideAnimation?.(),
    ]);
  }
}
