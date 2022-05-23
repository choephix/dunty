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
  intentionIndicator;

  thought?: string;

  constructor(public readonly data: Combatant) {
    super();

    this.sprite = new Sprite(Texture.from(data.textureId));
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);

    this.healthIndicator = new Text("-", {
      // fill: 0xdd1010,
      fill: 0x202020,
      fontFamily: "Impact, sans-serif",
      fontSize: 40,
      fontWeight: `bold`,
      stroke: 0xf0f0f0,
      strokeThickness: 5,
    });
    this.healthIndicator.anchor.set(0.5);
    this.addChild(this.healthIndicator);

    this.onEnterFrame.watch.array(
      () => [data.status.health, data.status.block, data.status.retaliation],
      ([health, block, retaliation]) => {
        const col = [`❤${health}`];
        if (block > 0) col.unshift(`⛨${block}`);
        if (retaliation > 0) col.unshift(`☇${retaliation}`);
        this.healthIndicator.text = col.join("\n");
      },
      true
    );

    this.onEnterFrame.watch.array(
      () => [data.status.health, data.status.block, data.status.retaliation || 0],
      async ([health, block, retaliation], [prevHealth, prevBlock, prevRetaliation]) => {
        if (health < prevHealth) await (health <= 0 ? VCombatantAnimations.die(this) : VCombatantAnimations.hurt(this));
        if (health > prevHealth) await VCombatantAnimations.buffHealth(this);
        if (block > prevBlock) await VCombatantAnimations.buffBlock(this);
        if (retaliation > prevRetaliation) await VCombatantAnimations.buffRetaliation(this);
      },
      true
    );

    this.intentionIndicator = new Text("-", {
      fill: 0xf0e010,
      fontFamily: "Impact, sans-serif",
      fontSize: 40,
      stroke: 0x202020,
      strokeThickness: 5,
    });
    this.intentionIndicator.anchor.set(0.5);
    this.addChild(this.intentionIndicator);

    const emojis = { atk: "⚔", def: "⛨", func: "★" } as Record<string, string>;
    this.onEnterFrame.watch(
      () => this.thought || data.nextCard?.type,
      v => {
        v = emojis[v!] || v || '';
        this.intentionIndicator.text = v.toUpperCase();
      },
      true
    );
  }

  readonly onEnterFrame = createEnchantedFrameLoop(this);

  setRightSide(rightSide: boolean) {
    this.sprite.scale.x = rightSide ? -1 : 1;

    this.healthIndicator.position.set(rightSide ? -200 : 200, 140);
    this.healthIndicator.anchor.set(rightSide ? 0 : 1, 1.0);

    this.intentionIndicator.position.set(rightSide ? 200 : -200, -100);
    this.intentionIndicator.anchor.set(rightSide ? 1 : 0, 1.0);
  }

  waitUntilLoaded() {
    return this.onEnterFrame.waitUntil(() => this.sprite.texture.baseTexture.valid);
  }
}
