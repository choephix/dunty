import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { ChartsDataTimeframe } from "@game/ui/popups/data/StationDashboardChartsDataAdapter";
import { drawLineChart, LineChartItem } from "@game/ui/svg-charts/drawLineChartSVG";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { makeTextureFromSVGElement } from "@sdk/pixi/utils/makeTextureFromSVGElement";
import { Color } from "@sdk/utils/color/Color";
import { ChartTimeFrameButtons } from "./ChartTimeFrameButtons";

export class LineChartView extends Container {
  private readonly context = GameSingletons.getGameContext();
  private readonly tweeener = new TemporaryTweeener(this);

  private readonly panelBackground: Sprite;
  private readonly timeframeButtons: Container;
  private chartSprite: Sprite | null = null;

  public data: LineChartItem[] = [];
  public currentTimeframe: ChartsDataTimeframe = ChartsDataTimeframe.$24Hours;

  constructor(
    private readonly getDataForTimeframe: (
      timeframe: ChartsDataTimeframe
    ) => LineChartItem[] | Promise<LineChartItem[]>,
    private readonly lineColor: Color,
    private readonly legendText?: string
  ) {
    super();

    const { assets } = this.context;

    const panelBackgroundTextureId = "ui-station-dashboard/chart-elements/chart-bg-trans.png";
    const panelBackgroundTexture = assets.getTexture(panelBackgroundTextureId);
    this.panelBackground = new Sprite(panelBackgroundTexture);
    this.panelBackground.scale.set(0.5);
    this.addChild(this.panelBackground);

    this.timeframeButtons = new ChartTimeFrameButtons(timeframe => {
      this.updateCurrentChart(timeframe);
    });
    this.timeframeButtons.scale.set(0.5);
    this.timeframeButtons.position.set(82, 145);
    this.addChild(this.timeframeButtons);

    if (legendText) {
      const x = 85,
        y = 317;
      const legend = new Container();
      const graphics = new Graphics();
      graphics.beginFill(lineColor.toInt());
      graphics.drawRect(x, y - 2.5, 15, 5);

      const legendLabel = new Text(legendText.toUpperCase(), {
        fontSize: 24,
        fill: "#FFFFFF",
        stroke: "#080808",
        strokeThickness: 3,
        fontFamily: FontFamily.Default,
        wordWrap: true,
      });
      legendLabel.scale.set(0.35);
      legendLabel.position.set(x + 20, y);
      legendLabel.anchor.y = 0.5;
      legend.addChild(graphics);
      legend.addChild(legendLabel);
      this.addChild(legend);
    }

    // this.updateCurrentChart(ChartsDataTimeframe.$24Hours);
  }

  async updateCurrentChart(timeframe: ChartsDataTimeframe) {
    //// Destroy old chart, if any
    if (this.chartSprite) {
      this.animateChartOut(this.chartSprite);
      this.chartSprite = null;
    }

    this.data = await this.getDataForTimeframe(timeframe);
    const width = 510;
    const height = 200;

    if (this.chartSprite) return;

    const svg = drawLineChart(this.data, width, height, this.lineColor.toHex());
    const texture = makeTextureFromSVGElement(svg);
    this.chartSprite = new Sprite(texture);

    this.chartSprite.position.set(90, 130);
    this.addChild(this.chartSprite);
    this.animateChartIn(this.chartSprite);

    //// Make sure the buttons are always on top
    this.addChild(this.timeframeButtons);
  }

  animateChartOut(chart: Sprite) {
    return this.tweeener.to(chart, {
      duration: 0.25,
      alpha: 0,
      // y: chart.y + 15,
      onComplete: () => chart.destroy(),
    });
  }

  animateChartIn(chart: Sprite) {
    return this.tweeener.from(chart, {
      duration: 0.25,
      delay: 0.075,
      alpha: 0,
      // y: chart.y - 5,
    });
  }
}
