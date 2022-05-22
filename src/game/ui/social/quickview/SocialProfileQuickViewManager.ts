import { GameSingletons } from "@game/app/GameSingletons";
import { RailroaderDashPanelType } from "@game/ui/railroader-dash/panels/models";
import { DisplayObject } from "@pixi/display";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { SocialProfileDataService } from "../SocialProfileDataService";
import { SocialProfileQuickView } from "./SocialProfileQuickView";

export class SocialProfileQuickViewManager {
  panel: SocialProfileQuickView | null = null;

  private openFullProfileView(username: string) {
    this.close();

    return GameSingletons.getInputService().dispatch("openSocialProfilePanel", username);
  }

  private openMyFullProfileView() {
    this.close();

    return GameSingletons.getInputService().dispatch(
      "openRailRoaderDashboard",
      RailroaderDashPanelType.MySocialProfile
    );
  }

  async open(username: string, onViewProfileButtonClick?: () => void) {
    if (this.panel) {
      this.close();
    }

    const { stageContainers, userData, viewSize } = GameSingletons.getGameContext();
    const container = stageContainers._hud;

    const isMe = userData.name == username;

    onViewProfileButtonClick ||= isMe
      ? this.openMyFullProfileView.bind(this)
      : this.openFullProfileView.bind(this, username);

    const panel = (this.panel = new SocialProfileQuickView(onViewProfileButtonClick));
    container.addChild(panel);
    panel.applyUserData(username);
    panel.pivot.set(panel.background.width, panel.background.height * 0.5);
    const updatePanelPosition = () => {
      const scale = viewSize.vmin / 1640;
      panel.scale.set(scale);
      panel.position.set(viewSize.width, viewSize.height * 0.35);
    };

    const tweeener = new TemporaryTweeener(panel);
    tweeener.onEveryFrame(updatePanelPosition);

    //// //// //// //// //// //// //// //// ////

    tweeener.delay(0.2).then(() => panel.addCloseButton(() => this.close()).playShowAnimation());

    updatePanelPosition();
    await tweeener.from(panel, {
      pixi: { pivotX: -panel.width },
      duration: 0.53,
      ease: "power4.out",
    });
  }

  registerForQuickViewOnClick(target: DisplayObject, username: string) {
    target.interactive = true;
    target.buttonMode = true;
    target.on("click", () => this.open(username));
    target.on("tap", () => this.open(username));

    const { tooltips } = GameSingletons.getGameContext();
    tooltips.registerTarget(target, `Click to view ${username.toUpperCase()}'s profile`);
  }

  async getMyProfileData() {
    const { userData } = GameSingletons.getGameContext();
    const dataService = new SocialProfileDataService();

    return {
      username: userData.name,
      nickname: null,
      preferences: await dataService.getMyAvatarBadgePreferences(),
    };
  }

  async close() {
    const previousPanel = this.panel;
    if (previousPanel) {
      this.panel = null;

      previousPanel.avatar.playHideAnimation();

      const tweeener = new TemporaryTweeener(previousPanel);
      await tweeener
        .to(previousPanel, {
          pixi: { pivotX: -previousPanel.width },
          duration: 0.375,
          ease: "power.in",
        })
        .then(() => previousPanel.destroy({ children: true }));
    }
  }
}
