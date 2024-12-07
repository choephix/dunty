import { Card, Combatant } from "../state/CombatState";
import { CombatDriver } from "./CombatDriver";
export declare class CombatAI extends CombatDriver {
    chooseCardTargets(actor: Combatant, card: Card): Combatant[];
}
