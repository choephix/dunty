import { Combat } from "@dungeon/combat/logic/Combat";
export declare class CombatDriver {
    readonly combat: Combat;
    constructor(combat: Combat);
    get state(): import("../state/CombatState").CombatState;
    get ctrl(): import("./Combat.controller").CombatController;
    get faq(): import("./Combat.faq").CombatFAQ;
}
