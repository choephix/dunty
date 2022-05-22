import { createEnchantedFrameLoop } from "@client/sdk/createEnchantedFrameLoop";
import { createAnimatedButtonBehavior } from "@game/asorted/createAnimatedButtonBehavior";
import { BLEND_MODES } from "@pixi/constants";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { randomIntBetweenIncluding } from "@sdk/utils/random";
import { Card } from "../game/game";

export class VCard extends Container {
  background;
  art;
  valueIndicator;

  glow;

  constructor(public readonly data: Card) {
    super();

    this.background = this.addBackground();
    this.valueIndicator = this.addValueIndicator();
    this.art = this.addArt();

    this.glow = this.addGlow();

    createAnimatedButtonBehavior(this.background, {
      onUpdate: ({ hoverProgress }) => {
        this.glow.alpha = hoverProgress;
        this.glow.scale.set(2.1 + 0.05 * hoverProgress * hoverProgress);
      }
    }, true)
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
    sprite.position.set(0, -60);
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
    const padTextureId = {
      // atk: "slot-talons-pink",
      // def: "slot-talons",
      atk: "bol-laba",
      // atk: "slot-purple",
      def: "shield",
    }[this.data.type];

    // const sprite = Sprite.from(`https://public.cx/dunty/asorted/slot.png`);
    const pad = Sprite.from(`https://public.cx/dunty/asorted/${padTextureId}.png`);
    pad.anchor.set(0.5);
    pad.position.set(0, 320);
    pad.scale.set(0.4);
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
    label.scale.set(6);
    pad.addChild(label);

    const onEnterFrame = createEnchantedFrameLoop(pad);
    onEnterFrame.watch(
      () => this.data.value,
      v => (label.text = String(v || 0)),
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
