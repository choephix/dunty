import { Combatant } from "@client/game/game";
import { createEnchantedFrameLoop } from "@game/asorted/createEnchangedFrameLoop";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { VCombatantAnimations } from "./VCombatant.animations";

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

    this.onEnterFrame.watch.array(
      () => [data.health, data.block],
      ([health, block], [prevHealth, prevBlock]) => {
        let str = `❤${health}`;
        if (block) str += ` 🛡${block}`;
        this.healthIndicator.text = str;

        if (health <= 0) {
          VCombatantAnimations.die(this);
        } else if (health < prevHealth) {
          VCombatantAnimations.hurt(this);
        } else if (health > prevHealth || block > prevBlock) {
          VCombatantAnimations.buff(this);
        }
      },
      true
    );
  }

  readonly onEnterFrame = createEnchantedFrameLoop(this);

  setRightSide(rightSide: boolean) {
    this.sprite.scale.x = rightSide ? -1 : 1;
    this.healthIndicator.position.set(rightSide ? -150 : 150, 100);
  }

  waitUntilLoaded() {
    return this.onEnterFrame.waitUntil(() => this.sprite.texture.baseTexture.valid);
  }
}
