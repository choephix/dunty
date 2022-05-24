import { delay } from "@sdk/utils/promises";
import { Card, CombatSide } from "./game";

export module GameController {
  export async function drawCards(count: number, actor: { hand: Card[], drawPile: Card[] }) {
    const cards = actor.drawPile.splice(0, count);
    for (const card of cards) {
      actor.hand.unshift(card);
      await delay(0.07);
    }
  }

  export async function discardHand(actor: { hand: Card[], discardPile: Card[] }) {
    while (actor.hand.length > 0) {
      const card = actor.hand.pop()!;
      actor.discardPile.push(card);
      await delay(0.07);
    }
  }

  export async function resetCombatantsForTurnStart(side: CombatSide) {
    for (const unit of side.combatants) {
      unit.status.retaliation = 0;
      unit.status.block = 0;
    }
  }
}
