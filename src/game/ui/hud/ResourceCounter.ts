import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { Renderer, Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text, TextStyle } from "@pixi/text";
import { buttonizeInstance } from "@sdk-ui/buttonize";
import { formatGroupThousands } from "@sdk-ui/utils/formatToMaxDecimals";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { EnchantmentGlobals } from "@sdk/pixi/enchant/EnchantmentGlobals";
import { createValueAnimator_Counter } from "../common/createValueAnimator_Counter";

export interface ResourceCounterOptions {
  iconTexture: Texture | string;
  iconGlowTexture?: Texture | string;
  iconScaleMultiplier?: number;
  showDecimalsOnHover?: boolean;
}

export class ResourceCounter extends Container {
  public readonly assets = GameSingletons.getResources();

  public readonly icon: Sprite;
  public readonly pad: Container;
  private readonly iconGlow: Sprite;
  public readonly valueLabel: Text;
  // public readonly decimalsLabel: Text;

  private currentValue: number = 0;
  private showDecimals = false;

  private tweeener = new TemporaryTweeener(this);

  public formatValue(value: number) {
    if (this.showDecimals) {
      return formatGroupThousands(value.toFixed(4));
    } else {
      return formatGroupThousands(value.toFixed(0));
    }
    // return formatToMaxDecimals(value, 4, true);
  }

  constructor({
    iconTexture,
    iconGlowTexture,
    iconScaleMultiplier = 1,
    showDecimalsOnHover = false,
  }: ResourceCounterOptions) {
    super();

    const labelStyle: Partial<TextStyle> = {
      // Formatting
      align: "right",
      fontSize: 14,
      fill: "#FFFFff",
      fontFamily: FontFamily.Default,

      // Stroke
      stroke: "#080808",
      strokeThickness: 3,

      // Shadows
      dropShadow: true,
      dropShadowAlpha: 0.65,
      dropShadowColor: "#000000",
      dropShadowBlur: 1,
      dropShadowAngle: Math.PI / 4,
      dropShadowDistance: 6,
    };

    if (typeof iconTexture == "string") {
      iconTexture = this.assets.getTexture(iconTexture);
    }

    if (typeof iconGlowTexture == "string") {
      iconGlowTexture = this.assets.getTexture(iconGlowTexture);
    }

    const padTexture = this.assets.getTexture("ui-main/counter-pad.png");
    const pad = new Sprite(padTexture);
    const iconGlowSprite = new Sprite(iconGlowTexture);
    const iconSprite = new Sprite(iconTexture);
    const valueLabel = new Text("", labelStyle);
    // const decimalsLabel = new Text("", labelStyle);

    this.pad = pad;
    this.icon = iconSprite;
    this.iconGlow = iconGlowSprite;
    this.valueLabel = valueLabel;
    // this.decimalsLabel = decimalsLabel;

    pad.scale.set(0.8, 0.75);

    const iconScale = (iconScaleMultiplier * 0.5 * pad.height) / iconSprite.texture.height;
    iconSprite.scale.set(iconScale);
    iconSprite.anchor.set(0.5, 0.5);

    iconGlowSprite.scale.set(iconScale);
    iconGlowSprite.anchor.set(0.5, 0.5);

    const fontVerticalPositionCompensation = 3;
    valueLabel.anchor.set(1, 0.5);
    valueLabel.position.x = pad.width * 0.84;
    valueLabel.position.y = pad.height * 0.5 + fontVerticalPositionCompensation;

    // decimalsLabel.anchor.set(0, 0.5);
    // decimalsLabel.position.x = pad.width * 0.84;
    // decimalsLabel.position.y = pad.height * 0.5 + fontVerticalPositionCompensation;

    iconSprite.position.set(pad.height * 0.61, pad.height * 0.5);
    iconGlowSprite.position.set(pad.height * 0.61, pad.height * 0.5);

    this.addChild(pad, iconGlowSprite, iconSprite, valueLabel);

    ////

    if (showDecimalsOnHover) {
      const padNormalWidth = pad.width;
      const { behavior } = buttonizeInstance(this);
      behavior.on({
        hoverIn: () => {
          this.showDecimals = true;

          let wdiff = this.valueLabel.width;
          this.updateText();
          wdiff = this.valueLabel.width - wdiff;

          // this.pad.width = padNormalWidth + wdiff;
          valueLabel.position.x = padNormalWidth * 0.84 + wdiff;

          this.tweeener.to(this.pad, { width: padNormalWidth + wdiff, duration: 0.2 });
        },
        hoverOut: () => {
          this.showDecimals = false;

          this.updateText();

          // this.pad.width = padNormalWidth;
          valueLabel.position.x = padNormalWidth * 0.84;

          this.tweeener.to(this.pad, { width: padNormalWidth, duration: 0.2 });
        },
      });
    }
  }

  render(renderer: Renderer) {
    if (this.iconGlow.alpha > 0.2) {
      this.iconGlow.alpha -= 0.1 * EnchantmentGlobals.timeDelta;
    }

    super.render(renderer);
  }

  setValue(value: number) {
    this.currentValue = value;
    this.updateText();
    this.iconGlow.alpha = 1;
  }

  updateText() {
    this.valueLabel.text = this.formatValue(this.currentValue);
    const labelUnscaledWidth = this.valueLabel.width / this.valueLabel.scale.x;
    const maxLabelWidth = this.pad.width * 0.6;
    if (labelUnscaledWidth > maxLabelWidth) {
      this.valueLabel.scale.set(maxLabelWidth / labelUnscaledWidth);
    }
  }

  setIconTexture(texture: Texture) {
    this.icon.texture = texture;
  }
}

export module ResourceCounter {
  export function attachAnimatedValueGetter(counter: ResourceCounter, getCurrentValue: () => number) {
    counter.setValue(getCurrentValue());
    createValueAnimator_Counter(
      () => getCurrentValue(),
      value => counter.setValue(value)
    );
  }
}
