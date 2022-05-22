import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { nextFrame } from "@sdk/utils/promises";
import { SafeScrollbox } from "@sdk-pixi/display/SafeScrollbox";
import { DataTimeframe, LeaderboardsDataService } from "./LeaderboardsDataService";
import { formatToMaxDecimals } from "@sdk-ui/utils/formatToMaxDecimals";

const commonLabelStyle = {
  fill: "#FFFFFF",
  fontFamily: FontFamily.DefaultThin,
};

const rowXCoordinates = [55, 210, 525];

export class LeaderboardList extends SafeScrollbox {
  // dataService: MockDataService = new MockDataService();
  protected readonly context: GameContext = GameSingletons.getGameContext();
  dataService: LeaderboardsDataService = new LeaderboardsDataService();

  constructor() {
    super({
      noTicker: true,
      boxWidth: 555,
      boxHeight: 425,
      stopPropagation: true,
      divWheel: GameSingletons.getGameContext().app.view,
      overflowX: "none",
    });
  }

  async fillStationsByTociumEarnings(timeframe: DataTimeframe, limit: number) {
    this.clearData();
    const data = await this.dataService.getStationsByTociumEarnings(timeframe, limit);
    await this.addRowsTocium(data, 16);
  }

  async fillStationsByTotalRailruns(timeframe: DataTimeframe, limit: number) {
    this.clearData();
    const data = await this.dataService.getStationsByTotalRailruns(timeframe, limit);
    await this.addRowsRuns(data, 16);
  }

  async fillRailRoadersByTociumEarnings(timeframe: DataTimeframe, limit: number) {
    this.clearData();
    const data = await this.dataService.getRailRoadersByTociumEarnings(timeframe, limit);
    await this.addRowsTocium(data, 16);
  }

  async fillRailRoadersByTotalRailruns(timeframe: DataTimeframe, limit: number) {
    this.clearData();
    const data = await this.dataService.getRailRoadersByTotalRailruns(timeframe, limit);
    await this.addRowsRuns(data, 16);
  }

  async addRowsTocium(
    rowData: Array<{ placement: string | number; name: string; tocium: number; socialLink?: string }>,
    fontSize: number
  ) {
    let startY = 10;
    for (let row in rowData) {
      const { placement, name, tocium, socialLink } = rowData[row];

      /// Row Container
      const rowContainer = new Container();

      /// Placement Spot Text
      const placementLabel = new Text("" + placement, {
        ...commonLabelStyle,
        fontSize: fontSize,
      });
      placementLabel.position.set(rowXCoordinates[0], startY);
      placementLabel.anchor.set(1, 0);
      rowContainer.addChild(placementLabel);

      /// Name Text
      const accountLabel = new Text(name, {
        ...commonLabelStyle,
        fontSize: fontSize,
      });
      accountLabel.position.set(rowXCoordinates[1], startY);
      accountLabel.anchor.set(1, 0);
      rowContainer.addChild(accountLabel);

      if (socialLink) {
        this.context.main.social.registerForQuickViewOnClick(accountLabel, socialLink);
      }

      /// Tocium Amount Text
      const tociumLabel = new Text(formatToMaxDecimals(tocium, 0, true), {
        ...commonLabelStyle,
        fontSize: fontSize,
      });
      tociumLabel.position.set(rowXCoordinates[2], startY);
      tociumLabel.anchor.set(1, 0);
      rowContainer.addChild(tociumLabel);

      /// Row Underline
      const graphics = new Graphics()
        .lineStyle(1.25, 0xffffff)
        .moveTo(placementLabel.x - 20, startY + 30)
        .lineTo(rowXCoordinates[2] + 10, startY + 30);

      rowContainer.addChild(graphics);

      this.content.addChild(rowContainer);
      startY += accountLabel.height + 20;

      await nextFrame();
      this.update();
    }

    this.content.addChild(this.addInvisibleBox(426));
    this.update();
  }

  async addRowsRuns(
    rowData: Array<{ placement: string | number; name: string; runs: number; socialLink?: string }>,
    fontSize: number,
  ) {
    let startY = 10;
    for (let row in rowData) {
      const { placement, name, runs, socialLink } = rowData[row];

      /// Row Container
      const rowContainer = new Container();

      /// Placement Spot Text
      const placementLabel = new Text("" + placement, {
        ...commonLabelStyle,
        fontSize: fontSize,
      });
      placementLabel.position.set(rowXCoordinates[0], startY);
      placementLabel.anchor.set(1, 0);
      rowContainer.addChild(placementLabel);

      /// Name Text
      const accountLabel = new Text(name, {
        ...commonLabelStyle,
        fontSize: fontSize,
      });
      accountLabel.position.set(rowXCoordinates[1], startY);
      accountLabel.anchor.set(1, 0);
      rowContainer.addChild(accountLabel);

      if (socialLink) {
        this.context.main.social.registerForQuickViewOnClick(accountLabel, socialLink);
      }

      /// Tocium Amount Text
      const tociumLabel = new Text("" + Math.round(runs), {
        ...commonLabelStyle,
        fontSize: fontSize,
      });
      tociumLabel.position.set(rowXCoordinates[2], startY);
      tociumLabel.anchor.set(1, 0);
      rowContainer.addChild(tociumLabel);

      /// Row Underline
      const graphics = new Graphics()
        .lineStyle(1.25, 0xffffff)
        .moveTo(placementLabel.x - 20, startY + 30)
        .lineTo(rowXCoordinates[2] + 10, startY + 30);

      rowContainer.addChild(graphics);

      this.content.addChild(rowContainer);
      startY += accountLabel.height + 20;

      await nextFrame();
      this.update();
    }
    this.content.addChild(this.addInvisibleBox(426));
    this.update();
  }

  addInvisibleBox(px: number) {
    const box = new Sprite(Texture.EMPTY);
    box.width = this.boxWidth + 1;
    box.height = px;
    return box;
  }

  clearData() {
    const children = [...this.content.children];
    for (const child of children) {
      /**
       * The only exception is the invisible box, which we
       * don't want to destroy.
       */
      child.destroy({ children: true });
    }
  }
}
