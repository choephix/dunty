import { Combat } from "../logic/Combat";
/**
 * Single instance of a combat encounter.
 */
export declare class CombatState {
    groupA: CombatGroup;
    groupB: CombatGroup;
}
export declare class CombatGroup {
    isPlayer: boolean;
    readonly combatants: Combatant[];
    addCombatant(combatant: Combatant): void;
}
export declare class CardPiles {
    readonly drawPile: Card[];
    readonly hand: Card[];
    readonly discardPile: Card[];
    readonly void: Card[];
    private readonly piles;
    moveCardTo(card: Card, pile: Card[], atTheBottom?: boolean): void;
    addCardTo(card: Card, pile: Card[], atTheBottom?: boolean): void;
}
export declare class Combatant {
    name?: string;
    group: CombatGroup;
    characterId: string;
    textureId: string;
    readonly cards: CardPiles;
    handReplenishCount: number;
    energyReplenishCount: number;
    energy: number;
    status: {
        health: number;
        block: number;
        protection: number;
        retaliation: number;
        parry: number;
        reflect: number;
        leech: number;
        regeneration: number;
        strength: number;
        rage: number;
        fury: number;
        haste: number;
        taunt: number;
        tactical: number;
        daggers: number;
        defensive: number;
        weak: number;
        brittle: number;
        exposed: number;
        doomed: number;
        burning: number;
        poisoned: number;
        bleeding: number;
        stunned: number;
        frozen: number;
        wet: number;
        warm: number;
        oiled: number;
        cold: number;
    };
    get alive(): boolean;
    constructor(initialStatus?: Partial<CombatantStatus>, characterId?: string);
    toString(): string;
}
export declare type CombatantStatus = Omit<Combatant["status"], "energy">;
export declare module CombatantStatus {
    function entries<T>(obj: Partial<Record<keyof CombatantStatus, T>>): ["health" | "block" | "parry" | "reflect" | "retaliation" | "protection" | "brittle" | "exposed" | "doomed" | "leech" | "regeneration" | "strength" | "rage" | "fury" | "haste" | "taunt" | "tactical" | "daggers" | "defensive" | "weak" | "burning" | "poisoned" | "bleeding" | "stunned" | "frozen" | "wet" | "warm" | "oiled" | "cold", T][];
}
export interface Card {
    cost: number;
    type: string;
    value?: number;
    mods?: Partial<CombatantStatus>;
    target: CardTarget;
    isToken?: boolean;
    isBloat?: boolean;
    retain?: boolean;
    gotoAfterPlay?: CardPileType;
    gotoAfterDiscard?: CardPileType;
    onPlay?: (actor: Combatant, targets?: Combatant[]) => void;
    onDraw?: (actor: Combatant, combat: Combat) => void;
    textureUrl?: string;
    description?: string;
}
export declare enum CardTarget {
    SELF = "SELF",
    TARGET_ANYONE = "TARGET_ANYONE",
    TARGET_ENEMY = "TARGET_ENEMY",
    FRONT_ENEMY = "FRONT_ENEMY",
    ALL_ENEMIES = "ALL_ENEMIES",
    ALL_ALLIES = "ALL_ALLIES",
    ALL = "ALL"
}
export declare enum CardPileType {
    DRAW = "DRAW",
    HAND = "HAND",
    DISCARD = "DISCARD",
    VOID = "VOID"
}
