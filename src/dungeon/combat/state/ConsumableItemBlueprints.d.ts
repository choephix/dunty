import { Combat } from "../logic/Combat";
import { Combatant } from "./CombatState";
export declare type ConsumableItem = {
    iconTextureUrl: string;
    onPlay: (actor: Combatant, game: Combat) => void | Promise<void>;
    hint: string;
};
export declare const ConsumableItemBlueprints: ConsumableItem[];
