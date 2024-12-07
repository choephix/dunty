import { Card } from "@dungeon/combat/state/CombatState";
import { Container } from "@pixi/display";
import { VCard } from "@dungeon/combat/display/entities/VCard";
export declare class VHand extends Container {
    areaWidth: number;
    cardList: Card[];
    readonly cardSprites: Map<Card, VCard>;
    onCardClick?: (card: Card) => void;
    constructor();
    private readonly onEnterFrame;
}
