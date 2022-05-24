import { delay } from "@sdk/utils/promises";
import { range } from "@sdk/utils/range";
import { Card, Combatant, CombatantStatus, CombatSide } from "./game";

export module GameController {
  export async function drawCards(count: number, actor: { hand: Card[]; drawPile: Card[] }) {
    const cards = actor.drawPile.splice(0, count);
    for (const card of cards) {
      actor.hand.unshift(card);
      await delay(0.07);
    }
  }

  export async function discardHand(actor: { hand: Card[]; discardPile: Card[] }) {
    while (actor.hand.length > 0) {
      const card = actor.hand.pop()!;
      actor.discardPile.push(card);
      await delay(0.07);
    }
  }

  export async function activateCombatantTurnStartStatusEffects(side: CombatSide) {
    const dict: Partial<Record<keyof CombatantStatus, (unit: Combatant) => void>> = {
      regeneration: u => (u.status.health += u.status.regeneration),
      tactical: u => drawCards(u.status.tactical, side),
      daggers: u => range(u.status.daggers).forEach(() => side.hand.push({ cost: 0, type: "atk", value: 1 })),
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

  export async function resetCombatantsForTurnStart(side: CombatSide) {
    enum Action {
      Reset,
      Decrement,
    }
    const dict: Record<keyof CombatantStatus, Action | null> = {
      health: null,
      strength: null,
      defensive: null,
      block: Action.Reset, //
      retaliation: Action.Reset,
      reflect: Action.Reset,
      fury: Action.Reset,
      tactical: Action.Reset,
      protection: Action.Reset, //
      exposed: Action.Reset, // + to dmg received
      regeneration: Action.Decrement,
      taunt: Action.Decrement,
      leech: Action.Decrement,
      rage: Action.Decrement,
      haste: Action.Decrement,
      daggers: Action.Decrement,
      weak: Action.Decrement,
      brittle: Action.Decrement, // + to dmg received
      doomed: Action.Decrement,
      burning: Action.Decrement,
      poisoned: Action.Decrement,
      bleeding: Action.Decrement,
      stunned: Action.Decrement,
      frozen: Action.Decrement,
      wet: Action.Decrement,
      warm: Action.Decrement,
      oiled: Action.Decrement,
      cold: Action.Decrement,
    };
    for (const unit of side.combatants) {
      for (const [key] of CombatantStatus.entries(unit.status)) {
        switch (dict[key]) {
          case Action.Reset: {
            unit.status[key] = 0;
            break;
          }
          case Action.Decrement: {
            unit.status[key] = Math.max(0, unit.status[key] - 1);
            break;
          }
        }
      }
    }
  }
}
