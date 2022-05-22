import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { Texture } from "@pixi/core";
import { Combatant } from "../game/game";
import { Container } from "@pixi/display";
import { createEnchantedFrameLoop } from "@client/sdk/createEnchantedFrameLoop";

export class VCombatant extends Container {
  sprite;
  healthIndicator;

  constructor(public readonly data: Combatant) {
    super();

    this.sprite = new Sprite(Texture.from(data.textureId));
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);

    this.healthIndicator = new Text("-", {
      fill: 0xdd1010,
      fontFamily: "Impact, sans-serif",
      fontSize: 40,
      fontWeight: `bold`,
      stroke: 0xf0f0f0,
      strokeThickness: 5,
    });
    this.healthIndicator.anchor.set(0.5);
    this.addChild(this.healthIndicator);

    this.onEnterFrame.watch(
      () => data.health,
      health => void (this.healthIndicator.text = `♥${health}`),
      true
    );
  }

  readonly onEnterFrame = createEnchantedFrameLoop(this);

  setRightSide(rightSide: boolean) {
    this.sprite.scale.x = rightSide ? -1 : 1;
    this.healthIndicator.position.set(rightSide ? -70 : 70, 150);
  }
}
