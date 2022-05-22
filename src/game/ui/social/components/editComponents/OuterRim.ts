import { GameSingletons } from "@game/app/GameSingletons";
import { GlowFilterService } from "@game/ui/fx/GlowFilterService";
import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { SafeScrollbox } from "@sdk-pixi/display/SafeScrollbox";
import { AvatarBadgeElements } from "@game/ui/social/avatar/AvatarBadgeElements";

export class OuterRim extends SafeScrollbox {
  glowServiceEquip: GlowFilterService = new GlowFilterService({ color: 0xffffff });
  glowServiceSelect: GlowFilterService = new GlowFilterService();
  selectedRim?: Sprite;
  onRimSelected?: (rim: string) => void;

  constructor() {
    super({
      noTicker: true,
      boxWidth: 435,
      boxHeight: 215,
      stopPropagation: true,
      divWheel: GameSingletons.getGameContext().app.view,
      overflowY: "none",
      dragScroll: false,
    });
  }

  async addRims(rims: Array<{ texture: string; canUse: boolean }>, equippedRim: Sprite) {
    let startX = 115;
    for (let rim of rims) {
      //// Create and add frame sprite
      const sprite = new Sprite(await Texture.fromURL(AvatarBadgeElements.getNameplateTextureId(rim.texture)));
      sprite.rotation = 1.5708;
      sprite.scale.set(0.5);
      sprite.position.set(startX, 0);
      this.content.addChild(sprite);
      if (rim.canUse) {
        sprite.interactive = true;
        sprite.buttonMode = true;
        //// Add frame selection events
        sprite.on("pointerdown", () => {
          if (this.selectedRim) this.glowServiceSelect.removeFrom(this.selectedRim);
          this.selectedRim = sprite;
          this.glowServiceSelect.addFilter(sprite);
          this.onRimSelected?.(rim.texture);
        });
      }

      startX += 150;
      //// Set white glow on equipped frame
      if (equippedRim.texture == sprite.texture) {
        this.glowServiceEquip.addFilter(sprite);
      }
    }
    this.changeColor(equippedRim.tint);
    this.update();
  }

  changeColor(newColor: number) {
    for (const child of this.content.children) {
      (child as Sprite).tint = newColor;
    }
  }
}
