import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { TextInput } from "@game/asorted/TextInput";
import { FontIcon } from "@game/constants/FontIcon";
import { getRarityColors } from "@game/constants/RarityColors";
import { Container } from "@pixi/display";
import { Text } from "@pixi/text";
import { formatToMaxDecimals } from "@sdk-ui/utils/formatToMaxDecimals";

export class SellInfoPanel extends Container {
  private readonly context: GameContext = GameSingletons.getGameContext();

  lowestListPriceValue: Text = this.context.simpleFactory.createText(
    `${FontIcon.Tocium}` + " 0",
    { fontSize: 28 },
    { x: 375, y: 200 }
  );

  myPriceValue: TextInput;

  constructor() {
    super();

    this.myPriceValue = new TextInput({
      input: {
        fontSize: "28px",
        fontWeight: "bold",
        align: "center",
        color: "#ffffff",
        width: `200px`,
      },
    });
    this.myPriceValue.placeholder = "Set price...";
  }

  addBackground(rarity: string) {
    //// Add background
    const bg = this.context.simpleFactory.createSprite("ui-market-window-emporium/sell/sell-screen/sell-info-bg.png");
    this.addChild(bg);
    this.setChildIndex(bg, 0);
    const bgOutline = this.context.simpleFactory.createSprite(
      "ui-market-window-emporium/sell/sell-screen/sell-info-outline.png"
    );
    bgOutline.tint = getRarityColors(rarity).main.toInt();
    this.addChild(bgOutline);
    this.setChildIndex(bgOutline, 1);
    //// Add text

    const text = this.context.simpleFactory.createText(
      "YOUR LISTING",
      { fontSize: 48, dropShadow: true },
      { x: 75, y: 75 }
    );
    this.addChild(text);
    //// Add lowest list price
    const lowest = this.context.simpleFactory.createText("LOWEST LIST PRICE:", { fontSize: 28 }, { x: 75, y: 200 });
    this.addChild(lowest);
    //// Add sell bottom background
    const bottom = this.context.simpleFactory.createSprite(
      "ui-market-window-emporium/sell/sell-screen/sell-info-bottom.png",
      { x: 10, y: 418 }
    );
    this.addChild(bottom);
    //// My price text
    const myPrice = this.context.simpleFactory.createText(
      "MY PRICE " + `${FontIcon.Tocium}`,
      { fontSize: 36 },
      { x: 75, y: 475 }
    );
    this.addChild(myPrice);
    this.myPriceValue.position.set(600, 480);
    this.addChild(this.myPriceValue);
  }

  addVials() {
    //// Add vials to background
    const vials = this.context.simpleFactory.createSprite(
      "ui-market-window-emporium/sell/sell-screen/century-vials-sell-info.png",
      { x: 510, y: 140 }
    );
    this.addChild(vials);
  }

  setLowestListPrice(value: number) {
    this.addChild(this.lowestListPriceValue);
    this.lowestListPriceValue.text = `${FontIcon.Tocium} ${formatToMaxDecimals(value, 4, true)}`;
    this.lowestListPriceValue.visible = !!value;
  }
}
