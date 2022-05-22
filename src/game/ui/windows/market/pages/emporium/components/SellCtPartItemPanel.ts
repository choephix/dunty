import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { getRarityColors } from "@game/constants/RarityColors";
import { Container } from "@pixi/display";
import { fitObjectInRectangle } from "@sdk-pixi/layout/fitObjectInRectangle";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";

export class SellCtPartItemPanel extends Container {
  private readonly context: GameContext = GameSingletons.getGameContext();

  addBackground(rarity: string, countValue?: number) {
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
    //// Add part background
    const partBg = this.context.simpleFactory.createSprite(
      "ui-market-window-emporium/sell/sell-screen/item-holder-lg.png",
      { x: 24, y: 25 }
    );
    partBg.height = 332.5;
    this.addChild(partBg);
    //// add count
    const count = this.context.simpleFactory.createSprite("ui-market-window-emporium/sell/part-qty_badge.png", {
      x: 29,
      y: 28,
    });
    this.addChild(count);

    if (countValue && countValue > 0) {
      const countText = this.context.simpleFactory.createText(
        "x" + countValue,
        {
          fontFamily: FontFamily.DanielBlack,
          fontSize: 20,
        },
        { x: 24, y: 28 }
      );
      countText.anchor.set(0.5);
      count.addChild(countText);
    }
  }

  addNamePlaque(label: string, rarity: string) {
    //// Add plaque
    const plaque = this.context.simpleFactory.createSprite("ui-market-window-emporium/sell/amp-count-bg.png", {
      x: 222.5,
      y: 400,
    });
    plaque.anchor.set(0.5);
    plaque.tint = getRarityColors(rarity).main.toInt();
    this.addChild(plaque);
    //// Add price
    const name = this.context.simpleFactory.createText(label.toUpperCase(), { fontSize: 22 }, { y: 8 });
    name.anchor.set(0.5);
    plaque.addChild(name);
    plaque.scale.set(1.28);
  }

  setPartThumbnail(part: string) {
    //// Add part
    const container = new Container();
    const sprite = this.context.simpleFactory.createSprite(part);
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
}
