import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { SfxManager } from "@game/app/sound/sfxManager";
import { Container } from "@pixi/display";
import { RailroaderDashPanelType } from "./panels/models";
import { RailroaderDash } from "./RailroaderDash";

export class RailroaderDashService {
  private readonly context: GameContext = GameSingletons.getGameContext();

  public currentDashboard: RailroaderDash | null = null;
  public selectedTabIndex: number | null = null;

  public get isOpen() {
    return !!this.currentDashboard?.open;
  }

  constructor(public readonly dashboardContainer: Container) {
    this.context.input.on({
      toggleRailRoaderDashboard: async () => {
        if (this.currentDashboard?.open) {
          this.closeDashboard();
        } else {
          this.openDashboard();
        }
      },
      openRailRoaderDashboard: async (panel: RailroaderDashPanelType | null) => {
        this.openDashboard(panel);
      },
      closeRailRoaderDashboard: async () => {
        this.closeDashboard();
      },
    });
  }

  async openDashboard(panel: RailroaderDashPanelType | null = null) {
    if (!this.currentDashboard) {
      this.currentDashboard = new RailroaderDash();
      this.currentDashboard.init();
    }

    if (!this.currentDashboard.open) {
      this.dashboardContainer.addChild(this.currentDashboard);

      this.context.sfx.play("cogWheelRRDash", false, SfxManager.MultipleInstanceStrategy.StopPrevious);

      this.currentDashboard.open = true;
      this.currentDashboard.setCurrentCentralPanelType(panel, true);
      await this.currentDashboard.playShowAnimation();
    } else {
      console.warn("RailRunsWindowService.closeDashboard: dashboard already open");
    }
  }

  async closeDashboard() {
    if (this.currentDashboard) {
      const currentDashboard = this.currentDashboard;
      this.currentDashboard = null;

      this.context.sfx.play("cogWheelRRDash", false, SfxManager.MultipleInstanceStrategy.StopPrevious);

      currentDashboard.open = false;
      await currentDashboard.playHideAnimation().then(() => currentDashboard.destroy());
    } else {
      console.warn("RailRunsWindowService.closeDashboard: dashboard doesn't exist");
    }
  }
}
