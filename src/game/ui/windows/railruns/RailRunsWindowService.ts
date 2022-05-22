import { GameSingletons } from "@game/app/GameSingletons";
import { Rectangle } from "@pixi/math";
import { RailRunsWindow } from "./RailRunsWindow";

export class RailRunsWindowService {
  private readonly context = GameSingletons.getGameContext();

  public currentWindow: RailRunsWindow | null = null;

  private readonly _okRect = new Rectangle();

  constructor() {
    this.context.ticker.add(this.updateSizeAndPositionOnScreen, this);
    this.context.input.on({
      toggleRailRunsWindow: () => {
        if (this.currentWindow) {
          this.closeWindow();
        } else {
          this.openWindow();
        }
      },
      openRailRunsWindow: () => {
        this.openWindow();
      },
      closeRailRunsWindow: () => {
        this.closeWindow();
      },
    });
  }

  updateSizeAndPositionOnScreen() {
    if (!this.currentWindow) {
      return;
    }

    const { viewSize } = this.context;

    const MARGIN = [0.04 * viewSize.vmin, 0.1 * viewSize.vmin, 0.04 * viewSize.vmin, 0.04 * viewSize.vmin];

    const okRect = this._okRect;
    okRect.x = MARGIN[0];
    okRect.y = MARGIN[1];
    okRect.width = viewSize.width - MARGIN[0] - MARGIN[2];
    okRect.height = viewSize.height - MARGIN[1] - MARGIN[3];

    const windowWidth = this.currentWindow.width / this.currentWindow.scale.x;
    const windowHeight = this.currentWindow.height / this.currentWindow.scale.y;
    const scale = Math.min(okRect.width / windowWidth, okRect.height / windowHeight);

    this.currentWindow.scale.set(scale);
    this.currentWindow.pivot.set(windowWidth / 2, windowHeight / 2);
    this.currentWindow.position.set(okRect.x + okRect.width / 2, okRect.y + okRect.height / 2);
  }

  async openWindow() {
    //TODO: Move this to a separate reactor, and close the card drawer on any window open
    this.context.main.cards.setCardDrawerState(null);

    const { stageContainers } = this.context;

    if (!this.currentWindow) {
      this.currentWindow = new RailRunsWindow();
      this.currentWindow.on("clickClose", () => this.closeWindow());
      this.currentWindow.playShowAnimation();
      stageContainers._hud.addChild(this.currentWindow);
      this.updateSizeAndPositionOnScreen();
    } else {
      console.warn("RailRunsWindowService.openWindow: window already open");
    }
  }

  async closeWindow() {
    if (this.currentWindow) {
      const currentWindow = this.currentWindow;
      this.currentWindow = null;

      currentWindow.playHideAnimation().then(() => currentWindow.destroy({ children: true }));
    } else {
      console.warn("RailRunsWindowService.closeWindow: window doesn't exist");
    }
  }
}
