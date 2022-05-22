import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { modifyPivotWithoutChangingPosition } from "@game/asorted/centerPivotWithoutChangingPosition";
import { FontFamily } from "@game/constants/FontFamily";
import { getRarityColors } from "@game/constants/RarityColors";
import { ThemeColors } from "@game/constants/ThemeColors";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { fitObjectInRectangle } from "@sdk-pixi/layout/fitObjectInRectangle";

export class ListingPlateContent extends Container {
  private readonly assets = GameSingletons.getResources();
  private readonly simpleFactory = GameSingletons.getSimpleObjectFactory();

  constructor() {
    super();

    //// Add background
    const bg = this.simpleFactory.createSprite("ui-market-window-emporium/sell/sell-screen/item-holder-lg.png");
    bg.width = bg.width * 1.5;
    bg.height = bg.height * 1.1;
    this.addChild(bg);
  }

  setPartThumbnail(imgUrl: string, rarity: string, partName: string) {
    const container = new Container();
    this.addBackGround(rarity, container);
    this.addPartPicture(imgUrl, container);
    this.addNameLabel(partName, container);
    this.addChild(container);
    container.position.set(148.5, 65);
  }

  setVialThumbnail(level: number) {
    const container = new Container();
    const textureId = "century-vials/" + level + ".png";
    const sprite = this.simpleFactory.createSprite(textureId);
    container.addChild(sprite);
    this.addChild(container);

    const rect = { x: 70, y: 30, width: 470, height: 410, alignment: { x: 0.5, y: 0.5 } };
    fitObjectInRectangle(sprite, rect);
  }

  setInfo(info: Record<string, string>) {
    const startX = 300;
    let startY = 75;
    const infoContainer = new Container();
    for (const line in info) {
      const propName = this.simpleFactory.createText(
        line.toUpperCase() + ":",
        { fill: ThemeColors.HIGHLIGHT_COLOR.toInt(), fontSize: 36 },
        { x: startX, y: startY }
      );
      propName.anchor.set(0.5);
      infoContainer.addChild(propName);
      const propInfo = this.simpleFactory.createText(
        info[line].toUpperCase(),
        { fontSize: 36 },
        { x: startX, y: startY + 50 }
      );
      infoContainer.addChild(propInfo);
      propInfo.anchor.set(0.5);
      //// Increment y position
      startY += 110;
    }
    this.addChild(infoContainer);

    if (info.railroader) {
      GameSingletons.getMainInstance().social.registerForQuickViewOnClick(infoContainer, info.railroader);
    }
  }

  clearLastChild() {
    const childRemoved = this.removeChildAt(this.children.length - 1);
    childRemoved.destroy({ children: true });
  }

  showLastChild(render: boolean) {
    const child = this.getChildAt(this.children.length - 1);
    child.renderable = render;
  }

  private addBackGround(rarity: string, container: Container) {
    const fillTextureId = "ui-market-window-ct-parts/part-thumbnail/pad.png";
    const fill = this.simpleFactory.createSprite(fillTextureId);
    fill.tint = getRarityColors(rarity).main.toInt();
    container.addChild(fill);

    const borderTextureId = "ui-market-window-ct-parts/part-thumbnail/frame-stroked.png";
    const stroke = this.simpleFactory.createSprite(borderTextureId);
    fill.addChild(stroke);

    modifyPivotWithoutChangingPosition(fill);
  }

  private addPartPicture(imgUrl: string, container: Container) {
    const partImg = new Sprite(this.assets.getTexture(imgUrl));
    partImg.scale.set(0.8);
    partImg.position.set(41, 27);
    modifyPivotWithoutChangingPosition(partImg);
    container.addChild(partImg);
  }

  private addNameLabel(text: string, container: Container) {
    const name = new Text(text.toUpperCase(), {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 20,
    });
    name.anchor.set(0.5);
    name.position.set(142, 254);
    container.addChild(name);
  }
}
