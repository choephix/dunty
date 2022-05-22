import { Texture } from "@pixi/core";
import { NineSlicePlane } from "@pixi/mesh-extras";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";

const defaults = {
  topHeight: 0,
  bottomHeight: 0,
  leftWidth: 0,
  rightWidth: 0,
};

export class StationPopupBackground extends NineSlicePlane {
  private readonly tweeener = new TemporaryTweeener(this);

  public hasBeenSetAtLeastOnce = false;

  constructor() {
    super(Texture.WHITE, 4, 4, 4, 4);
  }

  public setTexture(textureId: string, mods: Partial<StationPopupBackground> = {}) {
    this.hasBeenSetAtLeastOnce = true;

    Object.assign(this, defaults, mods);

    const texture = Texture.from(textureId);
    this.texture = texture;
    this.width = texture.width;
    this.height = texture.height;
    this.textureUpdated();
    this.updateHorizontalVertices();
  }

  public animateBackgroundChange(textureId: string, mods: Partial<StationPopupBackground> = {}) {
    this.hasBeenSetAtLeastOnce = true;

    const duration = 0.57;
    const prevTexture = this.texture;
    const fady = new NineSlicePlane(prevTexture, this.leftWidth, this.topHeight, this.rightWidth, this.bottomHeight);
    this.addChild(fady);

    this.setTexture(textureId, mods);
    const texture = this.texture;

    const tl = this.tweeener.createTimeline();
    tl.to(
      fady,
      {
        alpha: 0,
        delay: duration * 0.5,
        duration: duration * 0.495,
        ease: "power2.out",
      },
      0
    );
    tl.fromTo(
      [this, fady],
      {
        width: prevTexture.width,
        height: prevTexture.height,
      },
      {
        width: texture.width,
        height: texture.height,
        ease: "back.inOut",
        duration,
        onComplete: () => {
          this.removeChild(fady);
          fady.destroy(true);
        },
      },
      0
    );
    return tl.play();
  }

  public setBackgroundFolded() {
    const foldedHeight = this.topHeight + this.bottomHeight;
    this.height = foldedHeight;
  }

  public animateBackgroundUnfold(duration = 0.32) {
    const texture = this.texture;
    const foldedHeight = this.topHeight + this.bottomHeight;

    return this.tweeener.fromTo(
      this,
      {
        height: foldedHeight,
      },
      {
        height: texture.height,
        ease: "power2.inOut",
        duration,
      }
    );
  }
}
