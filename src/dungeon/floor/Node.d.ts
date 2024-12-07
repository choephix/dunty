import { Container } from "@pixi/display";
export declare class Node extends Container {
    circleIndex: number;
    rayIndex: number;
    fi: number;
    linkRange: number;
    rx: number;
    ry: number;
    onEnterFrame(): void;
    addClickHandler(onClick?: () => void): () => void;
}
export declare class RegularNode extends Node {
    #private;
    _selectedness: number;
    set selectedness(value: number);
    get selectedness(): number;
    static readonly getRandomIcon: () => string;
    init(): void;
    setSelected(selected: boolean): void;
}
export declare class BossNode extends Node {
    v1(): void;
    v2(): void;
}
