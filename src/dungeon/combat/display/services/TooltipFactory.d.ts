import { Card } from "@dungeon/combat/state/CombatState";
import { StatusEffectKey } from "@dungeon/combat/state/StatusEffectBlueprints";
import { Sprite } from "@pixi/sprite";
import { VCard } from "../entities/VCard";
export declare module ToolTipFactory {
    function addToCard(card: VCard): void;
    function addIntentionIndicator(sprite: Sprite, data: Card | string): void;
    function addToStatusEffect(sprite: Sprite, statusEffect: StatusEffectKey, value: number): void;
    function addToEnergyIndicator(sprite: Sprite, value: number): void;
}
