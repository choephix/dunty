import { GameSingletons } from "@game/app/GameSingletons";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import {
  playHidenimationRecursivelyThenDestroy,
  playShowAnimationRecursively,
} from "@game/ui/animation/playShowHideAnimationRecursively";
import { Container } from "@pixi/display";
import { MarketWindowComponentFactory } from "../../components/MarketWindowComponentFactory";
import { CompositionUpgradesPage } from "./compositions/CompositionUpgradesPage";
import { RailCarSlotsPage } from "./rail-car-slots/RailCarSlotsPage";
import { UnlockTrainsPage } from "./unlock-trains/UnlockTrainsPage";
import { UpgradesSidebar, UpgradesSidebarTabKey } from "./UpgradesSidebar";

export type UpgradesSubpage = Container & {
  loadAndInitialize?: () => unknown;
  playShowAnimation?: () => unknown;
  playHideAnimation?: () => unknown;
};

export class UpgradesPage extends EnchantedContainer {
  private readonly context = GameSingletons.getGameContext();

  public readonly titleString = "Upgrades";

  private subPage: UpgradesSubpage | null = null;
  private sidebarTabs: UpgradesSidebar | null = null;

  constructor(public readonly componentFactory: MarketWindowComponentFactory) {
    super();
  }

  async loadAndInitialize() {
    const { spinner } = this.context;

    //// //// //// //// //// //// //// //// ////
    //// Navigation Sidebar (left tabs)
    //// //// //// //// //// //// //// //// ////

    this.sidebarTabs = new UpgradesSidebar();
    this.sidebarTabs.position.set(59, 218);
    this.addChild(this.sidebarTabs);

    const builderFunctions: Record<UpgradesSidebarTabKey, () => Container> = {
      [UpgradesSidebarTabKey.RailCarSlots]: () => new RailCarSlotsPage(),
      [UpgradesSidebarTabKey.Compositions]: () => new CompositionUpgradesPage(),
      [UpgradesSidebarTabKey.PortalPasses]: () => new Container(),
      [UpgradesSidebarTabKey.UnlockTrains]: () => new UnlockTrainsPage(),
    };

    this.sidebarTabs.events.addListener("tabChange", async tabIndex => {
      if (this.subPage) {
        /**
         * Save a ref to the current page so we can destroy it after
         */
        const prevSubpage = this.subPage;
        await playHidenimationRecursivelyThenDestroy(prevSubpage);

        this.subPage = null;
      }

      this.subPage = builderFunctions[tabIndex]();
      this.subPage.position.set(500, 220);
      this.addChild(this.subPage);

      const loadAndInitializePromise = Promise.resolve(this.subPage.loadAndInitialize?.());
      await spinner.showDuring(loadAndInitializePromise);

      await playShowAnimationRecursively(this.subPage);
    });

    //// //// //// //// //// //// //// //// ////
    //// -- -- -- --  Logic  -- -- -- -- -- ////
    //// //// //// //// //// //// //// //// ////

    this.sidebarTabs.selectTab(UpgradesSidebarTabKey.RailCarSlots);
  }

  public async playShowAnimation() {
    await Promise.all([this.sidebarTabs?.playShowAnimation()]);
  }

  public async playHideAnimation() {
    await Promise.all([this.sidebarTabs?.playHideAnimation(), this.subPage?.playHideAnimation?.()]);
  }
}
