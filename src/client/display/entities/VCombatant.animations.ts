import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { VCombatant } from "@client/display/entities/VCombatant";
import { spawnSpriteWave } from "@game/asorted/animations/spawnSpriteWave";
import { BLEND_MODES } from "@pixi/constants";
import { Container } from "@pixi/display";
import { delay } from "@sdk/utils/promises";

function spawnBlobOfLight(parent: Container, tint: number) {
  const fx = spawnSpriteWave(
    "https://public.cx/3/radial-4.png",
    { pixi: { scale: 2.7 } },
    { tint: tint, blendMode: BLEND_MODES.ADD }
  );
  return parent.addChild(fx);
}

function spawnFlazma(parent: Container, tint: number, scale: number = 0.7) {
  const fx = spawnSpriteWave(
    "https://public.cx/3/plazmo-6.png",
    { pixi: { scale } },
    { tint: tint, blendMode: BLEND_MODES.ADD }
  );
  return parent.addChild(fx);
}

function spawnFlare1(parent: Container, tint: number) {
  const fx = spawnSpriteWave(
    "https://public.cx/2/ring-w.png",
    { pixi: { scale: 0.99 }, duration: 3 },
    { tint: tint, blendMode: BLEND_MODES.ADD }
  );
  return parent.addChild(fx);
}

export module VCombatantAnimations {
  export function enter(unit: VCombatant) {
    const direction = unit.sprite.scale.x < 0 ? 1 : -1;
    const tweeener = new TemporaryTweeener(unit);
    return tweeener.from(unit, {
      pixi: { pivotX: direction * 200 },
    });
  }

  export async function attack(unit: VCombatant, target?: VCombatant) {
    const direction = unit.sprite.scale.x < 0 ? 1 : -1;
    const tweeener = new TemporaryTweeener(unit);
    await tweeener.to(unit, {
      pixi: { alpha: 0.6, pivotX: -direction * 140 },
      repeat: 1,
      yoyo: true,
      duration: 0.15,
      ease: `power2.in`,
    });
  }

  export async function spellBegin(unit: VCombatant) {
    const tweeener = new TemporaryTweeener(unit);
    await tweeener.to(unit, {
      pixi: { pivotY: 4 },
      repeat: 1,
      yoyo: true,
      duration: 0.1,
      ease: `power.out`,
    });
    await delay(0.1);
  }

  export async function buff(unit: VCombatant) {
    spawnBlobOfLight(unit, 0x0603ff);
    // spawnFlazma(unit, 0x0906ff, );
    // spawnFlare1(unit, 0xFFFFFF);
    await delay(0.1);
  }

  export async function buffHealth(unit: VCombatant) {
    spawnFlare1(unit, 0xffffff);
    spawnBlobOfLight(unit, 0x91f140);
    await delay(0.2);
  }

  export async function buffRetaliation(unit: VCombatant) {
    spawnBlobOfLight(unit, 0xff0000);
    spawnFlazma(unit, 0x902040, 1.2);
    await delay(0.2);
  }

  export async function buffBlock(unit: VCombatant) {
    const fx = spawnSpriteWave(
      "https://public.cx/dunty/asorted/shield.png",
      { pixi: { scale: 1.2 } },
      { tint: 0x5090f0, blendMode: BLEND_MODES.ADD }
    );
    unit.addChild(fx);

    const tweeener = new TemporaryTweeener(unit);
    await tweeener.to(unit, {
      pixi: { pivotY: 10 },
      repeat: 1,
      yoyo: true,
      duration: 0.15,
      ease: `power2.in`,
    });
  }

  export async function hurt(unit: VCombatant) {
    const direction = unit.sprite.scale.x < 0 ? 1 : -1;
    const tweeener = new TemporaryTweeener(unit);
    await tweeener.to(unit, {
      pixi: { alpha: 0.6, pivotX: direction * 40 },
      repeat: 1,
      yoyo: true,
      delay: 0.1,
      duration: 0.1,
      ease: `power2.out`,
    });
  }

  export async function die(unit: VCombatant) {
    const direction = unit.sprite.scale.x < 0 ? 1 : -1;
    const tweeener = new TemporaryTweeener(unit);
    await tweeener.to(unit, {
      pixi: { alpha: 0.2, pivotX: direction * 150 },
    });
    await tweeener.to(unit.healthIndicator, { alpha: 0.0 });
  }
}
