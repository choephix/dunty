import { getRandomItemFrom } from "@sdk/helpers/arrays";
import { Card, CardTarget, Combatant } from "../state/CombatState";
import { CombatDriver } from "./CombatDriver";

export class CombatAI extends CombatDriver {
  chooseCardTargets(actor: Combatant, card: Card) {
    switch (card.target) {
      case CardTarget.SELF: {
        return [actor];
      }
      case CardTarget.ALL_ENEMIES: {
        return this.faq.getAliveEnemiesArray(actor);
      }
      case CardTarget.ALL: {
        return this.faq.getAliveAnyoneArray();
      }
      case CardTarget.ALL_ALLIES: {
        return this.faq.getAliveAlliesArray(actor);
      }
      case CardTarget.FRONT_ENEMY: {
        const foes = this.faq.getAliveEnemiesArray(actor);
        return foes.length > 0 ? [foes[0]] : [];
      }
      case CardTarget.TARGET_ENEMY: {
        const candidates = this.faq.getAliveEnemiesArray(actor);
        const choice = getRandomItemFrom(candidates);
        return choice ? [choice] : [];
      }
      case CardTarget.TARGET_ANYONE: {
        const candidates = this.faq.getAliveAnyoneArray();
        const choice = getRandomItemFrom(candidates);
        return choice ? [choice] : [];
      }
      default:
        console.error(`getValidTargetsArray: invalid target ${card.target}`);
        return [actor];
    }
  }
}
