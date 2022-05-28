import { game } from "@client/main";
import { Card, CardPileType, CardTarget, Combatant } from "./game";

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
      case CardPileType.DRAW:
        return actor.cards.drawPile;
      case CardPileType.HAND:
        return actor.cards.hand;
      case CardPileType.DISCARD:
        return actor.cards.discardPile;
      case CardPileType.VOID:
        return actor.cards.void;
    }
  }
}
