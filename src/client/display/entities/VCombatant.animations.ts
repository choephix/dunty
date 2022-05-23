import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { VCombatant } from "@client/display/entities/VCombatant";

export module VCombatantAnimations {
  export function enter(unit: VCombatant) {
    const direction = unit.sprite.scale.x < 0 ? 1 : -1;
    const tweeener = new TemporaryTweeener(unit);
    return tweeener.from(unit, { pixi: { pivotX: direction * 200 } });
  }

  export async function die(unit: VCombatant) {
    const direction = unit.sprite.scale.x < 0 ? 1 : -1;
    const tweeener = new TemporaryTweeener(unit);
    await tweeener.to(unit, { pixi: { alpha: 0.2, pivotX: direction * 150 } });
    await tweeener.to(unit.healthIndicator, { alpha: 0.0 });
  }

  export async function hurt(unit: VCombatant) {
    const direction = unit.sprite.scale.x < 0 ? 1 : -1;
    const tweeener = new TemporaryTweeener(unit);
    await tweeener.to(unit, { pixi: { alpha: 0.6, pivotX: direction * 40 }, repeat: 1, yoyo: true, duration: 0.1 });
  }

  export async function buff(unit: VCombatant) {
    const direction = unit.sprite.scale.x < 0 ? 1 : -1;
    const tweeener = new TemporaryTweeener(unit);
    await tweeener.to(unit, { pixi: { pivotY: -direction * 40 }, repeat: 1, yoyo: true, duration: 0.1 });
  }
}
