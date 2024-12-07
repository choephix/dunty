import { VCombatant } from "@dungeon/combat/display/entities/VCombatant";
export declare module VCombatantAnimations {
    function enter(unit: VCombatant): Promise<void> | gsap.core.Tween;
    function attack(unit: VCombatant): Promise<void>;
    function spellBegin(unit: VCombatant): Promise<void>;
    function buff(unit: VCombatant): Promise<void>;
    function buffHealth(unit: VCombatant): Promise<void>;
    function buffRetaliation(unit: VCombatant): Promise<void>;
    function buffBlock(unit: VCombatant): Promise<void>;
    function hurt(unit: VCombatant): Promise<void>;
    function die(unit: VCombatant): Promise<void>;
    function noCard(unit: VCombatant): Promise<void>;
    function skipAction(unit: VCombatant, text: string): Promise<void>;
    function spawnFloatyText(unit: VCombatant, value: string, color: number): Promise<void>;
}
