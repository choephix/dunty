import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { FontIcon } from "@game/constants/FontIcon";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { EventBus } from "@sdk/core/EventBus";
import { SafeScrollbox } from "@sdk-pixi/display/SafeScrollbox";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";

type VipUsersListRowData = {
  railroader: string;
  spotsUsed: number;
  spotsAllowed: number;
  hourlyCommission: number;
};

export class VipUsersListBox extends SafeScrollbox {
  private readonly assets = GameSingletons.getResources();

  public readonly events = new EventBus<{
    clickDelete: (railroader: string) => void;
  }>();

  constructor() {
    super({
      noTicker: true,
      boxWidth: 985,
      boxHeight: 350,
      stopPropagation: true,
      divWheel: GameSingletons.getGameContext().app.view,
      overflowX: "none",
    });
  }

  addVipRows(rowsData: Array<VipUsersListRowData>, fontSize: number) {
    let startY = 25;
    for (const rowIndex in rowsData) {
      const row = this.createRow(rowsData[rowIndex], fontSize, startY);
      this.content.addChild(row);
      startY += row.height + 20;
    }
    this.content.addChild(this.addInvisibleBox(351));
    this.update();
  }

  createRow(vipData: VipUsersListRowData, fontSize: number, y: number) {
    const container = new Container();
    //// Add railroader name
    const railroaderText = new Text(vipData.railroader, {
      fontFamily: FontFamily.Default,
      fontSize: fontSize,
      fill: 0xffffff,
    });
    railroaderText.anchor.set(0.0, 0.5);
    railroaderText.x = 100;
    container.addChild(railroaderText);
    //// Add vip spots text
    const vipText = new Text(vipData.spotsUsed + "/" + vipData.spotsAllowed, {
      fontFamily: FontFamily.Default,
      fontSize: fontSize,
      fill: 0xffffff,
    });
    vipText.anchor.set(0.5);
    vipText.x = 525;
    container.addChild(vipText);
    //// Add commissionsPerHour text
    const commPerHourText = new Text(`${FontIcon.Tocium}  ` + vipData.hourlyCommission, {
      fontFamily: FontFamily.Default,
      fontSize: fontSize,
      fill: 0xffffff,
    });
    commPerHourText.anchor.set(0.5);
    commPerHourText.x = 825;
    container.addChild(commPerHourText);
    //// Add delete button
    const delButton = new Sprite(
      this.assets.getTexture("ui-station-dashboard/staking/manage-tab/manage-vips/btn-clear.png")
    );
    delButton.scale.set(0.5);
    delButton.anchor.set(0.5);
    delButton.x = 925;
    buttonizeDisplayObject(delButton, () => this.events.dispatch("clickDelete", vipData.railroader));
    container.addChild(delButton);
    /// Row Underline
    const graphics = new Graphics()
      .lineStyle(3, 0xffffff, 0.6)
      .moveTo(100 - 10, railroaderText.y + railroaderText.height / 2 + 10)
      .lineTo(delButton.x + delButton.width / 2 + 10, railroaderText.y + railroaderText.height / 2 + 10);

    container.addChild(graphics);
    container.position.set(0, y);
    return container;
  }

  addInvisibleBox(px: number) {
    const box = new Sprite(Texture.EMPTY);
    box.width = this.boxWidth + 1;
    box.height = px;
    return box;
  }

  clear() {
    const children = [...this.content.children];
    for (const child of children) {
      child.destroy({ children: true });
    }
    this.content.addChild(this.addInvisibleBox(426));
  }
}
