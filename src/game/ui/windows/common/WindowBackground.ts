import { GameSingletons } from "@game/app/GameSingletons";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { Rectangle } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import { TilingSprite } from "@pixi/sprite-tiling";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { Color } from "@sdk/utils/color/Color";

const frameSize = { width: 2416, height: 1271 };
const gritBounds = new Rectangle(67, 207, 2254, 991);

export class WindowBackground extends EnchantedContainer {
  public readonly grunge: TilingSprite;
  public readonly frame: Sprite;

  private readonly tweeener = new TemporaryTweeener(this);

  constructor(tint: number = WindowBackgroundColor.MarketGreen) {
    super();

    const assets = GameSingletons.getResources();

    const gritTexture = assets.getTexture("windowGrunge");
    this.grunge = new TilingSprite(gritTexture, gritBounds.width, gritBounds.height);
    // this.grunge.tileScale.set(gritBounds.height / gritTexture.height);
    this.grunge.tileScale.set(2);
    this.grunge.position.set(gritBounds.x, gritBounds.y);
    this.grunge.tint = tint;
    this.addChild(this.grunge);

    const frameTexture = assets.getTexture("windowFrame");
    this.frame = new Sprite(frameTexture);
    this.frame.scale.set(frameSize.width / frameTexture.width, frameSize.height / frameTexture.height);
    this.addChild(this.frame);
  }

  set scrollX(value: number) {
    this.grunge.tilePosition.x = this.grunge.position.x + 2048 * value;
  }

  get scrollX() {
    return (this.grunge.tilePosition.x - this.grunge.position.x) / 2048;
  }

  tweenLeft(duration: number = 0.87) {
    const startingScrollX = Math.round(this.scrollX);
    return this.tweenScrollTo(startingScrollX - 1, duration);
  }

  tweenRight(duration: number = 0.87) {
    const startingScrollX = Math.round(this.scrollX);
    return this.tweenScrollTo(startingScrollX + 1, duration);
  }

  private tweenScrollTo(scrollX: number, duration: number) {
    return this.tweeener.to(this, { scrollX, duration, ease: "power3.inOut" });
  }

  get tint() {
    return this.grunge.tint;
  }

  set tint(value: number) {
    this.grunge.tint = value;
  }

  tweenTint(tint: number) {
    const currentColor = new Color(this.tint);
    const targetColor = new Color(tint);
    this.tweeener.to(currentColor, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.85,
      onUpdate: () => {
        this.tint = currentColor.toInt();
      },
    });
  }
}

export enum WindowBackgroundColor {
  MarketGreen = 0x126871,
  RailrunsPurple = 0x4c1c86,
}
