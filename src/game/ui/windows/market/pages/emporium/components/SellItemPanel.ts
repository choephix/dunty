import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { SpriteWithText } from "@game/asorted/SpriteWithText";
import { getRarityColors } from "@game/constants/RarityColors";
import { Container } from "@pixi/display";
import { fitObjectInRectangle } from "@sdk-pixi/layout/fitObjectInRectangle";

export class SellItemPanel extends Container {
  private readonly context: GameContext = GameSingletons.getGameContext();

  addBackground(rarity: string) {
    //// Add background
    const bg = this.context.simpleFactory.createSprite("ui-market-window-emporium/buy/item-assets/base.png");
    bg.scale.set(1.28);
    this.addChild(bg);
    this.setChildIndex(bg, 0);
    const bgOutline = this.context.simpleFactory.createSprite(
      "ui-market-window-emporium/buy/item-assets/item-outline.png"
    );
    bgOutline.tint = getRarityColors(rarity).main.toInt();
    bgOutline.scale.set(1.27);
    this.addChild(bgOutline);
    this.setChildIndex(bgOutline, 1);
    //// Add vial background
    const vialBg = this.context.simpleFactory.createSprite(
      "ui-market-window-emporium/sell/sell-screen/item-holder-lg.png",
      { x: 25, y: 40 }
    );
    this.addChild(vialBg);
  }

  addPlaque(value: string, rarity: string) {
    const textureId = "ui-market-window-emporium/sell/amp-count-bg.png";
    const plaque = new SpriteWithText(textureId, value.toUpperCase(), { fontSize: 24 });
    plaque.tint = getRarityColors(rarity).main.toInt();
    plaque.position.copyFrom({ x: 222, y: 505 });
    plaque.anchor.set(0.5);
    plaque.tint = getRarityColors(rarity).main.toInt();
    plaque.scale.set(1.28);
    this.addChild(plaque);
  }

  setThumbnail(id: string) {
    //// Add vial
    const container = new Container();
    const sprite = this.context.simpleFactory.createSprite(id);
    container.addChild(sprite);
    this.addChild(container);
    fitObjectInRectangle(sprite, {
      x: 90,
      y: 100,
      width: 300,
      height: 300,
      alignment: { x: 0.5, y: 0.5 },
    });
  }
}
