import { GameSingletons } from "@game/app/GameSingletons";
import { getRarityColors } from "@game/constants/RarityColors";
import { StationEntity } from "@game/data/entities/StationEntity";
import { EventBus } from "@sdk/core/EventBus";
import { Color } from "@sdk/utils/color/Color";
import { StationPopupBottomTab } from "./StationPopupBottomTab";

interface StationTabsConfiguration {
  buttonTexture: string;
  iconTexture: string;
  position: { x: number; y: number };
  enabled: boolean;
  labelText: string;
}

const stationTabsConfiguration: StationTabsConfiguration[] = [
  {
    buttonTexture: "ui-popups/tabs/rates-bg-extended.png",
    iconTexture: "ui-popups/tabs/rates.png",
    position: {
      x: 15,
      y: 775,
    },
    enabled: true,
    labelText: "RATES",
  },
  {
    buttonTexture: "ui-popups/tabs/gifts-bg-extended.png",
    iconTexture: "ui-popups/tabs/gifts.png",
    position: {
      x: 190,
      y: 775,
    },
    enabled: true,
    labelText: "GIFTS",
  },
  {
    buttonTexture: "ui-popups/tabs/stake-bg-extended.png",
    iconTexture: "ui-popups/tabs/stake.png",
    position: {
      x: 365,
      y: 775,
    },
    enabled: true,
    labelText: "STAKING",
  },
];

export class StationClickUnrelatedInfoPopupTabsService {
  private readonly context = GameSingletons.getGameContext();

  public readonly stationTabs: Array<StationPopupBottomTab>;
  public readonly events = new EventBus<{
    tabSelectionChange: (index: number) => void;
  }>();

  constructor(station: StationEntity) {
    const rarityColors = getRarityColors(station.rarity);
    const btnTint = new Color(rarityColors.main.toInt());
    const iconTint = new Color(rarityColors.lightComplementary.toInt());

    this.stationTabs = this.initTabs(stationTabsConfiguration, btnTint, iconTint);

    this.events.on({
      tabSelectionChange: (selectedTabIndex: number) => this.setSelectedTab(selectedTabIndex),
    });
  }

  /**
   * @param selectedTab Either the instance of the tab itself, or its index
   */
  setSelectedTab(selectedTab: number | StationPopupBottomTab) {
    if (typeof selectedTab === "number") {
      selectedTab = this.stationTabs[selectedTab];
    }

    for (const tab of this.stationTabs) {
      tab.setSelected(tab === selectedTab);
    }
  }

  initTabs(buttons: Array<StationTabsConfiguration>, btnTint: Color, iconTint: Color) {
    const tabs = new Array<StationPopupBottomTab>();

    for (const [buttonIndex, buttonConfiguration] of buttons.entries()) {
      //// Create station tab
      const tab = new StationPopupBottomTab(buttonConfiguration);
      tab.setTint(btnTint.toInt(), iconTint.toInt());
      tab.position.copyFrom(buttonConfiguration.position);

      //// Set if the tab is active
      tab.setEnabled(buttonConfiguration.enabled);
      tab.scale.set(0.98);

      //// Add click event for tab expansion
      tab.onClick = () => this.events.dispatch("tabSelectionChange", buttonIndex);

      //// Add tab to the array of results
      tabs.push(tab);
    }

    return tabs;
  }
}
