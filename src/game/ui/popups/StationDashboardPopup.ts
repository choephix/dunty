import { __window__ } from "@debug/__";
import { GameSingletons } from "@game/app/GameSingletons";
import { injectSimpleFadeAnimations, WithHideShowAnimations } from "@game/asorted/injectSimpleFadeAnimations";
import { FontIcon } from "@game/constants/FontIcon";
import { getRarityColors } from "@game/constants/RarityColors";
import { Sprite } from "@pixi/sprite";
import { formatToMaxDecimals } from "@sdk-ui/utils/formatToMaxDecimals";
import { Color } from "@sdk/utils/color/Color";
import { StationPopup } from "./bases/StationPopup";
import { StationPopupBackgroundType } from "./components/StationPopupBackgroundType";
import { ChartsDataTimeframe, StationDashboardChartsDataAdapter } from "./data/StationDashboardChartsDataAdapter";
import { BillboardDashboardPage } from "./station-dashboard-components/billboard/BillboardPage";
import { BarChartView } from "./station-dashboard-components/charts/BarChartView";
import { downloadChartDataAsCSV } from "./station-dashboard-components/charts/downloadChartDataAsCSV";
import { LineChartView } from "./station-dashboard-components/charts/LineChartView";
import { StakesPage, StakingAddonPageKey } from "./station-dashboard-components/stakes/StakesPage";
import { StationDashboardComponentFactory } from "./station-dashboard-components/StationDashboardComponentFactory";
import { StationDashboardSidebarTabs } from "./station-dashboard-components/StationDashboardSidebarTabs";
import { PopupPlacementFunction } from "./util/PopupPlacementFunction";

interface StationDashboardPopupPageProps {
  pageIndex: number;
  subPageIndex?: number;
}

export class StationDashboardPopup extends StationPopup {
  public readonly placementFunc: PopupPlacementFunction = PopupPlacementFunction.topTooltip;

  protected readonly componentFactory = new StationDashboardComponentFactory(this);
  protected readonly dataGetter = new StationDashboardChartsDataAdapter();

  protected readonly pageDimmer = this.componentFactory.addPageDimmer();
  public sidebarTabs!: StationDashboardSidebarTabs;

  protected currentPageProps: StationDashboardPopupPageProps | null = null;
  protected unfoldOnShowAnimation = false;

  async fillContent_Default() {
    const { station } = this;
    if (!station) {
      throw new Error("StationDashboardPopup: station is not set");
    }

    __window__.dash = this;
    console.log(`Station Dashboard opened.\n`, station);

    this.setPadBackground(StationPopupBackgroundType.MY_STATION_DASHBOARD);

    this.addChild(this.pageDimmer);
    this.pageDimmer.alpha = 0;
    this.persistentElements.add(this.pageDimmer);

    //add side panel
    const rarityColors = getRarityColors(station.rarity);
    const iconTint = new Color(rarityColors.lightComplementary.toInt());
    const btnTint = new Color(rarityColors.main.toInt());
    this.sidebarTabs = new StationDashboardSidebarTabs(btnTint, iconTint, pageIndex => {
      const pageProps = pageIndex > 0 ? { pageIndex } : null;
      this.setCurrentPage(pageProps);
    });
    this.sidebarTabs.position.set(-8, -4);
    this.addChild(this.sidebarTabs);
    this.persistentElements.add(this.sidebarTabs);

    this.setCurrentPage(null);
  }

