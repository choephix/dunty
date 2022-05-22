import { Renderer } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { TextureCache } from "@pixi/utils";

export class LoadingSpinnerSprite extends Sprite {
  public static MAX_ALPHA = 0.1;

  constructor() {
    super(TextureCache["cardSpinner"]);
    this.anchor.set(0.5);
  }

  render(renderer: Renderer) {
    this.rotation += 0.0135;
    super.render(renderer);
  }
}
