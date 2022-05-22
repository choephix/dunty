import { AssetsManager } from "@game/app/components/AssetsManager";
import { GameSingletons } from "@game/app/GameSingletons";
import { createAnimatedButtonBehavior } from "@game/asorted/createAnimatedButtonBehavior";
import { BLEND_MODES } from "@pixi/constants";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { lerp } from "@sdk/utils/math";

export class RailroaderMedal extends Container {
  private assets: AssetsManager = GameSingletons.getResources();

  private icon: Sprite;
  private pad: Sprite;

  public highlighted: boolean = false;

  constructor() {
    super();

    this.pad = new Sprite(Texture.EMPTY);
    this.pad.anchor.set(0.5);
    this.addChild(this.pad);

    this.icon = new Sprite(Texture.EMPTY);
    this.icon.anchor.set(0.5);
    this.addChild(this.icon);

    this.setHighlighted(false);
    this.enableShineOnHover();
  }

  setIcon(textureId: string) {
    this.icon.texture = this.assets.getTexture(textureId);
  }

  setHighlighted(highlight: boolean) {
    this.highlighted = highlight;

    if (highlight) {
      this.pad.texture = this.assets.getTexture(RailroaderMedal.TextureId.PadHighlighted);
    } else {
      this.pad.texture = this.assets.getTexture(RailroaderMedal.TextureId.PadBasic);
    }
  }

  enableShineOnHover() {
    const halo = Sprite.from(RailroaderMedal.TextureId.ShineHalo);
    halo.blendMode = BLEND_MODES.ADD;
    halo.anchor.set(0.5);
    halo.angle = 360 * Math.random();
    this.addChild(halo);

    const glow = Sprite.from(RailroaderMedal.TextureId.ShineGlow);
    glow.blendMode = BLEND_MODES.ADD;
    glow.anchor.set(0.5);
    this.addChild(glow);

    createAnimatedButtonBehavior(
      this.pad,
      {
        onUpdate: ({ hoverProgress }) => {
          if (!this.highlighted) hoverProgress = 0;
          glow.alpha = 0.45 * hoverProgress;
          halo.alpha = hoverProgress * hoverProgress;
          halo.scale.set(lerp(0.8, 1.0, hoverProgress));
        },
      },
      true
    );
    this.pad.buttonMode = false;
  }
}

export module RailroaderMedal {
  export enum TextureId {
    PadBasic = "ui-social/achievements/normal.png",
    PadHighlighted = "ui-social/achievements/gold.png",

    // ShineHalo rom("https://public.cx/3/halo-1.png",
    // ShineHalo rom("https://public.cx/3/flare-22.png",
    ShineHalo = "https://public.cx/3/flare-24.png",
    ShineGlow = "https://public.cx/3/radial-4.png",
  }
}
