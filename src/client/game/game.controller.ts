import { delay } from "@sdk/utils/promises";
import { range } from "@sdk/utils/range";
import { Combatant, CombatantStatus, CombatGroup, IWithCards } from "./game";
import { generateDaggerCard } from "./game.factory";
import { StatusEffectBlueprints, StatusEffectExpiryType } from "./StatusEffectBlueprints";

export module GameController {
  async function assureDrawPileHasCards(actor: IWithCards) {
    if (actor.drawPile.length === 0) {
      while (actor.discardPile.length > 0) {
        const card = actor.discardPile.pop()!;
        actor.drawPile.push(card);
        await delay(0.07);
      }
    }
  }

  export async function drawCards(count: number, actor: IWithCards) {
    for (const _ of range(count)) {
      await assureDrawPileHasCards(actor);
      const card = actor.drawPile.pop()!;
      actor.hand.unshift(card);
      await delay(0.07);
    }
    await assureDrawPileHasCards(actor);
  }

  export async function discardHand(actor: IWithCards) {
    while (actor.hand.length > 0) {
      const card = actor.hand.pop()!;
      actor.discardPile.push(card);
      await delay(0.07);
    }
  }

  export async function activateCombatantTurnStartStatusEffects(side: CombatGroup) {
    const dict: Partial<Record<keyof CombatantStatus, (unit: Combatant) => void>> = {
      regeneration: u => (u.status.health += u.status.regeneration),
      tactical: u => drawCards(u.status.tactical, u),
      daggers: u => range(u.status.daggers).forEach(() => u.hand.push(generateDaggerCard())),
      burning: u => (u.status.health -= u.status.burning),
      poisoned: u => (u.status.health -= u.status.poisoned),
      bleeding: u => (u.status.health -= u.status.bleeding),
    };
    for (const unit of side.combatants) {
      for (const [key, func] of CombatantStatus.entries(dict)) {
        if (unit.status[key] > 0) {
          func?.(unit);
          await delay(0.3);
        }
      }
    }
  }

  export async function resetCombatantsForTurnStart(side: CombatGroup) {
    for (const unit of side.combatants) {
      for (const [key] of CombatantStatus.entries(unit.status)) {
        if (key === "health") continue;
        const expiryType = StatusEffectBlueprints[key].expiryType;
        switch (expiryType) {
          case StatusEffectExpiryType.RESET_BEFORE_TURN: {
            unit.status[key] = 0;
            break;
          }
          case StatusEffectExpiryType.DECREMENT_BEFORE_TURN: {
            unit.status[key] = Math.max(0, unit.status[key] - 1);
            break;
          }
        }
      }
    }
  }
}
