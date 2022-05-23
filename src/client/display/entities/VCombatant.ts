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
      () => [data.health, data.block, data.status.retaliation],
      ([health, block, retaliation]) => {
        let ln = `❤${health}`;
        if (block > 0) ln += ` 🛡${block}`;
        if (retaliation > 0) ln += ` 🠈${retaliation}`;
        this.healthIndicator.text = ln;
      },
      true
    );

    this.onEnterFrame.watch.array(
      () => [data.health, data.block, data.status.retaliation || 0],
      async ([health, block, retaliation], [prevHealth, prevBlock, prevRetaliation]) => {
        if (health <= 0) await VCombatantAnimations.die(this);
        if (health < prevHealth) await VCombatantAnimations.hurt(this);
        if (health > prevHealth) await VCombatantAnimations.buffHealth(this);
        if (block > prevBlock) await VCombatantAnimations.buffBlock(this);
        if (retaliation > prevRetaliation) await VCombatantAnimations.buffRetaliation(this);
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
