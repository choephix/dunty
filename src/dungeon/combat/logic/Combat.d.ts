import { CombatController } from "@dungeon/combat/logic/Combat.controller";
import { CombatFAQ } from "@dungeon/combat/logic/Combat.faq";
import { CombatState } from "../state/CombatState";
import { CombatAI } from "./Combat.ai";
export declare class Combat {
    readonly state: CombatState;
    readonly ctrl: CombatController;
    readonly faq: CombatFAQ;
    readonly ai: CombatAI;
    iterateCombatants(): Generator<import("../state/CombatState").Combatant, void, undefined>;
    static current?: Combat;
    constructor();
}
