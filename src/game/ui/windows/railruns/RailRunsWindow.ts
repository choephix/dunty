import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { Sprite } from "@pixi/sprite";
import { PageObjectManager } from "@sdk-pixi/ui-helpers/PageObjectManager";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { createXButton } from "../../components/createXButton";
import { NavigationTabs } from "../common/NavigationTabs";
import { WindowBackground, WindowBackgroundColor } from "../common/WindowBackground";
import { RailRunsWindowComponentFactory } from "./components/RailRunsWindowComponentFactory";
import { RailRunsHistoryPage } from "./pages/RailRunsHistoryPage";
import { RailRunsMyTrainsPage } from "./pages/RailRunsMyTrainsPage";

export class RailRunsWindow extends EnchantedContainer {
  private readonly context: GameContext = GameSingletons.getGameContext();
  private readonly tweeener = new TemporaryTweeener(this);

  private readonly componentFactory = new RailRunsWindowComponentFactory();

  public isOpen = false;

  public interactive = true;
  public interactiveChildren = true;

  constructor() {
    super();
    this.loadAndInitialize();
  }

  async loadAndInitialize() {
    this.isOpen = true;

    //// //// //// //// //// //// //// //// ////
    //// Background
    //// //// //// //// //// //// //// //// ////

    const background = new WindowBackground(WindowBackgroundColor.RailrunsPurple);
    this.addChild(background);

    //// //// //// //// //// //// //// //// ////
    //// List Pad
    //// //// //// //// //// //// //// //// ////

    const listPadTexture = this.context.assets.getTexture("windowListPadLong");
    const listPad = new Sprite(listPadTexture);
    listPad.anchor.set(0.5, 0.5);
    listPad.scale.set(2.0);
    listPad.position.set(1200, 715);
    this.addChild(listPad);

    //// //// //// //// //// //// //// //// ////
    //// Navigation Tabs
    //// //// //// //// //// //// //// //// ////

    const tabsCfg = this.context.gameConfigData.features.railRunsWindow.tabs;
    const tabs = new NavigationTabs([
      { id: `trains`, label: `Trains`, disabled: !tabsCfg.trains },
      { id: `history`, label: `History`, disabled: !tabsCfg.history },
    ]);
    tabs.position.set(1625, 120);
    tabs.playShowAnimation();
    this.addChild(tabs);

    let currentTabIndex = 0;
    tabs.events.on({
      tabSelected: async (tabData: { id: "trains" | "history" }, index) => {
        const previousTabIndex = currentTabIndex;
        currentTabIndex = index;

        pageManager.setCurrentPage(null);
        this.tweeener.to(listPad, { alpha: 0, duration: 0.29 });

        console.log(`RailRunsWindow: tabSelected: `, tabData.id);

        if (index > previousTabIndex) {
          await background.tweenLeft();
        } else if (index < previousTabIndex) {
          await background.tweenRight();
        }

        pageManager.setCurrentPage(tabData.id);

        await this.tweeener.to(listPad, { alpha: 1, duration: 0.88 });
      },
    });

    //// //// //// //// //// //// //// //// ////
    //// Pages
    //// //// //// //// //// //// //// //// ////

    const pageManager = new PageObjectManager(
      {
        trains: () => {
          const trainsPage = new RailRunsMyTrainsPage(this.componentFactory);
          trainsPage.populateList();
          return trainsPage;
        },
        history: () => {
          const hisotryPage = new RailRunsHistoryPage(this.componentFactory);
          this.context.spinner.showDuring(hisotryPage.populateList());
          return hisotryPage;
        },
      },
      this
    );

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

    await this.context.ticker.delay(0.81);

    tabs.setSelectedTabIndex(0);
  }

  playShowAnimation() {
    return this.tweeener.fromTo(
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
}
