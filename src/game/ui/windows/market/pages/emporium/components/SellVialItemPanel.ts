import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { getRarityColors } from "@game/constants/RarityColors";
import { Container } from "@pixi/display";
import { ColorMatrixFilter } from "@pixi/filter-color-matrix";
import { fitObjectInRectangle } from "@sdk-pixi/layout/fitObjectInRectangle";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";

export class SellVialItemPanel extends Container {
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
      { x: 25, y: 25 }
    );
    vialBg.height = 332.5;
    this.addChild(vialBg);
  }

  addAmpPlaque(value: string, rarity: string) {
    //// Add plaque
    const plaque = this.context.simpleFactory.createSprite("ui-market-window-emporium/sell/amp-count-bg.png", {
      x: 222.5,
      y: 400,
    });
    plaque.anchor.set(0.5);
    plaque.tint = getRarityColors(rarity).main.toInt();
    this.addChild(plaque);
    //// Add price
    const price = this.context.simpleFactory.createText(value.toUpperCase());
    price.anchor.set(0.5);
    plaque.addChild(price);
    plaque.scale.set(1.28);
  }

  setVialThumbnail(level: number) {
    //// Add vial
    const container = new Container();
    const textureId = "century-vials/" + level + ".png";
    const sprite = this.context.simpleFactory.createSprite(textureId);
    container.addChild(sprite);
    this.addChild(container);
    fitObjectInRectangle(sprite, {
      x: 90,
      y: 45,
      width: 300,
      height: 300,
    });
  }

  addSellPlaque(rarity: string, onClick: () => void) {
    //// Add button
    const button = this.context.simpleFactory.createSprite(
      "ui-market-window-emporium/sell/sell-screen/btn-sell-lg.png",
      {
        x: 225,
        y: 490,
      }
    );
    button.anchor.set(0.5);
    button.tint = getRarityColors(rarity).main.toInt();
    buttonizeDisplayObject(button, onClick);
    this.addChild(button);
    //// button text
    const buttonText = this.context.simpleFactory.createText(
      "SELL",
      { fontSize: 46 },
      {
        x: 0,
        y: 0,
      }
    );
    buttonText.anchor.set(0.5);
    button.addChild(buttonText);
    button.scale.set(0.95);
  }

  grayOut() {
    const filter = new ColorMatrixFilter();
    filter.desaturate();
    for (let i = 0; i < 15; i++) filter.matrix[i] *= 0.5;
    this.filters = [filter];
  }
}
