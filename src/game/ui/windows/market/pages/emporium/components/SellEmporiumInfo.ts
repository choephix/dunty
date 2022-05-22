import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { getRarityColors } from "@game/constants/RarityColors";
import { Container } from "@pixi/display";
import { Text } from "@pixi/text";
import { BitmapText, IBitmapTextStyle } from "@pixi/text-bitmap";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";

const titleLabelStyle = {
  fontName: "Celestial Typeface",
  align: "center",
  fontSize: 36,
} as IBitmapTextStyle;

export class SellEmporiumInfo extends Container {
  private readonly context: GameContext = GameSingletons.getGameContext();
  ampBalance: Text = this.context.simpleFactory.createText("0", { fontSize: 40 }, { x: 263, y: 400 });
  onListing: (value: string) => void = (value: string) => {};
  constructor() {
    super();

    //// Add background
    const bg = this.context.simpleFactory.createSprite(
      "ui-market-window-emporium/sell/sell-screen/emporium-info-bg.png",
      { x: 15, y: 50 }
    );
    bg.height -= 50;
    this.addChild(bg);
    const overground = this.context.simpleFactory.createSprite(
      "ui-market-window-emporium/sell/sell-screen/overhang.png"
    );
    this.addChild(overground);
    //// Add title
    const title = new BitmapText("The Railroader Emporium", titleLabelStyle);
    title.position.set(50, 100);
    this.addChild(title);
    //// Add text
    const text = this.context.simpleFactory.createText(
      "Not sure what to list your item for?\n Don't sweat it! You can always\nreturn later and adjust the price.",
      { fontSize: 18, lineHeight: 20 },
      { x: 75, y: 175 }
    );
    this.addChild(text);
    //// Add amp balance panel
    const ampBg = this.context.simpleFactory.createSprite(
      "ui-market-window-emporium/sell/sell-screen/balance-bg-sm.png",
      { x: 15, y: 300 }
    );
    this.addChild(ampBg);
  }

  addAmpBalanceText() {
    const ampIcon = this.context.simpleFactory.createSprite("century-vials/amp-m.png", { x: 25, y: 325 });
    ampIcon.scale.set(0.5);
    this.addChild(ampIcon);
    const ampBalanceText = this.context.simpleFactory.createText(
      "MY AMP BALANCE",
      { fontSize: 20 },
      { x: 175, y: 350 }
    );
    this.addChild(ampBalanceText);
    this.ampBalance.anchor.set(0.5);
    this.addChild(this.ampBalance);
  }

  addListingButton(rarity: string, value: string, listingText: string) {
    const button = this.context.simpleFactory.createSprite(
      "ui-market-window-emporium/sell/sell-screen/btn-sell-lg.png",
      {
        x: 14,
        y: 465,
      }
    );
    button.tint = getRarityColors(rarity).main.toInt();
    buttonizeDisplayObject(button, () => this.onListing(value));
    this.addChild(button);
    //// Add label
    const text = this.context.simpleFactory.createText(listingText, { fontSize: 36 }, { x: 204, y: 53 });
    text.anchor.set(0.5);
    button.addChild(text);
  }

  setAmpBalance(value: string) {
    this.ampBalance.text = value;
  }
}