  setCurrentPage(pg: StationDashboardPopupPageProps | null) {
    const { station, componentFactory, dataGetter } = this;

    if (!station) {
      throw new Error("StationDashboardPopup: station is not set");
    }

    const stationId = station.assetId;

    this.currentPageProps = pg;

    console.log(`Page is now:`, pg);

    this.clearContent();

    this.pageDimmer.setAnimatedVisiblity(pg != null);

    //// //// //// //// //// //// //// //// //// //// //// ////

    const detailSubtitleTimeframePrefixes = {
      [ChartsDataTimeframe.$24Hours]: "24 HR",
      [ChartsDataTimeframe.$7Days]: "7 DAY",
      [ChartsDataTimeframe.$30Days]: "30 DAY",
      [ChartsDataTimeframe.$All]: "ALL TIME",
    };

    //// //// //// //// //// //// //// //// //// //// //// ////

    componentFactory.addPageTitle(station.name);

    if (pg === null) {
      componentFactory.addCommodityRateIcons(station);
      this.pageDimmer.setAnimatedVisiblity(false);
      this.sidebarTabs.selectTab(0);
      return;
    }

    const { pageIndex: currentPageIndex, subPageIndex: currentSubpageIndex = 0 } = pg;

    switch (currentPageIndex) {
      case 2: {
        this.pageDimmer.setAnimatedVisiblity(true);

        let onCSVButtonClick: Function | null = null;

        const subpageConfigurations = [
          {
            name: "ALL VISITS",
            fillCurrentSubpage: () => {
              const detailSubtitle = componentFactory.addDetailSubtitle("");

              const chart = new LineChartView(
                timeframe => {
                  dataGetter.getVisitorsVisitsTotal(stationId, timeframe).then(total => {
                    const prefix = detailSubtitleTimeframePrefixes[timeframe];
                    detailSubtitle.text = `${prefix} - TOTAL ${FontIcon.Loco} ${~~total}`;
                  });

                  return dataGetter.getVisitorsAllVisitsTimeline(stationId, timeframe);
                },
                new Color(0x213ba9),
                "Visits"
              );
              this.addChild(chart);

              onCSVButtonClick = () => {
                downloadChartDataAsCSV(station, "visits_timeline", chart.data);
              };
            },
          },
          {
            name: "TOP VISITORS",
            fillCurrentSubpage: () => {
              const chart = new BarChartView(timeframe => {
                return dataGetter.getVisitorsTopVisitors(stationId, timeframe);
              });
              this.addChild(chart);

              onCSVButtonClick = () => {
                downloadChartDataAsCSV(station, "visitors", chart.data);
              };
            },
          },
        ];

        const subpageConfiguration = subpageConfigurations[currentSubpageIndex];
        componentFactory.addPageSubtitle(subpageConfiguration.name);
        subpageConfiguration.fillCurrentSubpage();

        componentFactory.addBottomBarDropdown(
          subpageConfigurations.map(({ name }) => ({
            text: name,
          })),
          valueOfChosenOption => {
            this.setCurrentPage({
              pageIndex: currentPageIndex,
              subPageIndex: valueOfChosenOption,
            });
          },
          currentSubpageIndex
        );

        const csvBtn = componentFactory.addCsvButton(() => onCSVButtonClick?.());
        this.addChild(csvBtn);

        break;
      }
      case 3: {
        this.pageDimmer.setAnimatedVisiblity(true);

        let onCSVButtonClick: Function | null = null;

        const subpageConfigurations = [
          {
            name: "STATION EARNINGS",
            fillCurrentSubpage: () => {
              const detailSubtitle = componentFactory.addDetailSubtitle("");

              const chart = new LineChartView(
                timeframe => {
                  dataGetter.getTociumCommissionsTotal(stationId, timeframe).then(total => {
                    const totalFormatted = formatToMaxDecimals(total, 4);
                    const prefix = detailSubtitleTimeframePrefixes[timeframe];
                    detailSubtitle.text = `${prefix} - TOTAL ${FontIcon.Tocium} ${totalFormatted}`;
                  });

                  return dataGetter.getTociumStationEarningsTimeline(stationId, timeframe);
                },
                new Color(0x36c0a4),
                "Station Earnings"
              );
              this.addChild(chart);

              onCSVButtonClick = () => {
                downloadChartDataAsCSV(station, "earnings_timeline", chart.data);
              };
            },
          },
          {
            name: "TOP VISITORS COMMISSIONS",
            fillCurrentSubpage: () => {
              const chart = new BarChartView(timeframe => {
                return dataGetter.getTociumTopVisitorCommissions(stationId, timeframe);
              });
              this.addChild(chart);

              onCSVButtonClick = () => {
                downloadChartDataAsCSV(station, "visitor_commisions", chart.data);
              };
            },
          },
        ];

        const subpageConfiguration = subpageConfigurations[currentSubpageIndex];
        componentFactory.addPageSubtitle(subpageConfiguration.name);
        subpageConfiguration.fillCurrentSubpage();

        componentFactory.addBottomBarDropdown(
          subpageConfigurations.map(({ name }) => ({
            text: name,
          })),
          valueOfChosenOption => {
            this.setCurrentPage({
              pageIndex: currentPageIndex,
              subPageIndex: valueOfChosenOption,
            });
          },
          currentSubpageIndex
        );

        const csvBtn = componentFactory.addCsvButton(() => onCSVButtonClick?.());
        this.addChild(csvBtn);

        break;
      }
      case 5: {
        const pageContainer = new BillboardDashboardPage(station);
        pageContainer.enchantments.watch(
          () => !!pageContainer.currentHash,
          hasHash => this.pageDimmer.setAnimatedVisiblity(hasHash),
          true
        );
        return this.addChild(pageContainer);
      }
      case 6: {
        const pageContainer = new StakesPage(station);

        const onPageChangeChangeBackground = (subPageType: StakingAddonPageKey) => {
          switch (subPageType) {
            case StakingAddonPageKey.SelectAddon:
              this.setBackgroundOverlay(null);
              break;
            case StakingAddonPageKey.ConductorLounge:
              this.setBackgroundOverlay(`stationDashboardBackgroundConductorLounge`);
              break;
            case StakingAddonPageKey.RailYard:
              this.setBackgroundOverlay(`stationDashboardBackgroundRailYard`);
              break;
          }
        };
        pageContainer.events.on({ stakesPageChange: onPageChangeChangeBackground });

        pageContainer.init();
        return this.addChild(pageContainer);
      }
    }
  }

