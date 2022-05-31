import { VScene } from "@client/common/display/VScene";
import { GameSingletons } from "@client/core/GameSingletons";
import { BLEND_MODES } from "@pixi/constants";
import { Sprite } from "@pixi/sprite";
import { TilingSprite } from "@pixi/sprite-tiling";
import { EnchantmentGlobals } from "@sdk/pixi/enchant/EnchantmentGlobals";

const BACKDROP_PRESETS = [
  [`https://public.cx/dunty/bg-1920x1920/4.jpg`, 0xc0d0f0, true, BLEND_MODES.SUBTRACT, 0xffffff, 0.2] as const, // Slope
  [`https://public.cx/3/bg/grid2.webp`, 0x404050, true, BLEND_MODES.ADD, 0xf03030, 0.3] as const, // Grid
];

export class VCombatScene extends VScene {
  readonly backdrop;
  readonly ln;

  constructor() {
    super();

    const BACKDROP_PRESET_INDEX = 0;
    const [backdropTextureId, backdropTint, backdropStretch, lnBlendMode, lnTint, lnAlpha] =
      BACKDROP_PRESETS[BACKDROP_PRESET_INDEX];

    {
      this.backdrop = Sprite.from(backdropTextureId);
      this.backdrop.anchor.set(0.5);
      this.backdrop.position.set(this.designWidth / 2, this.designHeight / 2);
      this.backdrop.tint = backdropTint;
      this.addChild(this.backdrop);
      Object.assign(this.backdrop, {
        onEnterFrame(this: Sprite) {
          const app = GameSingletons.getPixiApplicaiton();
          const { width, height } = app.screen;
          if (backdropStretch) {
            const scaleX = width / this.texture.width / this.parent.scale.x;
            const scaleY = height / this.texture.height / this.parent.scale.y;
            this.scale.set(scaleX, scaleY);
          } else {
            this.scale.set(1);
          }
        },
      });
    }

    {
      this.ln = this.addStreakyEffect({ lnBlendMode, lnTint, lnAlpha });
      this.ln.visible = false;
    }
  }

  addStreakyEffect({ lnBlendMode = BLEND_MODES.SUBTRACT, lnTint = 0x808080, lnAlpha = 1.0 } = {}) {
    const lnTextureId = "https://public.cx/mock/ln2.jpg";
    const sprite = TilingSprite.from(lnTextureId, { width: this.designWidth, height: this.designHeight });
    sprite.blendMode = lnBlendMode;
    sprite.tint = lnTint;
    sprite.scale.y = 2;
    sprite.tileScale.y = 10;
    sprite.alpha = lnAlpha;
    this.addChild(sprite);
    return Object.assign(sprite, {
      onEnterFrame: () => (sprite.tilePosition.y -= EnchantmentGlobals.timeDelta60 * 80),
    });
  }
}
