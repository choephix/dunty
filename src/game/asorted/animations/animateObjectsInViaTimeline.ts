import type { DisplayObject } from "@pixi/display";
import type { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import type { gsap } from "gsap/gsap-core";

export function animateObjectsInViaTimeline(
  objects: [target: DisplayObject | undefined | null, vars: gsap.TweenVars, playHeadAdvance?: number][],
  tweeener: TemporaryTweeener,
  delay: number
) {
  const tl = tweeener.createTimeline();

  objects.forEach(([object]) => object && (object.visible = false));
  tl.delay(delay);

  let playHead = 0;
  for (const [object, vars, playHeadAdvance] of objects) {
    if (!object) continue;
    playHead += playHeadAdvance || 0;
    tl.call(() => void (object.visible = true), undefined, playHead);
    tl.from(object, vars, playHead);
  }

  return tl.play();
}
