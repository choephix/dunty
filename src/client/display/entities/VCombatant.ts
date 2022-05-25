import { Combatant, CombatantStatus } from "@client/game/game";
import { StatusEffectBlueprints, StatusEffectKey } from "@client/game/StatusEffectBlueprints";
import { game } from "@client/main";
import { createEnchantedFrameLoop } from "@game/asorted/createEnchangedFrameLoop";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { arrangeInStraightLine } from "@sdk-pixi/layout/arrangeInStraightLine";
import { ToolTipFactory } from "../services/TooltipFactory";
import { VCombatantAnimations } from "./VCombatant.animations";
import { getIntentionEmojifiedString, getStatusEffectEmojiOnly } from "./VCombatant.emojis";

export class VCombatant extends Container {
  sprite;
  statusIndicators;
  intentionIndicator;

  thought?: string;

  constructor(public readonly data: Combatant) {
    super();

    this.sprite = new Sprite(Texture.from(data.textureId));
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);

    this.statusIndicators = this.addStatusIndicators();
    this.intentionIndicator = this.addIntentionIndicator();

    this.intializeAnimationsReactor();
  }

  readonly onEnterFrame = createEnchantedFrameLoop(this);

  //// Builder Methods

  private intializeAnimationsReactor() {
    const { status } = this.data;

    this.onEnterFrame.watch.array(
      () => [status.health, status.block, status.retaliation || 0],
      async ([health, block, retaliation], [prevHealth, prevBlock, prevRetaliation]) => {
        const Ani = VCombatantAnimations;
        if (health < prevHealth) await (health <= 0 ? Ani.die(this) : Ani.hurt(this));
        if (health > prevHealth) await (health > 0 ? Ani.buffHealth(this) : Ani.enter(this));
        if (block > prevBlock) await Ani.buffBlock(this);
        if (retaliation > prevRetaliation) await Ani.buffRetaliation(this);
      },
      true
    );
  }

  private addStatusIndicators() {
    const { status } = this.data;

    const statusIndicator = new StatusEffectIndicators();
    this.addChild(statusIndicator);

    this.onEnterFrame.watch.properties(
      () => status,
      () => statusIndicator.update(status),
      true
    );

    return statusIndicator;
  }

  private addIntentionIndicator() {
    const intentionIndicator = new Text("-", {
      fill: [0xffffff, 0xf0e010],
      fontFamily: "Impact, fantasy",
      fontSize: 40,
      stroke: 0x202020,
      strokeThickness: 5,
    });
    intentionIndicator.anchor.set(0.5);
    this.addChild(intentionIndicator);

    this.onEnterFrame.watch(
      () => this.thought || this.data.nextCard,
      v => {
        if (typeof v === "string") {
          intentionIndicator.text = v.toUpperCase();
          intentionIndicator.style.fill = [0xffffff, 0xf0e010];
          
          ToolTipFactory.addIntentionIndicator(
            intentionIndicator,
            this.data.status.stunned
              ? `STUNNED for ${this.data.status.stunned} turns`
              : this.data.status.frozen
              ? `FROZEN for ${this.data.status.frozen} turns`
              : // this.data.status.silenced ? `SILENCED for ${this.data.status.silenced} turns` :
                // this.data.status.disarmed ? `DISARMED for ${this.data.status.disarmed} turns` :
                v.toUpperCase()
          );
        } else {
          const [text, color = 0xf0e010] = getIntentionEmojifiedString(this.data, game);
          intentionIndicator.text = text.toUpperCase();
          intentionIndicator.style.fill = color;

          intentionIndicator.buttonMode = true;
          if (v) {
            ToolTipFactory.addIntentionIndicator(intentionIndicator, v);
          }
        }
      },
      true
    );

    return intentionIndicator;
  }

  //// Operation Methods

  setRightSide(rightSide: boolean) {
    this.sprite.scale.x = rightSide ? -1 : 1;

    this.statusIndicators.position.set(rightSide ? -200 : 200, 140);

    this.intentionIndicator.position.set(rightSide ? 200 : -200, -100);
    this.intentionIndicator.anchor.set(rightSide ? 1 : 0, 1.0);
  }

  waitUntilLoaded() {
    return this.onEnterFrame.waitUntil(() => this.sprite.texture.baseTexture.valid);
  }
}

class StatusEffectIndicators extends Container {
  readonly sprites = new Map<StatusEffectKey, ReturnType<typeof this.createStatusIndicator>>();

  update(status: CombatantStatus) {
    for (const [key, value] of CombatantStatus.entries(status)) {
      let sprite = this.sprites.get(key);
      if (value) {
        if (!sprite) {
          sprite = this.createStatusIndicator(key, value);
          this.addChild(sprite);
          this.sprites.set(key, sprite);
        }
        sprite.update(value);
      } else {
        if (sprite) {
          sprite.destroy();
          this.sprites.delete(key);
        }
      }
    }

    const spritesArray = Array.from(this.sprites.values());
    spritesArray.sort((a, b) => b.priority - a.priority);
    arrangeInStraightLine(spritesArray, { vertical: true, alignment: [0.5, 1.0] });

    this.pivot.y = this.height / this.scale.y;
  }

  private createStatusIndicator(key: StatusEffectKey, value: number) {
    const label = new Text(``, {
      fill: [0x405080, 0x202020],
      fontFamily: "Impact, fantasy",
      fontSize: 40,
      fontWeight: `bold`,
      stroke: 0xf0f0f0,
      strokeThickness: 5,
      align: "right",
    });
    label.anchor.set(0.5);

    function update(value: number) {
      label.text = getStatusEffectEmojifiedString(key, value) || "?";
      label.buttonMode = true;
      ToolTipFactory.addToStatusEffect(label, key, value);
    }

    update(value);

    return Object.assign(label, {
      key,
      value,
      priority: StatusEffectBlueprints[key].displayPriority,
      update,
    });
  }
}

function getStatusEffectEmojifiedString(key: StatusEffectKey, value: number) {
  const emoji = getStatusEffectEmojiOnly(key);
  if (typeof value === "number" && value != 0) return `${emoji}${value}`;
  if (typeof value === "boolean") return `${emoji}`;
  return `${emoji} (${value}?)`;
}
