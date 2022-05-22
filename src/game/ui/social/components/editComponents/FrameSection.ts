import { GameSingletons } from "@game/app/GameSingletons";
import { GlowFilterService } from "@game/ui/fx/GlowFilterService";
import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { SafeScrollbox } from "@sdk-pixi/display/SafeScrollbox";
import { AvatarBadgeElements } from "@game/ui/social/avatar/AvatarBadgeElements";

export class FrameSection extends SafeScrollbox {
  glowServiceEquip: GlowFilterService = new GlowFilterService({ color: 0xffffff });
  glowServiceSelect: GlowFilterService = new GlowFilterService();
  selectedFrame?: Sprite;
  onFrameSelected?: (frame: string) => void;
  constructor() {
    super({
      noTicker: true,
      boxWidth: 800,
      boxHeight: 300,
      stopPropagation: true,
      divWheel: GameSingletons.getGameContext().app.view,
      // overflowY: "none",
      // dragScroll: false,
    });
  }

  async addFrames(frames: Array<{ texture: string; canUse: boolean }>, equippedFrame: Sprite) {
    let startX = 0;
    for (let frame of frames) {
      //// Create and add frame sprite
      const sprite = new Sprite(await Texture.fromURL(AvatarBadgeElements.getFrameTextureId(frame.texture)));
      sprite.scale.set(0.25);
      sprite.x = startX;
      this.content.addChild(sprite);
      if (frame.canUse) {
        sprite.interactive = true;
        sprite.buttonMode = true;
        //// Add frame selection events
        sprite.on("pointerdown", () => {
          if (this.selectedFrame) this.glowServiceSelect.removeFrom(this.selectedFrame);
          this.selectedFrame = sprite;
          this.glowServiceSelect.addFilter(sprite);
          this.onFrameSelected?.(frame.texture);
        });
      }
      startX += 250;
      //// Set white glow on equipped frame
      if (equippedFrame.texture == sprite.texture) {
        this.glowServiceEquip.addFilter(sprite);
      }
    }
    this.changeColor(equippedFrame.tint);
    this.update();
  }

  changeColor(newColor: number) {
    for (const child of this.content.children) {
      (child as Sprite).tint = newColor;
    }
  }

  clearData() {
    const children = [...this.content.children];
    for (const child of children) {
      child.destroy({ children: true });
    }
  }
}
