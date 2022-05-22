import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { ChartsDataTimeframe } from "@game/ui/popups/data/StationDashboardChartsDataAdapter";
import { ChartPaginationArrowButtons } from "@game/ui/popups/station-dashboard-components/charts/ChartPaginationArrowButtons";
import { BarChartDataItem, drawBarChart } from "@game/ui/svg-charts/drawBarChartSVG";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { makeTextureFromSVGElement } from "@sdk/pixi/utils/makeTextureFromSVGElement";
import { ChartTimeFrameButtons } from "./ChartTimeFrameButtons";

export class BarChartView extends Container {
  private readonly context = GameSingletons.getGameContext();
  private readonly tweeener = new TemporaryTweeener(this);

  private readonly panelBackground: Sprite;
  private readonly timeframeButtons: Container;
  private readonly paginationButtons: ChartPaginationArrowButtons;
  private chartSprite: Sprite | null = null;

  public data: BarChartDataItem[] = [];
  public currentTimeframe: ChartsDataTimeframe = ChartsDataTimeframe.$24Hours;

  private pageSize: number = 10;

  constructor(
    private readonly getDataForTimeframe: (
      timeframe: ChartsDataTimeframe
    ) => BarChartDataItem[] | Promise<BarChartDataItem[]>
  ) {
    super();

    const { assets } = this.context;

    const panelBackgroundTextureId = "ui-station-dashboard/chart-elements/chart-bg-trans.png";
    const panelBackgroundTexture = assets.getTexture(panelBackgroundTextureId);
    this.panelBackground = new Sprite(panelBackgroundTexture);
    this.panelBackground.scale.set(0.5);
    this.addChild(this.panelBackground);

    this.paginationButtons = new ChartPaginationArrowButtons();
    this.paginationButtons.scale.set(0.5);
    this.paginationButtons.position.set(59, 113);
    this.addChild(this.paginationButtons);

    this.timeframeButtons = new ChartTimeFrameButtons(timeframe => {
      this.currentTimeframe = timeframe;
      this.updateCurrentChart();
    });
    this.timeframeButtons.scale.set(0.5);
    this.timeframeButtons.position.set(82, 145);
    this.addChild(this.timeframeButtons);

    this.paginationButtons.events.on({
      pageChange: page => {
        this.updateCurrentChart(page);
      },
    });
  }

  async updateCurrentChart(page: number = 0) {
    //// Destroy old chart, if any
    if (this.chartSprite) {
      this.animateChartOut(this.chartSprite);
      this.chartSprite = null;
    }

    this.data = await this.getDataForTimeframe(this.currentTimeframe);
    this.data.sort((a, b) => b.x - a.x);
    const width = 480;
    const height = 200;

    //// Temporary hack
    if (this.chartSprite) return;

    var xMax = this.data[0].x;

    this.paginationButtons.updatePaginationSettings(Math.ceil(this.data.length / this.pageSize), page);

    const pageStartItemIndex = page * this.pageSize;
    const paginatedData = this.data.slice(pageStartItemIndex, pageStartItemIndex + this.pageSize);

    const svg = drawBarChart(paginatedData, width, height, xMax, this.pageSize);
    const texture = makeTextureFromSVGElement(svg);
    this.chartSprite = new Sprite(texture);

    this.chartSprite.position.set(120, 135);
    this.addChild(this.chartSprite);
    this.animateChartIn(this.chartSprite);

    //// Make sure the buttons are always on top
    this.addChild(this.timeframeButtons);
  }

  animateChartOut(chart: Sprite) {
    return this.tweeener.to(chart, {
      duration: 0.25,
      alpha: 0,
      onComplete: () => chart.destroy(),
    });
  }

  animateChartIn(chart: Sprite) {
    return this.tweeener.from(chart, {
      duration: 0.25,
      delay: 0.075,
      alpha: 0,
    });
  }
}
