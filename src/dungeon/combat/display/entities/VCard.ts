import { ToolTipFactory } from "@dungeon/combat/display/services/TooltipFactory";
import { Combat } from "@dungeon/combat/logic/Combat";
import { Card, Combatant, CombatantStatus } from "@dungeon/combat/state/CombatState";
import { StatusEffectBlueprints } from "@dungeon/combat/state/StatusEffectBlueprints";
import { createAnimatedButtonBehavior } from "@sdk-pixi/asorted/createAnimatedButtonBehavior";
import { createEnchantedFrameLoop } from "@sdk-pixi/asorted/createEnchangedFrameLoop";
import { BLEND_MODES } from "@pixi/constants";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Rectangle } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";

export class VCard extends Container {
  background;
  art;
  valueIndicator;
  costIndicator;

  glow;

  actor?: Combatant;

  state;

  public tweeener = new TemporaryTweeener(this);

  constructor(public readonly data: Card) {
    super();

    this.background = this.addBackground();
    this.art = this.addArt();

    this.valueIndicator = this.addValueIndicator();
    this.costIndicator = this.addCostIndicator();

    this.glow = this.addGlow();

    this.hitArea = new Rectangle(-250, -350, 500, 700);

    this.state = createAnimatedButtonBehavior(
      this,
      {
        onUpdate({ hoverProgress, disableProgress }) {
          const v = hoverProgress * (1.0 - disableProgress);
          this.glow.alpha = v;
          this.glow.scale.set(2.1 + 0.05 * v * v);
          this.zIndex = hoverProgress * 1000;
          this.pivot.y = v * v * 25;
          this.scale.set(0.4 + 0.05 * v * v);

          const actorEnergy = this.actor?.energy ?? Number.POSITIVE_INFINITY;
          this.glow.tint = this.data.cost > actorEnergy ? 0xff0000 : 0xffffff;
        },
      },
      true,
      {
        tweenDisabledDuration: 0.15,
      }
    );

    ToolTipFactory.addToCard(this);
  }

  addBackground() {
    const { type, isToken, isBloat } = this.data;
    const filename = isBloat
      ? "front-trap"
      : isToken
      ? "front-sneak"
      : { atk: "front-red", def: "front-grand", func: "front-pink" }[type];
    const sprite = Sprite.from(`https://undroop.web.app/ccgu/${filename}.png`);
    sprite.anchor.set(0.5);
    this.addChild(sprite);
    return sprite;
  }

  addArt() {
    const getStuff = (): [string, number] => {
      if (this.data.textureUrl) {
        return [this.data.textureUrl, 1];
      }

      const getBookFilename = (): string => {
        const ref = {
          health: 30,
          block: 45,
          parry: 19,
          reflect: 5,
          retaliation: 26,
          protection: 43,
          brittle: 13,
          exposed: 12,
          doomed: 31,
          leech: 38,
          regeneration: 50,
          strength: 44,
          rage: 11,
          fury: 48,
          haste: 36,
          taunt: 22,
          tactical: 10,
          daggers: 24,
          defensive: 40,
          weak: 39,
          burning: 18,
          poisoned: 32,
          bleeding: 1,
          stunned: 16,
          frozen: 17,
          wet: 21,
          warm: 27,
          oiled: 37,
          cold: 28,
          sleep: 15,
        };
        const key = Object.keys(this.data.mods || {})[0];
        return String(ref[key as never] || 2);
      };

      const cfg = {
        func: { textureCategory: "books-smol", scale: 2.7 },
        atk: { textureCategory: "swords", scale: 2 },
        def: { textureCategory: "shields", scale: 2 },
      }[this.data.type]!;

      const num = {
        func: getBookFilename(),
        atk: [this.data.cost * 12 + (this.data.value || 0)],
        def: [this.data.cost * 9 + (this.data.value || 0)],
      }[this.data.type]!;

      return [`https://undroop-assets.web.app/confucius/${cfg.textureCategory}/${num}.png`, cfg.scale];
    };
    const [textureUrl, scale] = getStuff();
    const sprite = Sprite.from(textureUrl);
    sprite.anchor.set(0.5);
    sprite.scale.set(scale);
    sprite.position.set(0, -40);
    this.addChild(sprite);
    return sprite;

    // const emoji = { atk: "⚔", def: "🛡" }[this.data.type];
    // const sprite = new Text(emoji, { fontSize: 120 });
    // sprite.anchor.set(0.5);
    // sprite.scale.set(4);
    // this.addChild(sprite);
    // return sprite;
  }

