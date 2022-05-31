import { VScene } from "@client/common/display/VScene";
import { GameSingletons } from "@client/core/GameSingletons";
import { BLEND_MODES } from "@pixi/constants";
import { Sprite } from "@pixi/sprite";
import { TilingSprite } from "@pixi/sprite-tiling";

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

    {
      const [backdropTextureId, backdropTint, backdropStretch, lnBlendMode, lnTint, lnAlpha] =
        BACKDROP_PRESETS[BACKDROP_PRESET_INDEX];
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

      const lnTextureId = "https://public.cx/mock/ln2.jpg";
      this.ln = TilingSprite.from(lnTextureId, { width: this.designWidth, height: this.designHeight });
      this.ln.blendMode = lnBlendMode;
      this.ln.tint = lnTint;
      this.ln.scale.y = 2;
      this.ln.tileScale.y = 4;
      this.ln.alpha = lnAlpha;
      this.addChild(this.ln);
    }

    this.ln.visible = false;
  }
}
