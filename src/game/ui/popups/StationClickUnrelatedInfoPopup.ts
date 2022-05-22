import { __createPikachu } from "@debug/special/pikachu";
import { __DEBUG__ } from "@debug/__DEBUG__";
import { createComingSoonMessage } from "@game/asorted/createComingSoonMessage";
import { StakingAddonType } from "@game/asorted/StakingType";
import { StakingAddonStatusData } from "@game/data/staking/models";
import { StakingAddonDataService } from "@game/data/staking/StakingAddonDataService";
import { Container } from "@pixi/display";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { PageObjectManager } from "@sdk-pixi/ui-helpers/PageObjectManager";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { StationPopup } from "./bases/StationPopup";
import { ExpansionArrow } from "./components/ExpansionArrow";
import { StakingHubStatusThumbnail } from "./components/StakingHubStatusThumbnail";
import { StationPopupBackgroundType } from "./components/StationPopupBackgroundType";
import { StationClickUnrelatedInfoPopupTabsService } from "./components/stationTabs/StationPopupTabsService";
import { PopupPlacementFunction } from "./util/PopupPlacementFunction";

export class StationClickUnrelatedInfoPopup extends StationPopup {
  public placementFunc: PopupPlacementFunction = PopupPlacementFunction.sidewaysSmart;

  interactive = true;
  buttonMode = true;

  mouseIsOver = false;
  isExpanded = false;

  arrow: ExpansionArrow | null = null;

  setExpanded(expanded: boolean) {
    this.isExpanded = expanded;

    this.clearContent();

    if (expanded) {
      this.fillContent_Expanded();
    } else {
      this.fillContent_Collapsed();
    }
  }

  async fillContent_Collapsed() {
    const { station } = this;

    if (!station) {
      throw new Error("StationInfoPopup: station is not set");
    }

    await this.setPadBackground(StationPopupBackgroundType.NEXT_STOP);

    {
      const titleText = station.name;
      const title = this.componentFactory.createTitle(titleText, this.padWidth);
      title.y = 32;
      title.anchor.set(0.0);
      this.addChild(title);
    }

    {
      try {
        const potentialRunStatsText = "Owned by: " + station.ownerName;
        const potentialRunStatsRibbon = this.componentFactory.createInfoRibbon(
          potentialRunStatsText,
          `ui-popups/bg-lvl1-btm-info.png`
        );
        potentialRunStatsRibbon.position.set(this.centerX, 130);
        this.addChild(potentialRunStatsRibbon);
      } catch (e) {
        console.error(e);
      }
    }

    const commodityRateIcons = this.componentFactory.addCommodityRateIcons(station);
    commodityRateIcons.position.set(this.centerX, 164);

    this.arrow = new ExpansionArrow(station.rarity.toString());
    this.arrow.position.set(this.centerX, this.padHeight);
    this.addChild(this.arrow);

    // DRY
    this.arrow.enchantments.watch(
      () => this.mouseIsOver,
      (mouseIsOver: boolean) => {
        if (this.arrow) {
          this.arrow.mouseIsOver = mouseIsOver;
        }
      }
    );

    await this.fadeChildrenIn();
  }

