import { GameContext } from "@game/app/app";
import { Container } from "@pixi/display";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";

export function makeRevolvingTocIcon({ assets, ticker }: GameContext) {
  // const partInner = assets.makeSprite('ui-icons/toc-logo/part-inner.png');
  // const partOuter = assets.makeSprite('ui-icons/toc-logo/part-outer.png');
  const partInner = assets.makeSprite("tocIconPartInner");
  const partOuter = assets.makeSprite("tocIconPartOuter");

  partInner.anchor.set(0.5);
  partOuter.anchor.set(0.5);

  const container = new Container();
  container.addChild(partInner, partOuter);

  const tweeener = new TemporaryTweeener(container);
  tweeener.add(dt => void (partOuter.rotation -= 0.05 * dt));

  return container;
}
