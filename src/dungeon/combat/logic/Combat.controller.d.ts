import { Card, Combatant, CombatantStatus, CombatGroup } from "@dungeon/combat/state/CombatState";
import { FloorConfig } from "../../run/FloorConfig";
import { CombatDriver } from "./CombatDriver";
import { UserCrossCombatData } from "@dungeon/run/UserCrossCombatData";
/**
 * Commoon actions and actions steps.
 *
 * This is the proper way to mutate combat state,
 * as opposed to modifying it directly.
 */
export declare class CombatController extends CombatDriver {
    start(userRunData: UserCrossCombatData, floorConfig: FloorConfig): void;
    assureDrawPileHasCards(actor: Combatant): Promise<void>;
    drawCards(count: number, actor: Combatant): Promise<void>;
    discardHand(actor: Combatant): Promise<void>;
    discardCard(card: Card, actor: Combatant): Promise<void>;
    disposeCardAfterPlay(card: Card, actor: Combatant): Promise<void>;
    activateCombatantTurnStartStatusEffects(side: CombatGroup): Promise<void>;
    resetCombatantsForTurnStart(side: CombatGroup): Promise<void>;
    dealDamage(target: Combatant, directDamage: number, blockDamage?: number): void;
    heal(combatant: Combatant, amount: number): void;
    decrementStatus(status: Combatant | CombatantStatus, key: keyof CombatantStatus): void;
    changeStatus(status: Combatant | CombatantStatus, key: keyof CombatantStatus, delta: number): void;
    resetStatus(status: Combatant | CombatantStatus, key: keyof CombatantStatus): void;
}
