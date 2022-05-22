import { FontFamily } from "@game/constants/FontFamily";
import { Container } from "@pixi/display";
import { Text } from "@pixi/text";
import { CARD_SPRITE_DIMENSIONS } from "./CardSprite";

export class CardSpriteSubtleMessageOverlay extends Container {
  public readonly label: Text;

  constructor(labelText: string, color: number = 0xff5050) {
    super();

    this.label = new Text(labelText.toUpperCase(), {
      fontFamily: FontFamily.Default,
      fontSize: 16,
      fontWeight: "bold",
      fill: color,

      stroke: 0x000000,
      strokeThickness: 3,

      align: "center",
    });
    this.label.position.set(CARD_SPRITE_DIMENSIONS.width * 0.5, CARD_SPRITE_DIMENSIONS.height * 0.3);
    this.label.anchor.set(0.5, 0.5);
    this.label.scale.set(Math.min(2.0, 0.75 * CARD_SPRITE_DIMENSIONS.width / this.label.width));
    this.addChild(this.label);
  }

  public centerSelf() {
    this.pivot.set(CARD_SPRITE_DIMENSIONS.width / 2, CARD_SPRITE_DIMENSIONS.height / 2);
  }
}
