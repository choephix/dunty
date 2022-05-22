import { FontFamily } from "@game/constants/FontFamily";
import { Container } from "@pixi/display";
import { Text } from "@pixi/text";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";

export function createComingSoonMessage() {
  const container = new Container();
  const message = new Text(`🚂\nComing soon!`, {
    fontFamily: FontFamily.DanielBlack,
    fontSize: 18,
    fill: 0xb0b0b0,
    align: "center",
  });
  message.anchor.set(0.5);
  container.addChild(message);

  const tweeener = new TemporaryTweeener(container);
  function playShowAnimation() {
    return tweeener.from(message, {
      alpha: 0.0,
      duration: 2.43,
      ease: `power3.out`,
    });
  }

  return Object.assign(container, { playShowAnimation });
}
