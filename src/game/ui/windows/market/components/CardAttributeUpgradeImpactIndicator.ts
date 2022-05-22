import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { BitmapFontName, FontFamily } from "@game/constants/FontFamily";
import { ThemeColors } from "@game/constants/ThemeColors";
import { Container } from "@pixi/display";
import { GlowFilter } from "@pixi/filter-glow";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { BitmapText, IBitmapTextStyle } from "@pixi/text-bitmap";

function convertAttributeValueToText(value: number): string {
  if (isNaN(value)) {
    return "?";
    // return "--";
  }

  if (value < 0) {
    return `${value}`;
  }

  if (value > 0) {
    return `+${value}`;
  }

  return "0";
}

export function convertAttributeValueToTintColor(value: number): number {
  if (isNaN(value)) {
    return 0xb0b0b0;
  }

  if (value < 0) {
    return ThemeColors.DANGER_COLOR.toInt();
  }

  if (value > 0) {
    return ThemeColors.HIGHLIGHT_COLOR.toInt();
  }

  return 0x404040;
}

export class CardAttributeUpgradeImpactIndicator extends Container {
  protected readonly background: Sprite;
  protected readonly icon: Sprite;
  protected readonly nameLabel: Text;
  protected readonly valueLabel: BitmapText;
  protected readonly assets = GameSingletons.getResources();

  constructor(backgroundTextureId: string, iconTextureId: string, nameLabelText: string, glow: boolean = true) {
    super();

    this.background = new Sprite(this.assets.getTexture(backgroundTextureId));
    if (glow) this.background.filters = [this.createFilter()];
    this.addChild(this.background);

    this.icon = new Sprite(this.assets.getTexture(iconTextureId));
    this.icon.position.set(0, 0);
    this.icon.anchor.set(0.5, 0.5);
    this.icon.position.set(114, 151);
    this.icon.name = "icon";
    this.addChild(this.icon);

    this.nameLabel = new Text(nameLabelText.toUpperCase(), {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 26,
      align: "center",
    });
    this.nameLabel.anchor.set(0.5, 0.5);
    this.nameLabel.position.set(114, -16);
    this.nameLabel.name = "nameLabel";
    this.addChild(this.nameLabel);

    const valueLabelStyle = {
      fontName: BitmapFontName.CelestialTypeface,
      tint: ThemeColors.HIGHLIGHT_COLOR.toInt(),
    } as IBitmapTextStyle;
    this.valueLabel = new BitmapText("", valueLabelStyle);
    this.valueLabel.position.set(114, 20);
    this.valueLabel.scale.set(1.4);
    this.valueLabel.name = "valueLabel";
    this.addChild(this.valueLabel);

    this.pivot.set(this.background.width / 2, this.background.height / 2);
  }

  public setValue(value: number | null) {
    if (value == null) value = NaN;
    const text = convertAttributeValueToText(value);
    const tint = convertAttributeValueToTintColor(value);

    // @ts-ignore - Yeah, pixi doesn't like it when we change the tint on an already instantiated bitmap text, but it seems to work.
    this.valueLabel.tint = tint;
    this.valueLabel.text = text;
    this.valueLabel.updateText();

    // this.valueLabel.scale.set(80 / this.valueLabel.height);
    this.valueLabel.scale.set(isNaN(value) ? 0.8 : 1.4);
    this.valueLabel.pivot.set(
      (0.5 * this.valueLabel.width) / this.valueLabel.scale.x,
      (0.5 * this.valueLabel.height) / this.valueLabel.scale.y
    );
  }

  private createFilter() {
    return new GlowFilter({
      outerStrength: 2,
      distance: 5,
      color: 0x00ffff,
    });
  }
}