  // TODO: Refactor with proper destruction
  __currentBackgrounOverlay?: Sprite;
  protected async setBackgroundOverlay(texturePath: string | null) {
    const assets = GameSingletons.getResources();
    const prevBackgroundOverlay = this.__currentBackgrounOverlay as WithHideShowAnimations<Sprite> | undefined;

    if (prevBackgroundOverlay && texturePath) {
      if (prevBackgroundOverlay.texture.textureCacheIds.includes(texturePath)) {
        console.warn(`Trying to set background overlay to "${texturePath}" but it is already set to that texture.`);
        return;
      }
    }

    if (prevBackgroundOverlay) {
      delete this.__currentBackgrounOverlay;
      prevBackgroundOverlay.playHideAnimation().finally(() => prevBackgroundOverlay.destroy());
    }

    if (!texturePath) {
      return;
    }

    console.log(`Setting background overlay to ${texturePath}`, prevBackgroundOverlay?.texture.textureCacheIds);

    const texture = assets.getTexture(texturePath);

    //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP ////
    const SIZE_FIX = [1484, 930, 1484 / 800];
    const [frameWidth, frameHeight, scaleFactor] = SIZE_FIX;
    texture.baseTexture.setResolution(1 / scaleFactor);
    texture.baseTexture.update();
    texture.frame.x = 0.5 * (texture.baseTexture.width - frameWidth);
    texture.frame.y = 0.5 * (texture.baseTexture.height - frameHeight);
    texture.frame.width = frameWidth;
    texture.frame.height = frameHeight;
    texture.noFrame = false;
    texture.updateUvs();
    //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP ////

    const backdrop = injectSimpleFadeAnimations(new Sprite(texture));
    backdrop.scale.set(0.5);
    const regularPadChildIndex = this.children.indexOf(this.pad);
    this.addChildAt(backdrop, regularPadChildIndex + 1);

    this.__currentBackgrounOverlay = backdrop;

    // Add tracks thing
    if (this.station) {
      const textureId = `assets/images/ui-station-dashboard/tracks.png`;
      const texture = assets.getTexture(textureId);
      const sprite = new Sprite(texture);
      sprite.scale.set(1.02);
      sprite.position.set(29, 736);
      backdrop.addChild(sprite);
    }

    // Add frame as well
    if (this.station) {
      const frameTextureId = `assets/images/ui-staking-hub/bg-rim.png`;
      const frameTexture = assets.getTexture(frameTextureId);
      const frame = new Sprite(frameTexture);
      frame.scale.set(1.02);
      frame.position.set(-16, -10);
      backdrop.addChild(frame);

      const stationRarity = this.station.rarityLevel;
      const rarityColor = getRarityColors(stationRarity);
      frame.tint = rarityColor.main.toInt();

      this.updateSizeToPadTexture(frame);
    }

    backdrop.playShowAnimation();

    return backdrop;
  }
}
