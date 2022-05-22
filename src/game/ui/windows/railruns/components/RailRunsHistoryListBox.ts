import { GameContext } from "@game/app/app";
import { FontFamily } from "@game/constants/FontFamily";
import { Texture } from "@pixi/core";
import { Container, IDestroyOptions } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { SafeScrollbox } from "@sdk-pixi/display/SafeScrollbox";
import { RailRunsHistoryListRowData } from "../pages/RailRunsHistoryPage";
import { RailRunsWindowComponentFactory } from "./RailRunsWindowComponentFactory";

const headersX = [410, 655, 910, 1150, 1325, 1480, 1680, 1870, 2090];

export class RailRunsHistoryListBox extends SafeScrollbox {
  constructor(
    private readonly context: GameContext,
    historyData: Array<RailRunsHistoryListRowData>,
    private readonly componentFactory: RailRunsWindowComponentFactory,
    private startY: number
  ) {
    super({
      noTicker: true,
      boxWidth: 2250,
      boxHeight: 700,
      overflowX: "none",
      stopPropagation: true,
      divWheel: context.app.view,
    });
    this.x = 0;
    this.y = 350;
    this.content.addChild(this.addInvisibleBox(701));
    this.update();

    this.fill(historyData);
  }

  async fill(historyData: RailRunsHistoryListRowData[]) {
    for (const row of historyData) {
      const tbRow = this.createHistoryTableRow(
        this.startY,
        row.name,
        row.departureTime,
        row.arrivalTime,
        row.duration,
        row.distance,
        row.fuelAmount,
        row.runEarnings,
        row.passengerTips,
        row.totalEarnings
      );
      this.content.addChild(tbRow);
      this.startY += 50;

      this.update();

      await this.context.ticker.nextFrame();
    }
  }

  createHistoryTableRow(
    y: number,
    name: string,
    deptTime: string,
    arrTime: string,
    duration: string,
    distance: string,
    fuel: string,
    runEarn: string,
    tips: string,
    totEarn: string
  ) {
    const container = new Container();
    //train icon
    const icon = new Sprite(this.context.assets.getTexture("ui-railruns-window/loco-icon.png"));
    icon.x = 225;
    icon.y -= 15;
    icon.scale.set(0.25);
    container.addChild(icon);

    //train name
    const nameText = new Text(name, {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 20,
    });
    nameText.x = headersX[0];
    nameText.anchor.set(0.5);
    container.addChild(nameText);

    //train departure time
    const deptTimeText = new Text(deptTime, {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 20,
    });
    deptTimeText.x = headersX[1];
    deptTimeText.anchor.set(0.5);
    container.addChild(deptTimeText);

    //train arrival time
    const arrTimeText = new Text(arrTime, {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 20,
    });
    arrTimeText.x = headersX[2];
    arrTimeText.anchor.set(0.5);
    container.addChild(arrTimeText);

    //train duration
    const durationText = new Text(duration, {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 20,
    });
    durationText.x = headersX[3];
    durationText.anchor.set(0.5);
    container.addChild(durationText);

    //train distance
    const distanceText = new Text(distance, {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 20,
    });
    distanceText.x = headersX[4];
    distanceText.anchor.set(0.5);
    container.addChild(distanceText);

    //train fuel
    const fuelText = new Text(fuel, {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 20,
    });
    fuelText.x = headersX[5];
    fuelText.anchor.set(0.5);
    container.addChild(fuelText);

    //train run earnings
    const runEarnText = new Text(runEarn, {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 20,
    });
    runEarnText.x = headersX[6];
    runEarnText.anchor.set(0.5);
    container.addChild(runEarnText);

    //train passenger tips
    const tipsText = new Text(tips, {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 20,
    });
    tipsText.x = headersX[7];
    tipsText.anchor.set(0.5);
    container.addChild(tipsText);

    //train total earnings
    const totEarnText = new Text(totEarn, {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 20,
    });
    totEarnText.x = headersX[8];
    totEarnText.anchor.set(0.5);
    container.addChild(totEarnText);
    container.y = y;
    return container;
  }

  addInvisibleBox(px: number) {
    const box = new Sprite(Texture.EMPTY);
    box.width = this.boxWidth + 1;
    box.height = px;
    return box;
  }

  destroy(options?: boolean | IDestroyOptions): void {
    console.log(` - - -- - - Destroying RailRunsHistoryListBox`);
    super.destroy(options);
  }
}
