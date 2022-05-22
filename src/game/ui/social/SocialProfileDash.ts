import { GameSingletons } from "@game/app/GameSingletons";
import { Container } from "@pixi/display";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { destroySafely } from "@sdk/pixi/helpers/destroySafely";
import { RailroaderDashPanel } from "../railroader-dash/panels/models";
import { RailroaderDashPanelFactory } from "../railroader-dash/panels/RailroaderDashPanelFactory";
import { RailroaderDashBackground } from "../railroader-dash/RailroaderDashBackground";
import { ViewProfilePanel } from "./panel-view-profile/ViewProfilePanel";

export class SocialProfileDash extends Container {
  private readonly context = GameSingletons.getGameContext();
  private readonly tweeener = new TemporaryTweeener(this);

  public open = false;

  private background?: RailroaderDashBackground;

  private currentPanel: RailroaderDashPanel | null = null;

  private readonly panelFactory = new RailroaderDashPanelFactory();

  openViewProfile(user: string) {
    const centralProfile = new ViewProfilePanel(this.panelFactory.getFactory());
    centralProfile.addCloseButton(() => this.setCurrentCentralPanel(null));
    centralProfile.init(user, false);
    this.setCurrentCentralPanel(centralProfile, false);
  }

  onEnterFrame() {
    const { viewSize } = this.context;

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
  }

  private async setCurrentCentralPanel(nextPanel: RailroaderDashPanel | null, force: boolean = false) {
    if (!force && this.currentPanel === nextPanel) return;

    console.log("setCurrentCentralPanel", nextPanel);

    const prevPanel = this.currentPanel;
    this.currentPanel = nextPanel;

    if (prevPanel) {
      await Promise.resolve(prevPanel.playHideAnimation?.()).then(() => destroySafely(prevPanel));
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

  async playShowAnimation() {
    const background = this.background;
    const currentPage = this.currentPanel;

    await Promise.all([
      background?.playShowAnimation(),
      currentPage && currentPage.parent && currentPage.worldVisible && currentPage.playShowAnimation?.(),
    ]);
  }

  async playHideAnimation() {
    const quickViewManager = this.context.main.social;
    quickViewManager.close();

    const background = this.background;
    const currentPage = this.currentPanel;

    this.currentPanel = null;

    await Promise.all([
      background?.playHideAnimation(),
      currentPage && currentPage.parent && currentPage.worldVisible && currentPage.playHideAnimation?.(),
    ]);
  }
}
