import { FontFamily } from "@game/constants/FontFamily";
import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { CARD_SPRITE_DIMENSIONS } from "./CardSprite";

export class CardSpriteErrorOverlay extends Sprite {
  public readonly label: Text;

  constructor(labelText: string, color: number = 0xff5050) {
    super(Texture.from(`cardShade`));

    this.label = new Text(labelText.toUpperCase(), {
      fontFamily: FontFamily.Default,
      fontSize: 36,
      fontWeight: "bold",
      fill: color,

      stroke: 0x000000,
      strokeThickness: 2,

      dropShadow: true,
      dropShadowAngle: 1.57079632679,
      dropShadowColor: 0x010101,
      dropShadowDistance: 4,
      dropShadowAlpha: 0.75,

      align: "center",
    });
    this.label.position.set(this.texture.width / 2, this.texture.height / 2);
    this.label.anchor.set(0.5, 0.5);
    this.label.scale.set(CARD_SPRITE_DIMENSIONS.height / this.label.width);
    this.label.rotation = -1;
    this.addChild(this.label);
  }

  public centerSelf() {
    this.pivot.set(this.texture.width / 2, this.texture.height / 2);
  }
}
