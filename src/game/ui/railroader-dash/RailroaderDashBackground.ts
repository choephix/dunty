import { GameSingletons } from "@game/app/GameSingletons";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { EnchantmentGlobals } from "@sdk/pixi/enchant/EnchantmentGlobals";
import { TilingSpriteDimmer, TilingSpriteDimmerTemplates } from "../common/TilingSpriteDimmer";

type RailroaderDashBackgroundVortex = Container & {
  rotationSpeed: number;
  scaleMultiplier: number;
};

const VORTEX_ROTATION_SPEED_IDLE = -0.04;

export class RailroaderDashBackground extends EnchantedContainer {
  private readonly context = GameSingletons.getGameContext();

  dimmer: TilingSpriteDimmer;
  vortex: RailroaderDashBackgroundVortex;

  tweeener = new TemporaryTweeener(this);

  constructor() {
    super();

    const { assets } = this.context;

    this.dimmer = new TilingSpriteDimmer({
      ...TilingSpriteDimmerTemplates.SCANLINES,
    });
    this.addChild(this.dimmer);

    const vortexTexture = assets.getTexture("vortexBackground");
    this.vortex = Object.assign(new Sprite(vortexTexture), {
      rotationSpeed: VORTEX_ROTATION_SPEED_IDLE,
      scaleMultiplier: 1.0,
    });
    this.vortex.scale.set(1.5);
    this.vortex.pivot.set(vortexTexture.width / 2, vortexTexture.height / 2);
    this.addChild(this.vortex);

    this.onEnterFrame.add(() => {
      const { viewSize } = this.context;
      const screenCenter = {
        x: viewSize.width / 2,
        y: viewSize.height / 2,
      };

      this.vortex.scale.set((this.vortex.scaleMultiplier * viewSize.vmax) / 1440);
      this.vortex.position.set(screenCenter.x, screenCenter.y);
      this.vortex.rotation += this.vortex.rotationSpeed * EnchantmentGlobals.timeDelta;
    });
  }

  playShowAnimation() {
    this.dimmer.show();
    return this.tweeener.from(this.vortex, {
      rotationSpeed: -5,
      scaleMultiplier: 2.0,
      alpha: 0.0,
      duration: 0.8,
      ease: "power2.out",
    });
  }

  playHideAnimation() {
    this.dimmer.hide();
    return this.tweeener.to(this.vortex, {
      rotationSpeed: -5,
      scaleMultiplier: 2.0,
      alpha: 0.0,
      duration: 0.478,
      ease: "power2.out",
    });
  }
}
