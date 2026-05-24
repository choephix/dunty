import { spriteFromUrl, tilingSpriteFromUrl } from "@sdk-pixi/assets/loadTexture";
import { VScene } from "@dungeon/common/display/VScene";
import { GameSingletons } from "@dungeon/core/GameSingletons";

import { Sprite } from "pixi.js";
import { EnchantmentGlobals } from "@sdk/pixi/enchant/EnchantmentGlobals";

const BACKDROP_PRESETS = [
  [`https://undroop-assets.web.app/blackbeard/bg-1920x1920/4.jpg`, 0xc0d0f0, true, "subtract", 0xffffff, 0.2] as const, // Slope
  [`https://undroop-assets.web.app/davinci/3/bg/grid2.webp`, 0x404050, true, "add", 0xf03030, 0.3] as const, // Grid
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
      this.backdrop = spriteFromUrl(backdropTextureId);
      this.backdrop.anchor.set(0.5);
      this.backdrop.position.set(this.designWidth / 2, this.designHeight / 2);
      this.backdrop.tint = backdropTint;
      this.addChild(this.backdrop);
      Object.assign(this.backdrop, {
        onEnterFrame(this: Sprite) {
          const app = GameSingletons.getPixiApplicaiton();
          const { width, height } = app.screen;
          if (backdropStretch) {
            const scaleX = width / this.texture.width / (this.parent?.scale.x ?? 1);
            const scaleY = height / this.texture.height / (this.parent?.scale.y ?? 1);
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

  addStreakyEffect({ lnBlendMode = "subtract", lnTint = 0x808080, lnAlpha = 1.0 } = {}) {
    const lnTextureId = "https://undroop-assets.web.app/confucius/ln2.jpg";
    const sprite = tilingSpriteFromUrl(lnTextureId, { width: this.designWidth, height: this.designHeight });
    sprite.blendMode = lnBlendMode as any;
    sprite.tint = lnTint;
    sprite.scale.y = 2;
    sprite.tileScale.y = 10;
    sprite.alpha = lnAlpha;
    this.addChild(sprite);
    return Object.assign(sprite, {
      onEnterFrame: () => (sprite.tilePosition.y -= EnchantmentGlobals.timeDelta60 * 80),
    });
  }

  focusOn(target: number) {
    

  }
}
