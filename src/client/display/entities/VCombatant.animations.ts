import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { VCombatant } from "@client/display/entities/VCombatant";

export module VCombatantAnimations {
  // export function playShowAnimation(unit: VCombatant) {
  //   const tweeener = new TemporaryTweeener(unit);
  //   return tweeener.from(unit, { alpha: 0 });
  // }

  export async function die(unit: VCombatant) {
    const tweeener = new TemporaryTweeener(unit);
    await tweeener.to(unit, { pixi: { alpha: 0.2, pivotX: -150 } });
    await tweeener.to(unit.healthIndicator, { alpha: 0.0 });
  }
}
