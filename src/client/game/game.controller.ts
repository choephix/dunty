import { game } from "@client/main";
import { getRandomItemFrom } from "@sdk/helpers/arrays";
import { delay } from "@sdk/utils/promises";
import { range } from "@sdk/utils/range";
import { Card, CardPileType, CardTarget, Combatant, CombatantStatus, CombatGroup } from "./game";
import { generateDaggerCard } from "./game.factory";
import { StatusEffectBlueprints, StatusEffectExpiryType } from "./StatusEffectBlueprints";

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
      card.onDraw?.call(card, actor);
      await delay(0.07);
    }
    await assureDrawPileHasCards(actor);
  }

  export async function discardHand(actor: Combatant) {
    const { discardPile, hand } = actor.cards;
    while (hand.length > 0) {
      const card = hand[0];
      actor.cards.moveCardTo(card, discardPile);
      await delay(0.07);
    }
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

export module GameFAQ {
  function getEnemiesSide(actor: Combatant) {
    return game.sideA === actor.side ? game.sideB : game.sideA;
  }

  export function getAliveEnemiesArray(actor: Combatant) {
    return getEnemiesSide(actor).combatants.filter(u => u.alive);
  }

  export function getAliveAnyoneArray() {
    return [...game.sideA.combatants, ...game.sideB.combatants].filter(u => u.alive);
  }

  export function getValidTargetsArray(actor: Combatant, card: Card): Combatant[] {
    switch (card.target) {
      case CardTarget.SELF:
        return [actor];
      case CardTarget.ALL_ENEMIES:
        return getAliveEnemiesArray(actor);
      case CardTarget.ALL:
        return getAliveAnyoneArray();
      case CardTarget.FRONT_ENEMY:
        const foes = getAliveEnemiesArray(actor);
        return foes.length > 0 ? [foes[0]] : [];
      case CardTarget.TARGET_ENEMY:
        return getAliveEnemiesArray(actor);
      default:
        throw new Error(`getValidTargetsArray: invalid target ${card.target}`);
    }
  }

  export function getPileType(actor: Combatant, type: CardPileType) {
    switch (type) {
      case CardPileType.DRAW: return actor.cards.drawPile;
      case CardPileType.HAND: return actor.cards.hand;
      case CardPileType.DISCARD: return actor.cards.discardPile;
      case CardPileType.VOID: return actor.cards.void;
    }
  }
}

export module CombatantAI {
  export function chooseCardTargets(actor: Combatant, card: Card) {
    switch (card.target) {
      case CardTarget.SELF: {
        return [actor];
      }
      case CardTarget.ALL_ENEMIES: {
        return GameFAQ.getAliveEnemiesArray(actor);
      }
      case CardTarget.ALL: {
        return GameFAQ.getAliveAnyoneArray();
      }
      case CardTarget.FRONT_ENEMY: {
        const foes = GameFAQ.getAliveEnemiesArray(actor);
        return foes.length > 0 ? [foes[0]] : [];
      }
      case CardTarget.TARGET_ENEMY: {
        const candidates = GameFAQ.getAliveEnemiesArray(actor);
        const choice = getRandomItemFrom(candidates);
        return choice ? [choice] : [];
      }
      case CardTarget.TARGET_ANYONE: {
        const candidates = GameFAQ.getAliveAnyoneArray();
        const choice = getRandomItemFrom(candidates);
        return choice ? [choice] : [];
      }
      default:
        console.error(`getValidTargetsArray: invalid target ${card.target}`);
        return [actor];
    }
  }
}
