import { Card, CardPileType, CardTarget, Combatant, CombatGroup } from "@client/combat/state/CombatState";
import { CombatDriver } from "./CombatDriver";

/**
 * Commoon getters, comparison logic, etc.
 * 
 * No method here will mutate the combat state.
 */
export class CombatFAQ extends CombatDriver {
  isGroupAlive(g: CombatGroup) {
    return g.combatants.some(c => c.status.health > 0);
  }

  calculateCardsToDrawOnTurnStart(target: Combatant) {
    return target.handReplenishCount + target.status.tactical;
  }

  calculateEnergyToAddOnTurnStart(target: Combatant) {
    return target.energyReplenishCount + target.status.haste;
  }

  calculateBlockPointsToAdd(card: Card, target?: Combatant) {
    if (card.type !== "def") return 0;

    let value = card.value || 0;

    if (target) {
      value += target.status.defensive || 0;
    }

    return value;
  }

  calculateAttackPower(card: Card, attacker?: Combatant, target?: Combatant) {
    if (card.type !== "atk") return 0;

    let value = card.value || 0;
    if (attacker) {
      value += attacker.status.strength || 0;
      value += attacker.status.rage || 0;
      value += attacker.status.fury || 0;
      value -= attacker.status.weak || 0;
    }

    if (target) {
      value += target.status.brittle || 0;
      value *= target.status.exposed > 0 ? 2.0 : 1;
      value *= target.status.doomed > 0 ? 2.0 : 1;
    }

    return value;
  }

  calculateDamage(damage: number, target: Combatant, attacker: Combatant) {
    let blockedDamage = 0;
    let reflectedDamage = 0;
    let directDamage = 0;
    let healingDamage = 0;

    const { leech = 0 } = attacker.status;
    const { block = 0, retaliation = 0, parry = 0, reflect = 0, health } = target.status;

    if (reflect > 0) {
      return {
        directDamage: 0,
        blockedDamage: 0,
        reflectedDamage: damage,
        healingDamage: 0,
      };
    }

    directDamage = damage;

    if (target.status.block > 0) {
      blockedDamage = Math.min(block, damage);
      directDamage -= blockedDamage;
    }

    if (parry > 0) {
      reflectedDamage = Math.min(parry, damage);
      directDamage -= reflectedDamage;
    }

    reflectedDamage += retaliation;

    if (directDamage < 0) {
      directDamage = 0;
    }

    healingDamage = Math.min(directDamage, leech, health);

    console.log({
      damage,
      directDamage,
      blockedDamage,
      reflectedDamage,
      healingDamage,
      block,
      retaliation,
      parry,
      leech,
      target,
    });

    return { directDamage, blockedDamage, reflectedDamage, healingDamage };
  }
  
  getEnemiesSide(actor: Combatant) {
    return this.state.groupA === actor.group ? this.state.groupB : this.state.groupA;
  }

  getAliveAlliesArray(actor: Combatant) {
    return actor.group.combatants.filter(u => u.alive);
  }

  getAliveEnemiesArray(actor: Combatant) {
    return this.getEnemiesSide(actor).combatants.filter(u => u.alive);
  }

  getAliveAnyoneArray() {
    return [...this.state.groupA.combatants, ...this.state.groupB.combatants].filter(u => u.alive);
  }

  getValidTargetsArray(actor: Combatant, card: Pick<Card, "target">): Combatant[] {
    switch (card.target) {
      case CardTarget.SELF:
        return [actor];
      case CardTarget.ALL_ENEMIES:
        return this.getAliveEnemiesArray(actor);
      case CardTarget.ALL:
        return this.getAliveAnyoneArray();
      case CardTarget.FRONT_ENEMY:
        const foes = this.getAliveEnemiesArray(actor);
        return foes.length > 0 ? [foes[0]] : [];
      case CardTarget.TARGET_ENEMY:
        return this.getAliveEnemiesArray(actor);
      case CardTarget.ALL_ALLIES:
        return this.getAliveAlliesArray(actor);
      default:
        throw new Error(`getValidTargetsArray: invalid target ${card.target}`);
    }
  }

  getPileType(actor: Combatant, type: CardPileType) {
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
