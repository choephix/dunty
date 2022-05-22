import { __window__ } from "@debug/__";
import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { BLEND_MODES } from "@pixi/constants";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { lerp, unlerp, unlerpClamped } from "@sdk/utils/math";

export class ExpansionArrow extends EnchantedContainer {
  private readonly context = GameSingletons.getGameContext();
  private readonly tweeener = new TemporaryTweeener(this);

  mouseIsOver = false;
  highlightContainer: Container;
  constructor(rarityString: string) {
    super();

    const { assets, utils } = this.context;

    const addArrowSprite = (textureName: string, parent: Container = this) => {
      const texture = assets.getTexture(textureName);
      const sprite = new Sprite(texture);
      sprite.pivot.set(texture.width / 2, texture.height / 1.75);
      sprite.scale.set(0.6);
      parent.addChild(sprite);
      return sprite;
    };

    // Add the arrow's base

    addArrowSprite("ui-popups/bigarrow/base-" + rarityString + ".png");
    addArrowSprite("ui-popups/bigarrow/arrows.png");

    // Add the arrow's highlights

    this.highlightContainer = new Container();
    this.addChild(this.highlightContainer);

    const highlightTextureIds = [
      "ui-popups/bigarrow/arrow-1.png",
      "ui-popups/bigarrow/arrow-2.png",
      "ui-popups/bigarrow/arrow-3.png",
    ];
    const highlights = highlightTextureIds.map(textureId => addArrowSprite(textureId, this.highlightContainer));

    // Animate the arrow's highlights

    const highlightsIndexPairs = [...highlights.entries()];
    utils.overrideRenderMethod(this, ({ totalSeconds }) => {
      if (!this.mouseIsOver) {
        const time = 0.0036 * totalSeconds;
        for (const [i, highlight] of highlightsIndexPairs) {
          const sin = Math.sin(time - 0.38 * i);
          highlight.alpha = unlerpClamped(0.73, 1.0, sin);
        }
      } else {
        const time = 0.015 * totalSeconds;
        for (const [i, highlight] of highlightsIndexPairs) {
          const sin = Math.sin(time - i);
          highlight.alpha = lerp(0.65, 1.0, unlerpClamped(-1.0, 1.0, sin));
        }
      }
    });
  }

  public playShowAnimation() {
    return this.tweeener.from(this, {
      // pixi: { scale: 0 },
      alpha: 0,
      duration: 0.54,
      ease: "power3.in",
    });
  }
}
