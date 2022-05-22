import { GameSingletons } from "@game/app/GameSingletons";
import { Rectangle } from "@pixi/math";
import { MarketWindow } from "./MarketWindow";
import { CTPartsSubpageKey } from "./pages/ct-parts/CTPartsPage";
import { EmporiumSectionKey } from "./pages/emporium/EmporiumPage";

type MarketWindowInitializationOptions =
  | { page: "fuel" }
  | { page: "upgrades"; subpage: "rcSlots" | "compositions" | "portalPasses" | "unlockTrains" }
  | { page: "ctparts"; subpage: CTPartsSubpageKey }
  | { page: "emporium"; subpage: EmporiumSectionKey };

export class MarketWindowService {
  private readonly context = GameSingletons.getGameContext();
  private readonly _okRect = new Rectangle();

  public currentWindow: MarketWindow | null = null;

  constructor() {
    this.context.ticker.add(this.updateSizeAndPositionOnScreen, this);
    this.context.input.on({
      toggleMarketWindow: () => {
        if (this.currentWindow?.isOpen) {
          this.closeWindow();
        } else {
          this.openWindow();
        }
      },
      openMarketWindow: (initializationOptions: MarketWindowInitializationOptions) => {
        this.openWindow(initializationOptions);
      },
      closeMarketWindow: () => {
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

    const windowWidth = this.currentWindow.width;
    const windowHeight = this.currentWindow.height;
    const scale = Math.min(okRect.width / windowWidth, okRect.height / windowHeight);

    this.currentWindow.scale.set(scale);
    this.currentWindow.pivot.set(windowWidth / 2, windowHeight / 2);
    this.currentWindow.position.set(okRect.x + okRect.width / 2, okRect.y + okRect.height / 2);
  }

  async openWindow(initializationOptions?: MarketWindowInitializationOptions) {
    //TODO: Move this to a separate reactor, and close the card drawer on any window open
    this.context.main.cards.setCardDrawerState(null);

    const { stageContainers, ticker, spinner } = this.context;

    const tabKey = initializationOptions?.page;
    const tabKeys = ["fuel", "upgrades", "ctparts", "emporium"];
    const tabIndex = tabKey && tabKeys.includes(tabKey) ? tabKeys.indexOf(tabKey) : undefined;

    const subPage = (initializationOptions as any)?.subpage;

    if (!this.currentWindow) {
      this.currentWindow = new MarketWindow();
      this.currentWindow.on("clickClose", () => this.closeWindow());
      await spinner.showDuring(this.currentWindow.load());
      this.currentWindow.initialize(tabIndex, subPage);
      await ticker.nextFrame();
      stageContainers._hud.addChild(this.currentWindow);
      this.currentWindow.playShowAnimation();
      this.updateSizeAndPositionOnScreen();
    } else {
      console.warn("MarketWindow.openWindow: window already open");
    }
  }

  async closeWindow() {
    if (this.currentWindow) {
      const currentWindow = this.currentWindow;
      this.currentWindow = null;

      currentWindow.playHideAnimation().then(() => currentWindow.destroy({ children: true }));
    } else {
      console.warn("MarketWindow.closeWindow: window doesn't exist");
    }
  }

  // async openWindow() {
  //   //TODO: Move this to a separate reactor, and close the card drawer on any window open
  //   this.context.main.cards.setCardDrawerState(null);

  //   const { stageContainers, ticker, spinner } = this.context;

  //   if (this.currentWindow == null) {
  //     this.currentWindow = new MarketWindow(this.context);
  //     this.currentWindow.on("clickClose", () => this.closeWindow());
  //     stageContainers._hud.addChild(this.currentWindow);
  //     await spinner.showDuring(this.currentWindow.loadAndInitialize());
  //     await ticker.nextFrame();
  //   }

  //   await this.currentWindow.playShowAnimation();
  // }

  // async closeWindow() {
  //   return this.currentWindow?.playHideAnimation();
  // }
}
