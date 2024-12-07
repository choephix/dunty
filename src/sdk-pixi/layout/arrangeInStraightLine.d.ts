import { DisplayObject } from "@pixi/display";
declare type Target = DisplayObject & {
    width?: number;
    height?: number;
};
declare type IPointInput = number | [number, number] | {
    x?: number;
    y?: number;
};
declare type IOptions = {
    x?: number;
    y?: number;
    alignment?: IPointInput;
    spacing?: number;
    cellSize?: number;
    vertical?: boolean;
};
export declare function arrangeInStraightLine(targets: readonly Target[], options?: IOptions): void;
export {};
