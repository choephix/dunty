import { VCombatantAnimations } from "@dungeon/combat/display/entities/VCombatant.animations";
import { getStatusEffectEmojiOnly } from "@dungeon/combat/display/entities/VCombatant.emojis";
import { ToolTipFactory } from "@dungeon/combat/display/services/TooltipFactory";
import { Card, Combatant, CombatantStatus, CombatState } from "@dungeon/combat/state/CombatState";
import {
  StatusEffectBlueprints,
  StatusEffectImpactAlignment,
  StatusEffectKey,
} from "@dungeon/combat/state/StatusEffectBlueprints";
import { __VERBOSE__ } from "@dungeon/debug/URL_PARAMS";
import { createEnchantedFrameLoop } from "@sdk-pixi/asorted/createEnchangedFrameLoop";
import { BLEND_MODES } from "@pixi/constants";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { arrangeInStraightLine } from "@sdk-pixi/layout/arrangeInStraightLine";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { EnchantmentGlobals } from "@sdk/pixi/enchant/EnchantmentGlobals";
import { FontFamily } from "@dungeon/common/display/constants/FontFamily";
import { Combat } from "@dungeon/combat/logic/Combat";
import { spawnSpriteWave } from "@sdk-pixi/asorted/animations/spawnSpriteWave";

export class VCombatant extends Container {
  highlight;
  sprite;
  statusIndicators;
  intentionIndicator;
  energyIndicator;

  thought?: string;

  name = this.data.name;

  readonly breathingOptions = {};

  constructor(public readonly data: Combatant) {
    super();

    this.highlight = new Sprite(Texture.from("https://undroop-assets.web.app/davinci/3/radial-4.png"));
    this.highlight.anchor.set(0.45, 0.35);
    this.highlight.position.set(0, -50);
    this.highlight.scale.set(2.8, 0.7);
    this.highlight.blendMode = BLEND_MODES.ADD;
    this.highlight.visible = false;
    this.addChild(this.highlight);

    this.sprite = new Sprite(Texture.from(data.textureId));
    this.sprite.anchor.set(0.5, 0.95);
    this.addChild(this.sprite);

    this.statusIndicators = this.addStatusIndicators();
    this.energyIndicator = this.addEnergyIndicator();
    this.intentionIndicator = this.addIntentionIndicator();

    this.intializeAnimationReactors();
  }

  readonly onEnterFrame = createEnchantedFrameLoop(this);

  //// Builder Methods

  public startBreathing({ start = Math.random(), speed = 4 + Math.random(), skew = 0.0 } = {}) {
    Object.assign(this.sprite, {
      onEnterFrame: () => {
        if (this.data.alive) {
          this.sprite.position.y = this.sprite.texture.height * 0.45;

          const breathTotal = start + speed * EnchantmentGlobals.timeTotal;
          this.sprite.scale.y = 1.0 + 0.0125 * (skew ? Math.abs(Math.sin(breathTotal)) : Math.sin(breathTotal));
          this.sprite.skew.x = skew * Math.cos(breathTotal);
        } else {
          this.sprite.scale.y = 0.9;
        }
      },
    });
  }

