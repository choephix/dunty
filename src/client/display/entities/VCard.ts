import { game } from "@client/main";
import { createAnimatedButtonBehavior } from "@game/asorted/createAnimatedButtonBehavior";
import { createEnchantedFrameLoop } from "@game/asorted/createEnchangedFrameLoop";
import { BLEND_MODES } from "@pixi/constants";
import { Container } from "@pixi/display";
import { Rectangle } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { randomIntBetweenIncluding } from "@sdk/utils/random";
import { Card, Combatant } from "../../game/game";

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
  }

  addBackground() {
    const sprite = Sprite.from("https://public.cx/mock/cards/front-unit-mida.png");
    sprite.anchor.set(0.5);
    this.addChild(sprite);
    return sprite;
  }

  addArt() {
    const textureCategory = this.data.type == "atk" ? "swords" : "shields";
    const textureId = `https://public.cx/mock/${textureCategory}/${randomIntBetweenIncluding(1, 48)}.png`;
    const sprite = Sprite.from(textureId);
    sprite.anchor.set(0.5);
    sprite.scale.set(2);
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
      atk: { file: "slot-sword", color: 0xe04040, scale: 1.1 },
      def: { file: "slot-shield (1)", color: 0x70b0f0, scale: 1.8 },
    }[this.data.type]!;

    // const sprite = Sprite.from(`https://public.cx/dunty/asorted/slot.png`);
    const pad = Sprite.from(`https://public.cx/dunty/asorted/${cfg.file}.png`);
    pad.anchor.set(0.5);
    pad.position.set(0, 300);
    pad.scale.set(cfg.scale);
    pad.tint = cfg.color;
    this.addChild(pad);

    const label = new Text(``, {
      fill: 0xf0f0f0,
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
}
