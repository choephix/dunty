import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";

const headersX = [410, 655, 910, 1150, 1325, 1480, 1680, 1870, 2090];

export class RailRunsWindowComponentFactory {
  private readonly assets = GameSingletons.getResources();

  createTrainsHeaderRow(x: number = 400, y: number = 260) {
    const headers = ["NAME", "REGION", "STATUS", "ACTION"];
    const container = new Container();

    let startX = x;
    for (const header in headers) {
      const textHeader = new Text(headers[header], {
        fill: 0xffffff,
        fontFamily: FontFamily.Default,
        fontSize: 36,
      });
      textHeader.x = startX;
      //check to increase last tab distance
      if (parseInt(header) == headers.length - 2) {
        startX += 600;
      } else {
        startX += 400;
      }

      container.addChild(textHeader);
    }
    container.y = y;
    return container;
  }

  addClaimBtn() {
    const sprite = new Sprite(this.assets.getTexture("ui-railruns-window/btn-claim.png"));
    return sprite;
  }

  addClearBtn() {
    const sprite = new Sprite(this.assets.getTexture("ui-railruns-window/btn-clear.png"));
    return sprite;
  }

  addTitle(title: string) {
    const container = new Container();

    const titleText = new Text(title, {
      fontFamily: FontFamily.Default,
      fill: 0xffffff,
      fontSize: 56,
    });
    container.addChild(titleText);
    return container;
  }

  createHistoryHeaderRow(y: number = 290) {
    const headers = [
      "Name",
      "Departure Time",
      "Arrival Time",
      "Duration",
      "Distance",
      "Fuel Amount",
      "Run Earnings",
      "Passenger Tips",
      "Total Earnings",
    ];

    const container = new Container();

    for (const header in headers) {
      const textHeader = new Text(headers[header], {
        fill: 0xffffff,
        fontFamily: FontFamily.Default,
        fontSize: 26,
      });
      textHeader.anchor.set(0.5);
      textHeader.x = headersX[header];

      container.addChild(textHeader);
    }
    container.y = y;
    return container;
  }
}
