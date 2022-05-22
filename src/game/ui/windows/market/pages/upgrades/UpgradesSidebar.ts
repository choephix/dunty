import { __DEBUG__ } from "@debug/__DEBUG__";
import { GameSingletons } from "@game/app/GameSingletons";
import { Container } from "@pixi/display";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { EventBus } from "@sdk/core/EventBus";
import { iterateObjectProperties } from "@sdk/helpers/objects";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { UpgradeSidebarTab } from "./UpgradeSidebarTab";

export enum UpgradesSidebarTabKey {
  RailCarSlots = 0,
  Compositions = 1,
  PortalPasses = 2,
  UnlockTrains = 3,
}

function getTabsConfiguration() {
  const cfg = GameSingletons.getGameContext().gameConfigData.features.market.tabs.upgrades;
  const TAB_CONFIGS: Record<UpgradesSidebarTabKey, { label: string; disabled: boolean }> = {
    [UpgradesSidebarTabKey.RailCarSlots]: { label: "RAIL CAR SLOTS", disabled: !cfg.railCarSlots },
    [UpgradesSidebarTabKey.Compositions]: { label: "COMPOSITIONS", disabled: !cfg.compositions },
    [UpgradesSidebarTabKey.PortalPasses]: { label: "PORTAL PASSES", disabled: !cfg.portalPasses },
    [UpgradesSidebarTabKey.UnlockTrains]: { label: "UNLOCK TRAINS", disabled: !cfg.unlockTrains && !__DEBUG__ },
  };
  return TAB_CONFIGS;
}

export class UpgradesSidebar extends Container {
  public readonly events = new EventBus<{
    tabChange: (tabIndex: UpgradesSidebarTabKey) => void;
  }>();

  private readonly tabSelectionArray: Array<UpgradeSidebarTab> = [];

  public readonly assets = GameSingletons.getResources();
  public readonly simpleFactory = GameSingletons.getSimpleObjectFactory();

  private readonly tweeener = new TemporaryTweeener(this);

  constructor() {
    super();

    this.setUpTabs();
  }

  selectTab(tabIndex: UpgradesSidebarTabKey) {
    if (!this.tabSelectionArray[tabIndex].active) {
      this.resetTabs();
      this.tabSelectionArray[tabIndex].setActive(true);
      this.events.dispatch("tabChange", tabIndex);
    }
  }

  setUpTabs() {
    const TAB_CONFIGS = getTabsConfiguration();

    let startY = 0;
    for (const [tabKey, { label, disabled }] of iterateObjectProperties(TAB_CONFIGS)) {
      const tab = new UpgradeSidebarTab(
        this.assets.getTexture("ui-market-window-compositions/tab-active.png"),
        this.assets.getTexture("ui-market-window-compositions/tab-inactive.png"),
        label
      );
      tab.position.set(0, startY);
      tab.setDisabled(disabled);
      tab.setActive(false);
      buttonizeDisplayObject(tab, () => this.selectTab(tabKey));

      this.addChild(tab);
      this.tabSelectionArray.push(tab);

      startY += tab.height;
    }
  }

  resetTabs() {
    for (const tab in this.tabSelectionArray) {
      this.tabSelectionArray[tab].setActive(false);
    }
  }

  public playShowAnimation() {
    return this.tweeener.from(this.tabSelectionArray, {
      pixi: {
        scaleX: 0.8,
        pivotX: 50,
        alpha: 0,
      },
      duration: 0.37,
      stagger: 0.09,
      ease: "power3.out",
    });
  }

  public playHideAnimation() {
    return this.tweeener.to(this.tabSelectionArray, {
      pixi: {
        scaleX: 0.8,
        pivotX: 50,
        alpha: 0,
      },
      duration: 0.19,
      stagger: 0.03,
      ease: "power.in",
    });
  }
}
