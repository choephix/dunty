import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { Container } from "@pixi/display";
import { SocialProfileDash } from "./SocialProfileDash";

export class SocialProfileDashService {
  private readonly context: GameContext = GameSingletons.getGameContext();

  public currentDashboard: SocialProfileDash | null = null;

  public get isOpen() {
    return !!this.currentDashboard?.open;
  }

  constructor(public readonly dashboardContainer: Container) {
    this.context.input.on({
      openSocialProfilePanel: async (username?: string) => {
        if (this.currentDashboard) {
          this.closeDashboard();
        }

        this.openDashboard(username || this.context.userData.name);
      },
      closeSocialProfilePanel: async () => {
        this.closeDashboard();
      },
    });

    // onKeyPress("s", () => {
    //   if (this.currentDashboard?.open) {
    //     this.closeDashboard();
    //   } else {
    //     this.openDashboard("xxwcw.wam");
    //   }
    // });
  }

  async openDashboard(user: string) {
    if (!this.currentDashboard) {
      this.currentDashboard = new SocialProfileDash();
    }

    if (!this.currentDashboard.open) {
      this.dashboardContainer.addChild(this.currentDashboard);

      this.currentDashboard.open = true;
      this.currentDashboard.openViewProfile(user);
      await this.currentDashboard.playShowAnimation();
    } else {
      console.warn("SocialProfileDashService.closeDashboard: dashboard already open");
    }
  }

  async closeDashboard() {
    if (this.currentDashboard) {
      const currentDashboard = this.currentDashboard;
      this.currentDashboard = null;

      currentDashboard.open = false;
      await currentDashboard.playHideAnimation().then(() => currentDashboard.destroy());
    } else {
      console.warn("SocialProfileDashService.closeDashboard: dashboard doesn't exist");
    }
  }
}
