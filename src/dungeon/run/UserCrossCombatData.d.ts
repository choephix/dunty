import { ConsumableItem } from "@dungeon/combat/state/ConsumableItemBlueprints";
export declare class UserCrossCombatData {
    currentFloor: number;
    health: number;
    handReplenishCount: number;
    energyReplenishCount: number;
    readonly deck: any[];
    readonly consumables: ConsumableItem[];
    playerCharacterId: string;
}
export declare module UserCrossCombatData {
    const current: UserCrossCombatData;
}