  async fillContent_Expanded() {
    const { station, context } = this;

    if (!station) {
      throw new Error("StationInfoPopup: station is not set");
    }

    await this.setPadBackground(StationPopupBackgroundType.UNRELATED_STATION_CLICK_TEMP);

    //// Title

    const expandedTitle = this.componentFactory.createTitle(station.name, this.padWidth);
    this.addChild(expandedTitle);

    //// Current Tab Header

    const ribbon = this.componentFactory.createInfoRibbon("", "ui-popups/bg-lvl2-info.png");
    ribbon.updateText("", 0.7);
    ribbon.position.set(this.padWidth * 0.5, 165);
    this.addChild(ribbon);

    const tabsService = new StationClickUnrelatedInfoPopupTabsService(station);

    for (const tab in tabsService.stationTabs) {
      this.pad.addChild(tabsService.stationTabs[tab]);
    }

    //// Tab Content (Pages)

    type TabContentContainer = Container & { playShowAnimation?: () => void };
    type TabContentConfiguration = {
      title: string;
      construct: () => TabContentContainer | null;
      comingSoon?: boolean;
    };
    type TabIndex = 0 | 1 | 2;

    const tabsCfg = context.gameConfigData.features.stationPopups;
    const pageConfigurations: Record<TabIndex, TabContentConfiguration> = {
      // Rates Tab
      [0]: {
        title: `COMMODITY RATES`,
        construct: () => {
          const ratesList = this.componentFactory.addCommodityRatesInfoBox(185, 375);
          return ratesList;
        },
        comingSoon: !tabsCfg.commodityRates,
      },

      // Gifts Tab
      [1]: {
        title: `GIFTS`,
        construct: () => {
          if (!__DEBUG__) return null;
          const pikachu = __createPikachu({ scale: 0.2, x: this.padWidth * 0.5, y: this.padHeight * 0.5 });
          return Object.assign(pikachu, {
            playShowAnimation: () =>
              pikachu.tweener.from(pikachu.scale, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: `back.out`,
              }),
          });
        },
        comingSoon: !tabsCfg.gifts,
      },

      // Staking Tab
      [2]: {
        title: `STAKING HUBS`,
        construct: () => {
          const container = new Container();

          const station = this.station!;
          const { popups } = this.context.main;
          async function openStakingAddonPopup(addonType: StakingAddonType) {
            const popupService =
              addonType === StakingAddonType.RailYard ? popups.addonRailYard : popups.addonConductorLounge;
            popups.clear();
            await context.ticker.nextFrame();
            popupService.setCurrentStation(station);
          }

          type LoadedData = {
            railYardData: StakingAddonStatusData;
            conductorLoungeData: StakingAddonStatusData;
          };
          const load = async (): Promise<LoadedData> => {
            const railYardDataService = new StakingAddonDataService(StakingAddonType.RailYard);
            const conductorLoungeDataService = new StakingAddonDataService(StakingAddonType.ConductorLounge);
            const stationId = station.assetId;
            return {
              railYardData: await railYardDataService.getAddonStatusData(stationId),
              conductorLoungeData: await conductorLoungeDataService.getAddonStatusData(stationId),
            };
          };

          const initialize = ({ railYardData, conductorLoungeData }: LoadedData) => {
            function addThumb(addonData: StakingAddonStatusData) {
              const stakeRailYard = new StakingHubStatusThumbnail();
              stakeRailYard.scale.set(0.5);
              stakeRailYard.fillContent(addonData);
              if (addonData.unlocked) {
                buttonizeDisplayObject(stakeRailYard, () => openStakingAddonPopup(addonData.type));
              }
              return container.addChild(stakeRailYard);
            }

            const stakeRailYard = addThumb(railYardData);
            stakeRailYard.position.set(28, 200);

            const stakeLounge = addThumb(conductorLoungeData);
            stakeLounge.position.set(28, 300);

            const tweeener = new TemporaryTweeener(container);
            function playShowAnimation() {
              return tweeener.from([stakeRailYard, stakeLounge], {
                pixi: {
                  pivotX: 56,
                },
                alpha: 0.0,
                duration: 0.43,
                ease: `back.out`,
                stagger: 0.1,
              });
            }

            playShowAnimation();
          };

          return Object.assign(container, {
            load,
            initialize,
          });
        },
        comingSoon: !tabsCfg.stakingHubs,
      },
    };

    const pageManager = new PageObjectManager(pageConfigurations, this);

    ////

    let currentTabIndex = -1;
    const setCurrentTab = async (tabIndex: TabIndex) => {
      if (currentTabIndex === tabIndex) {
        return;
      }

      currentTabIndex = tabIndex;
      const { title, comingSoon } = pageConfigurations[tabIndex];
      ribbon.updateText(comingSoon ? `...` : title, 0.7);

      /** Update the tabs */
      tabsService.setSelectedTab(tabIndex);

      //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP ////
      if (comingSoon) {
        const tempPage = createComingSoonMessage();
        tempPage.position.set(141, 285);
        await pageManager.switcher.setPage(tempPage);
        return;
      }
      //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP ////

      /** Update the page */
      await pageManager.setCurrentPage(tabIndex, false);
    };

    await this.fadeChildrenIn();

    /**
     * Add the event listener before setting the current tab to its iniital index of 0,
     * so that our handler function is above also called to fill the content
     */

    tabsService.events.on({ tabSelectionChange: (index: number) => setCurrentTab(index as TabIndex) });

    await setCurrentTab(0);
  }
}