  private intializeAnimationReactors() {
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

    const noFloatyTextKeys = ["health"];
    this.onEnterFrame.watch.properties(
      () => status,
      (current, prev) => {
        const entries = CombatantStatus.entries(current);
        for (const [key, value] of entries) {
          if (value === prev[key]) continue;
          if (noFloatyTextKeys.indexOf(key) === -1) {
            const emoji = getStatusEffectEmojiOnly(key);
            const delta = value - prev[key];
            const str = delta > 0 ? `+${emoji}` : delta < 0 ? `-${emoji}` : emoji;
            VCombatantAnimations.spawnFloatyText(this, str, 0xa0c0f0);
          }
        }
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
    const { drawPile } = this.data.cards;

    const intentionIndicator = new IntentionIndicators();
    this.addChild(intentionIndicator);

    this.onEnterFrame.watch(
      () => this.thought || drawPile[0],
      v =>
        typeof v === "string"
          ? intentionIndicator.updateFromText(this.data, v)
          : intentionIndicator.updateFromUpcomingCards(this.data, Combat.current!),
      true
    );

    return intentionIndicator;
  }

  private addEnergyIndicator() {
    const intentionIndicator = new Text("-", {
      fill: [0xffffff, 0xf0e010],
      fontFamily: FontFamily.NumericIndicators,
      fontWeight: "700",
      fontSize: 24,
      stroke: 0x202020,
      strokeThickness: 5,
    });
    this.addChild(intentionIndicator);

    this.onEnterFrame.watch(
      () => this.data.energy,
      v => {
        intentionIndicator.text = v > 0 ? new Array(v).fill("⦿").join("") : "";
        ToolTipFactory.addToEnergyIndicator(intentionIndicator, this.data.energy);
      },
      true
    );

    return intentionIndicator;
  }

  //// Operation Methods

  setRightSide(rightSide: boolean) {
    const sign = rightSide ? -1 : 1;

    this.sprite.scale.x = sign;

    this.statusIndicators.position.set(sign * 200, 140);

    this.intentionIndicator.position.set(sign * -200, -100);

    this.energyIndicator.position.set(sign * 190, 160);
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

    const froms = spritesArray.map(child => [child, child.position.clone()] as const);

    arrangeInStraightLine(spritesArray, { vertical: true, alignment: [0.5, 1.0] });

    new TemporaryTweeener(this).to(this, { pixi: { pivotY: this.height / this.scale.y }, duration: 0.15 });

    froms.forEach(
      ([child, { x, y }]) => !child.isNew && new TemporaryTweeener(child).from(child, { x, y, duration: 0.15 })
    );

    this.animateInNewChildren();
  }

  private createStatusIndicator(key: StatusEffectKey, value: number) {
    const { displayPriority, impactAlignment } = StatusEffectBlueprints[key];

    function getColors(key: StatusEffectKey) {
      if (key === "health") return [0x70c050, 0x107010, 0x105010];
      if (key === "block") return [0x4050f0, 0x101090];

      if (impactAlignment === StatusEffectImpactAlignment.NEUTRAL) return [0x4050f0, 0x101090];
      if (impactAlignment === StatusEffectImpactAlignment.POSITIVE) return [0x40c0f0, 0x106090];
      if (impactAlignment === StatusEffectImpactAlignment.NEGATIVE) return [0xf04040, 0x901010];
    }
    const colors = {
      health: [0x70c050, 0x107010, 0x105010],
      block: [0x4050f0, 0x101090],
    }[key] ?? [0x405080, 0x202020];
    const label = new Text(``, {
      fill: colors,
      fontFamily: FontFamily.NumericIndicators,
      fontWeight: "700",
      fontSize: 40,
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
      isNew: true,
      from: { x: 0, y: 0 },
      key,
      value,
      priority: displayPriority,
      update,
    });
  }

  private animateInNewChildren() {
    for (const [_, sprite] of this.sprites) {
      if (sprite.isNew) {
        sprite.isNew = false;
        const tweeener = new TemporaryTweeener(sprite);
        tweeener.from(sprite, { pixi: { scale: 0 }, ease: "back.out" });
      }
    }
  }
}

function getStatusEffectEmojifiedString(key: StatusEffectKey, value: number) {
  const emoji = getStatusEffectEmojiOnly(key);
  if (typeof value === "number" && value != 0) return `${emoji}${value}`;
  if (typeof value === "boolean") return `${emoji}`;
  return `${emoji} (${value}?)`;
}

class IntentionIndicators extends Container {
  readonly sprites = new Map<Card, Text & { isNew?: boolean }>();

  private clear() {
    for (const card of this.sprites.keys()) {
      this.sprites.get(card)?.destroy();
      this.sprites.delete(card);
    }
  }

  private afterUpdate() {
    const froms = [...this.sprites.values()].map(child => [child, child.position.clone()] as const);

    arrangeInStraightLine(this.children, { vertical: true, alignment: [0.5, 1.0] });

    froms.forEach(([child, { x, y }]) => !child.isNew && new TemporaryTweeener(child).from(child, { x, y }));

    this.animateInNewChildren();
  }

  updateFromText(actor: Combatant, v: string) {
    this.clear();

    const sprite = this.createIndicatorFromText(v.toUpperCase(), [0xffffff, 0xf0e010]);
    Object.assign(sprite, { isNew: true });

    const { status } = actor;
    ToolTipFactory.addIntentionIndicator(
      sprite,
      status.stunned
        ? `STUNNED for ${status.stunned} turns`
        : status.frozen
        ? `FROZEN for ${status.frozen} turns`
        : // this.data.status.silenced ? `SILENCED for ${this.data.status.silenced} turns` :
          // this.data.status.disarmed ? `DISARMED for ${this.data.status.disarmed} turns` :
          v.toUpperCase()
    );

    this.afterUpdate();
  }

  updateFromUpcomingCards(actor: Combatant, game: Combat) {
    this.clear();

    const cardsToDrawCount = game.faq.calculateCardsToDrawOnTurnStart(actor);
    const intentionCards = actor.cards.drawPile.slice(0, cardsToDrawCount);

    for (const card of intentionCards) {
      const sprite = this.createIndicatorFromCard(actor, card);
      Object.assign(sprite, { isNew: true });
      this.addChild(sprite);
      this.sprites.set(card, sprite);
    }

    this.afterUpdate();
  }

  private createIndicatorFromText(str: string, colors: number[]) {
    const label = new Text(str, {
      fill: colors,
      fontFamily: FontFamily.NumericIndicators,
      fontWeight: "700",
      fontSize: 40,
      stroke: 0xf0f0f0,
      strokeThickness: 5,
      align: "right",
    });
    label.anchor.set(0.5);

    return label;
  }

  private createIndicatorFromCard(actor: Combatant, card: Card) {
    const emojifySingleCardIntention = (card: Card): [string, number?] => {
      const { type } = card;

      if (type === "atk") {
        const atk = Combat.current!.faq.calculateAttackPower(card, actor);
        return [`⚔${atk}`, 0xf02020];
      }

      if (type === "def") {
        const def = Combat.current!.faq.calculateBlockPointsToAdd(card, actor);
        return [`⛊${def || "?"}`, 0x70b0f0];
      }

      if (type === "func") {
        try {
          if (!card.isBloat) throw new Error("Not a bloat");
          const mod = [...Object.keys(card.mods!)][0] as StatusEffectKey;
          const emoji = StatusEffectBlueprints[mod]!.emoji;
          return [emoji, 0x00ffff];
        } catch (_) {
          const emoji = `★` + (__VERBOSE__ ? ` ` + Object.keys(card.mods || {}) : ``).toUpperCase();
          return [emoji, 0x00ffff];
        }
      }

      return [""];
    };

    const [str, color = 0x405080] = emojifySingleCardIntention(card);
    const label = new Text(str, {
      fill: color,
      // fill: [0xffffff, 0xf0e010],
      fontFamily: FontFamily.NumericIndicators,
      fontWeight: "700",
      fontSize: 40,
      stroke: 0x202020,
      strokeThickness: 5,
      align: "right",
    });
    label.anchor.set(0.5);

    label.buttonMode = true;
    ToolTipFactory.addIntentionIndicator(label, card);

    return label;
  }

  private animateInNewChildren() {
    for (const [card, sprite] of this.sprites) {
      if (sprite.isNew) {
        sprite.isNew = false;
        const tweeener = new TemporaryTweeener(sprite);
        tweeener.from(sprite, { pixi: { scale: 0 }, ease: "back.out" });

        const waveColor = card.type === "atk" ? 0xf02020 : card.type === "def" ? 0x70b0f0 : 0x00ffff;
        const fx = spawnSpriteWave(
          "https://undroop-assets.web.app/davinci/3/radial-4.png",
          { pixi: { scale: 2 }, duration: 2 },
          { scale: 0, tint: waveColor, blendMode: BLEND_MODES.ADD }
        );
        return sprite.addChild(fx);
      }
    }
  }
}
