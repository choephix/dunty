import { Card, CardPileType, Combatant, CombatGroup } from "@dungeon/combat/state/CombatState";
import { CombatDriver } from "./CombatDriver";
/**
 * Commoon getters, comparison logic, etc.
 *
 * No method here will mutate the combat state.
 */
export declare class CombatFAQ extends CombatDriver {
    isGroupAlive(g: CombatGroup): boolean;
    calculateCardsToDrawOnTurnStart(target: Combatant): number;
    calculateEnergyToAddOnTurnStart(target: Combatant): number;
    calculateBlockPointsToAdd(card: Card, target?: Combatant): number;
    calculateAttackPower(card: Card, attacker?: Combatant): number;
    calculateDamage(damage: number, target: Combatant, attacker: Combatant): {
        directDamage: number;
        blockedDamage: number;
        returnedDamage: number;
        healingDamage: number;
    };
    getEnemiesSide(actor: Combatant): CombatGroup;
    getAliveAlliesArray(actor: Combatant): Combatant[];
    getAliveEnemiesArray(actor: Combatant): Combatant[];
    getAliveAnyoneArray(): Combatant[];
    getValidTargetsArray(actor: Combatant, card: Pick<Card, "target">): Combatant[];
    getPileType(actor: Combatant, type: CardPileType): Card[];
}
