import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";

export class CTPartsListBackground extends Container {
  private readonly assets = GameSingletons.getResources();
  private readonly tweeener = new TemporaryTweeener(this);

  constructor() {
    super();

    const bg = new Sprite(this.assets.getTexture("windowListPadBig"));
    bg.scale.set(2);
    this.addChild(bg);
    this.name = "CTPartsBackground";
    this.position.set(192, 324);
  }

  public playShowAnimation() {
    return this.tweeener.from(this, {
      pixi: {
        pivotX: 100,
        alpha: 0,
      },
      duration: 0.37,
      ease: "power3.out",
    });
  }

  public playHideAnimation() {
    return this.tweeener.to(this, {
      pixi: {
        pivotX: 100,
        alpha: 0,
      },
      duration: 0.19,
      ease: "power.in",
    });
  }
}
