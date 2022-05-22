import { getPlaceholderTexture } from "@game/assets/cards";
import { WRAP_MODES } from "@pixi/constants";
import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { Ease } from "@sdk/time/Ease";
import { createSimpleTweener } from "@sdk/time/SimpleTweener";
import { LoadingSpinnerSprite } from "../popups/station-dashboard-components/billboard/components/LoadingSpinnerSprite";
import { CardSprite } from "./CardSprite";

const EmptyTexture = Texture.EMPTY.clone();
EmptyTexture.baseTexture.wrapMode = WRAP_MODES.REPEAT;
EmptyTexture._frame.width = 512;
EmptyTexture._frame.height = 717;
EmptyTexture.updateUvs();

export class CardSpriteSkeletonOverlay extends Sprite {
  private spinner: Sprite;

  constructor(public readonly parent: CardSprite) {
    super(getPlaceholderTexture(parent.entity));

    this.spinner = new LoadingSpinnerSprite();
    this.spinner.y = -96;
    this.spinner.alpha = LoadingSpinnerSprite.MAX_ALPHA;
    this.spinner.position.set(this.texture.width / 2, this.texture.height / 2);
    this.addChild(this.spinner);
  }

  public hideAndDestroy() {
    const ani = createSimpleTweener();
    return ani
      .tween(
        p => {
          this.alpha = 1.0 - p;
          this.spinner.alpha = LoadingSpinnerSprite.MAX_ALPHA * Math.pow(this.alpha, 4);
        },
        {
          duration: 0.92,
          easeFunc: Ease.OutSine,
        }
      )
      .then(() => {
        !this.destroyed && this.destroy();
      });
  }
}
