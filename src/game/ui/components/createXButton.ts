import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { buttonizeInstance } from "@sdk-ui/buttonize";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";

export function createXButton(tint?: number) {
  const container = new Container();

  const PAD_SCALE = 0.7;

  const innerPadTextureId = isNaN(tint!) ? "ui-common/dot-btn-outer.png" : "ui-common/dot-btn-outer-grey.png";
  const outerPadTexture = Texture.from(innerPadTextureId);
  const outerPad = new Sprite(outerPadTexture);
  outerPad.tint = tint ?? 0xffffff;
  outerPad.anchor.set(0.5);
  outerPad.scale.set(PAD_SCALE);
  container.addChild(outerPad);

  const innerPadTexture = Texture.from("ui-common/dot-btn-inner.png");
  const innerPad = new Sprite(innerPadTexture);
  innerPad.anchor.set(0.5);
  innerPad.scale.set(PAD_SCALE);
  container.addChild(innerPad);

  const iconTexture = Texture.from("ui-common/icon-x.png");
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

  const button = buttonizeInstance(container, {
    name: "xButton",
    createShowAnimation,
    playShowAnimation,
  });

  return button;
}

export type XButton = ReturnType<typeof createXButton>;
