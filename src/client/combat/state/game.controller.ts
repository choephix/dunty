import { delay } from "@sdk/utils/promises";
import { range } from "@sdk/utils/range";
import { Card, CardPileType, Combatant, CombatantStatus, CombatGroup } from "@client/combat/state/game";
import { generateDaggerCard } from "@client/combat/state/game.factory";
import { GameFAQ } from "@client/combat/state/game.faq";
import { StatusEffectBlueprints, StatusEffectExpiryType } from "@client/combat/state/StatusEffectBlueprints";

export module GameController {
  async function assureDrawPileHasCards(actor: Combatant) {
    const { drawPile, discardPile } = actor.cards;
    if (drawPile.length === 0) {
      while (discardPile.length > 0) {
        const card = discardPile[0];
        actor.cards.moveCardTo(card, drawPile);
        await delay(0.07);
      }
    }
  }

  export async function drawCards(count: number, actor: Combatant) {
    const { drawPile, hand } = actor.cards;
    for (const _ of range(count)) {
      await assureDrawPileHasCards(actor);
      const card = drawPile[0];
      if (!card) return console.error("drawCards: drawPile is empty");
      actor.cards.moveCardTo(card, hand);
      if (card.onDraw) {
        card.onDraw.call(card, actor);
        await delay(0.25);
      }
      await delay(0.07);
    }
    await assureDrawPileHasCards(actor);
  }

  export async function discardHand(actor: Combatant) {
    const { hand } = actor.cards;
    while (hand.length > 0) {
      await discardCard(hand[0], actor);
      await delay(0.07);
    }
  }

  export async function discardCard(card: Card, actor: Combatant) {
    const toPile = GameFAQ.getPileType(actor, card.gotoAfterDiscard || CardPileType.DISCARD);
    actor.cards.moveCardTo(card, toPile);
  }

  export async function disposeCardAfterPlay(card: Card, actor: Combatant) {
    const toPile = GameFAQ.getPileType(actor, card.gotoAfterPlay || CardPileType.DISCARD);
    toPile.push(card);
  }

  export async function activateCombatantTurnStartStatusEffects(side: CombatGroup) {
    const dict: Partial<Record<keyof CombatantStatus, (unit: Combatant) => void>> = {
      regeneration: u => (u.status.health += u.status.regeneration),
      tactical: u => drawCards(u.status.tactical, u),
      daggers: u => range(u.status.daggers).forEach(() => u.cards.hand.push(generateDaggerCard())),
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