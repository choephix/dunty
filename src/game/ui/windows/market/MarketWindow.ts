import { GameContext } from "@game/app/app";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { Container } from "@pixi/display";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { createXButton } from "../../components/createXButton";
import { FuelPage } from "./pages/fuel/FuelPage";
import { UpgradesPage } from "./pages/upgrades/UpgradesPage";
import { CTPartsPage } from "./pages/ct-parts/CTPartsPage";
import { WindowBackground, WindowBackgroundColor } from "../common/WindowBackground";
import { NavigationTabs } from "../common/NavigationTabs";
import { MarketWindowComponentFactory } from "./components/MarketWindowComponentFactory";
import { GameSingletons } from "@game/app/GameSingletons";
import { EmporiumPage } from "./pages/emporium/EmporiumPage";

const DEFAULT_TAB_INDEX_ON_OPEN = 0;

export type MarketWindowPage = Container & {
  titleString: string;
  loadAndInitialize?: (props?: any) => unknown;
  playShowAnimation?: () => unknown;
  playHideAnimation?: () => unknown;
};

export class MarketWindow extends EnchantedContainer {
  private readonly context = GameSingletons.getGameContext();

  public isOpen = false;

  private readonly tweeener = new TemporaryTweeener(this);

  private page: MarketWindowPage | null = null;
  private tabs: NavigationTabs | null = null;

  async load() {}

  async initialize(initialTabIndex: number = DEFAULT_TAB_INDEX_ON_OPEN, subPage?: any) {
    this.isOpen = true;

    const componentFactory = new MarketWindowComponentFactory(this);

    //// //// //// //// //// //// //// //// ////
    //// Background
    //// //// //// //// //// //// //// //// ////

    const background = new WindowBackground(WindowBackgroundColor.MarketGreen);
    this.addChild(background);

    //// //// //// //// //// //// //// //// ////
    //// Page Title
    //// //// //// //// //// //// //// //// ////
    const title = componentFactory.addTitle("");
    title.position.set(165, 100);
    this.addChild(title);

    //// //// //// //// //// //// //// //// ////
    //// Navigation Tabs
    //// //// //// //// //// //// //// //// ////

    let currentTabIndex = initialTabIndex;

    const tabsCfg = this.context.gameConfigData.features.market.tabs;
    this.tabs = new NavigationTabs([
      { id: "fuel", label: "Fuel", disabled: !tabsCfg.fuel },
      { id: "upgrades", label: "Upgrades", disabled: !tabsCfg.upgrades },
      { id: "parts", label: "Parts", disabled: !tabsCfg.centuryTrainParts },
      { id: "emporium", label: "Emporium", disabled: !tabsCfg.emporium },
    ]);
    this.tabs.position.set(2300 - this.tabs.width, 120);
    this.tabs.playShowAnimation();
    this.addChild(this.tabs);

    const builderFunctions: Record<number, () => MarketWindowPage> = {
      [0]: () => new FuelPage(),
      [1]: () => new UpgradesPage(componentFactory),
      [2]: () => new CTPartsPage(),
      [3]: () => new EmporiumPage(),
    };

    this.tabs.events.on({
      tabSelected: async (_, index) => {
        this.tabs!.setInteractive(false);

        title.text = ``;

        if (this.page) {
          /**
           * Save a ref to the current page so we can destroy it after we set `this.page = null`
           * (and eventually probably the new page)
           */
          const prevpage = this.page;
          Promise.resolve(prevpage.playHideAnimation?.()).then(() => prevpage.destroy({ children: true }));

          this.page = null;
        }

        if (index > currentTabIndex) {
          await background.tweenLeft();
        } else if (index < currentTabIndex) {
          await background.tweenRight();
        }

        currentTabIndex = index;

        this.page = builderFunctions[index]();
        this.addChild(this.page);

        title.text = this.page.titleString.toUpperCase();

        const loadAndInitializePromise = Promise.resolve(this.page.loadAndInitialize?.(subPage));
        await this.context.spinner.showDuring(loadAndInitializePromise);

        await this.page.playShowAnimation?.();

        this.tabs!.setInteractive(true);
      },
    });

    //// //// //// //// //// //// //// //// ////
    //// Close Button (X)
    //// //// //// //// //// //// //// //// ////

    const xButton = createXButton();
    xButton.position.set(65, 55);
    xButton.behavior.on({ trigger: () => this.emit("clickClose") });
    xButton.behavior.on({ trigger: () => xButton.destroy({ children: true }) });
    this.addChild(xButton);

    //// //// //// //// //// //// //// //// ////
    //// -- -- -- --  Logic  -- -- -- -- -- ////
    //// //// //// //// //// //// //// //// ////

    await this.context.ticker.delay(0.65);

    this.tabs.setSelectedTabIndex(initialTabIndex);
  }

  async playShowAnimation() {
    await this.tweeener.fromTo(
      this,
      {
        pixi: {
          alpha: 0,
        },
      },
      {
        pixi: {
          alpha: 1,
        },
        duration: 0.5,
        ease: "power.in",
      }
    );
  }

  playHideAnimation() {
    if (this.page) {
      this.page.destroy({ children: true });
      this.page = null;
    }

    return this.tweeener.fromTo(
      this,
      {
        pixi: {
          alpha: 1,
        },
      },
      {
        pixi: {
          alpha: 0,
        },
        duration: 0.5,
        ease: "power.in",
      }
    );
  }

  get width(): number {
    return 2416; // TODO: un-hardcode these
  }

  get height(): number {
    return 1272; // TODO: un-hardcode these
  }
}