  addCostIndicator() {
    const label = new Text(``, {
      // fill: [0xf0f0f0, 0xe0a060],
      fill: [0x404060, 0x202030],
      fontFamily: "Impact, fantasy",
      fontSize: 16,
      fontWeight: `bold`,
      stroke: 0xf0f0f0,
      strokeThickness: 2,
    });
    label.scale.set(3);
    label.anchor.set(0);
    label.position.set(-210, -315);

    // const formatCost = (cost: number) => String(cost || 0);
    const onEnterFrame = createEnchantedFrameLoop(label);
    onEnterFrame.watch(
      () => this.data.cost,
      v => {
        label.text = formatEnergyCost(v);
        label.style.fill = v > 0 ? [0x404060, 0x202030] : [0x1050d0, 0x109010];
      },
      true
    );
    Object.assign(label, { onEnterFrame });

    this.addChild(label);
    return label;
  }

  addValueIndicator() {
    const cfg = {
      // atk: "slot-talons-pink",
      // def: "slot-talons",
      // def: "shield",
      // atk: "bol-laba",
      // atk: "slot-purple",
      // atk: { file: "slot-spike (1)", color: 0xe04040, scale: 1.8 },
      // func: { file: "starc", color: 0xf0f0f0, scale: 0.8 },
      // func: { file: "twirl-blurry", color: 0xf0f0f0, scale: 0.6 },
      // func: { file: "twirl-pink", color: 0xf0f0f0, scale: 0.7 },
      func: { file: "twirl-lite", color: 0xf0f0f0, scale: 0.6 },
      atk: { file: "slot-sword", color: 0xe04040, scale: 1.1 },
      def: { file: "slot-shield (1)", color: 0x70b0f0, scale: 1.8 },
    }[this.data.type];

    if (!cfg) return Sprite.from(Texture.EMPTY);

    // const sprite = Sprite.from(`https://undroop.web.app/dunty/asorted/slot.png`);
    const pad = Sprite.from(`https://undroop.web.app/dunty/asorted/${cfg.file}.png`);
    pad.anchor.set(0.5);
    pad.position.set(0, 300);
    pad.scale.set(cfg.scale);
    pad.tint = cfg.color || 0xffffff;
    this.addChild(pad);

    if (this.data.type === "atk" || this.data.type === "def") {
      const label = new Text(``, {
        fill: [0xf0f0f0, 0xc0c0c0],
        fontFamily: "Impact, fantasy",
        fontSize: 60,
        fontWeight: `bold`,
        stroke: 0x0,
        strokeThickness: 8,
      });
      label.anchor.set(0.5);
      label.scale.set(2 / cfg.scale);
      pad.addChild(label);

      const getCurrentValue =
        Combat.current && this.data.type == "atk"
          ? () => Combat.current.faq.calculateAttackPower(this.data, this.actor)
          : () => this.data.value || 0;
      const onEnterFrame = createEnchantedFrameLoop(pad);
      onEnterFrame.watch(
        getCurrentValue,
        v => {
          label.text = String(v);
        },
        true
      );
      Object.assign(pad, { onEnterFrame });
    }
    if (this.data.type === "func") {
      if (this.data.mods) {
        const emojis = Object.keys(this.data.mods).map(
          (k: any) => StatusEffectBlueprints[k as keyof CombatantStatus]?.emoji || "N/A"
        );
        const label = new Text(emojis.join(""), {
          fill: [0xf0f0f0, 0xc0f0f0],
          fontFamily: "Impact, fantasy",
          fontSize: 70,
          fontWeight: `bold`,
          stroke: 0x104050,
          strokeThickness: 8,
        });
        label.anchor.set(0.5, 0.55);
        label.scale.set(2 / cfg.scale);
        pad.addChild(label);
      }
    }

    return pad;
  }

  addGlow() {
    const sprite = Sprite.from("https://undroop.web.app/ccgu/fx-glow-orange.png");
    sprite.anchor.set(0.5);
    sprite.blendMode = BLEND_MODES.ADD;
    sprite.scale.set(2.15);
    this.addChild(sprite);
    return sprite;
  }

  getBounds() {
    return this.background.getBounds();
  }
}

export function formatEnergyCost(cost: number) {
  return cost ? new Array(cost).fill("⦿").join("") : "FREE";
}

export module VCard {
  export const DESIGN_WIDTH = 500;
  export const DESIGN_HEIGHT = 700;
}
