import { StatusEffectBlueprints } from "@client/game/StatusEffectBlueprints";
import { game } from "@client/main";
import { createAnimatedButtonBehavior } from "@game/asorted/createAnimatedButtonBehavior";
import { createEnchantedFrameLoop } from "@game/asorted/createEnchangedFrameLoop";
import { BLEND_MODES } from "@pixi/constants";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Rectangle } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { randomIntBetweenIncluding } from "@sdk/utils/random";
import { Card, Combatant, CombatantStatus } from "../../game/game";
import { ToolTipFactory } from "../services/TooltipFactory";

export class VCard extends Container {
  background;
  art;
  valueIndicator;

  glow;

  actor?: Combatant;

  constructor(public readonly data: Card) {
    super();

    this.background = this.addBackground();
    this.valueIndicator = this.addValueIndicator();
    this.art = this.addArt();

    this.glow = this.addGlow();

    this.hitArea = new Rectangle(-250, -350, 500, 700);

    createAnimatedButtonBehavior(
      this,
      {
        onUpdate({ hoverProgress }) {
          this.glow.alpha = hoverProgress;
          this.glow.scale.set(2.1 + 0.05 * hoverProgress * hoverProgress);
          this.zIndex = hoverProgress * 1000;
          this.pivot.y = hoverProgress * hoverProgress * 25;
          this.scale.set(0.4 + 0.05 * hoverProgress * hoverProgress);
        },
      },
      true
    );

    ToolTipFactory.addToCard(this);
  }

  addBackground() {
    const sprite = Sprite.from("https://public.cx/mock/cards/front-unit-mida.png");
    sprite.anchor.set(0.5);
    this.addChild(sprite);
    return sprite;
  }

  addArt() {
    const cfg = {
      func: { textureCategory: "books-smol", scale: 2.4 },
      atk: { textureCategory: "swords", scale: 2 },
      def: { textureCategory: "shields", scale: 2 },
    }[this.data.type]!;

    const textureId = `https://public.cx/mock/${cfg.textureCategory}/${randomIntBetweenIncluding(1, 48)}.png`;
    const sprite = Sprite.from(textureId);
    sprite.anchor.set(0.5);
    sprite.scale.set(cfg.scale);
    sprite.position.set(0, -100);
    this.addChild(sprite);
    return sprite;

    // const emoji = { atk: "⚔", def: "🛡" }[this.data.type];
    // const sprite = new Text(emoji, { fontSize: 120 });
    // sprite.anchor.set(0.5);
    // sprite.scale.set(4);
    // this.addChild(sprite);
    // return sprite;
  }

  addValueIndicator() {
    const cfg = {
      // atk: "slot-talons-pink",
      // def: "slot-talons",
      // def: "shield",
      // atk: "bol-laba",
      // atk: "slot-purple",
      // atk: { file: "slot-spike (1)", color: 0xe04040, scale: 1.8 },
      func: { file: "starc", color: 0xf0f0f0, scale: 0.8 },
      atk: { file: "slot-sword", color: 0xe04040, scale: 1.1 },
      def: { file: "slot-shield (1)", color: 0x70b0f0, scale: 1.8 },
    }[this.data.type];

    if (!cfg) return Sprite.from(Texture.EMPTY);

    // const sprite = Sprite.from(`https://public.cx/dunty/asorted/slot.png`);
    const pad = Sprite.from(`https://public.cx/dunty/asorted/${cfg.file}.png`);
    pad.anchor.set(0.5);
    pad.position.set(0, 300);
    pad.scale.set(cfg.scale);
    pad.tint = cfg.color || 0xffffff;
    this.addChild(pad);

    if (this.data.type === "atk" || this.data.type === "def") {
      const label = new Text(``, {
        fill: [0xf0f0f0, 0xc0c0c0],
        fontFamily: "Impact, sans-serif",
        fontSize: 60,
        fontWeight: `bold`,
        stroke: 0x0,
        strokeThickness: 8,
      });
      label.anchor.set(0.5);
      label.scale.set(2 / cfg.scale);
      pad.addChild(label);

      const getCurrentValue =
        this.data.type == "atk" ? () => game.calculateAttackPower(this.data, this.actor) : () => this.data.value || 0;
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
          (k: any) => StatusEffectBlueprints[k as keyof CombatantStatus].emoji
        );
        const label = new Text(emojis.join(""), {
          fill: [0xf0f0f0, 0xc0f0f0],
          fontFamily: "Impact, sans-serif",
          fontSize: 70,
          fontWeight: `bold`,
          stroke: 0x104050,
          strokeThickness: 8,
        });
        label.anchor.set(0.5, 0.6);
        label.scale.set(2 / cfg.scale);
        pad.addChild(label);
      }
    }

    return pad;
  }

  addGlow() {
    const sprite = Sprite.from("https://public.cx/mock/cards/fx-glow-orange.png");
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
