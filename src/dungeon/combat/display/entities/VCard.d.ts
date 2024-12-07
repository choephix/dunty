import { Card, Combatant } from "@dungeon/combat/state/CombatState";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
export declare class VCard extends Container {
    readonly data: Card;
    background: any;
    art: any;
    valueIndicator: any;
    costIndicator: any;
    glow: any;
    actor?: Combatant;
    state: any;
    tweeener: TemporaryTweeener<this>;
    constructor(data: Card);
    addBackground(): Sprite;
    addArt(): Sprite;
    addCostIndicator(): Text;
    addValueIndicator(): Sprite;
    addGlow(): Sprite;
    getBounds(): any;
}
export declare function formatEnergyCost(cost: number): string;
export declare module VCard {
    const DESIGN_WIDTH = 500;
    const DESIGN_HEIGHT = 700;
}
