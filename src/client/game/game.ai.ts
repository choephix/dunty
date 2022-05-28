import { getRandomItemFrom } from "@sdk/helpers/arrays";
import { Card, CardTarget, Combatant } from "./game";
import { GameFAQ } from "./game.faq";

export module CombatAI {
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
      case CardTarget.ALL_ALLIES: {
        return GameFAQ.getAliveAlliesArray(actor);
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
