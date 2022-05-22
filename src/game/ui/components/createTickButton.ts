import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { buttonizeInstance } from "@sdk-ui/buttonize";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";

export function createTickButton(tint?: number) {
  const container = new Container();

  const PAD_SCALE = 0.7;

  const outerPadTexture = Texture.from("ui-common/dot-btn-outer.png");
  const outerPad = new Sprite(outerPadTexture);
  outerPad.anchor.set(0.5);
  outerPad.scale.set(PAD_SCALE);
  container.addChild(outerPad);

  const innerPadTextureId = isNaN(tint!) ? "ui-common/dot-btn-inner.png" : "ui-common/dot-btn-inner-white.png";
  const innerPadTexture = Texture.from(innerPadTextureId);
  const innerPad = new Sprite(innerPadTexture);
  innerPad.tint = tint ?? 0xffffff;
  innerPad.anchor.set(0.5);
  innerPad.scale.set(PAD_SCALE);
  container.addChild(innerPad);

  const iconTexture = Texture.from("ui-common/icon-check.png");
  const icon = new Sprite(iconTexture);
  icon.scale.set(40 / Math.max(icon.texture.width, icon.texture.height));
  icon.anchor.set(0.5);
  icon.alpha = 0.83;
  container.addChild(icon);

  const tweeener = new TemporaryTweeener(outerPad);

  function createShowAnimation() {
    const tl = tweeener.createTimeline();
    const finalScale = container.scale.x;

    tl.fromTo(
      container,
      {
        pixi: {
          scale: 0,
          alpha: 0,
        },
      },
      {
        pixi: {
          scale: finalScale,
          alpha: 1,
        },
        duration: 0.289,
        ease: "back.out",
      },
      0
    );

    tl.fromTo(
      container,
      {
        rotation: -0.4 * Math.PI,
      },
      {
        rotation: 0,
        duration: 1.2,
        ease: "elastic.out(.7)",
      },
      0
    );

    return tl;
  }
  function playShowAnimation() {
    return createShowAnimation().play();
  }
  function playHideAnimation() {
    return tweeener.to(container, { scale: 0, alpha: 0, duration: 0.289, ease: "back.in" });
  }

  const button = buttonizeInstance(container, {
    name: "tickButton",
    tweeener,
    createShowAnimation,
    playShowAnimation,
    playHideAnimation,
  });

  return button;
}

export type TickButton = ReturnType<typeof createTickButton>;
