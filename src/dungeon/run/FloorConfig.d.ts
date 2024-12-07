import { Card } from "../combat/state/CombatState";
export declare function getFloorConfig(floor: number): FloorConfig;
export declare type FloorConfig = {
    foes: {
        name?: string;
        health: number;
        handReplenishCount: number;
        energyReplenishCount?: number;
        deck: Card[];
    }[];
};
