import { Sprite } from "@pixi/sprite";
declare type SpotlightPoint = {
    x: number;
    y: number;
    radius: number;
    lean: number;
};
export declare class Spotlights extends Sprite {
    readonly imageWidth: number;
    readonly imageHeight: number;
    readonly canvasElement: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;
    constructor(imageWidth?: number, imageHeight?: number);
    updateSpotlights(points: SpotlightPoint[]): void;
    render(...[renderer]: Parameters<Sprite["render"]>): void;
}
export declare function testTheTest(): Spotlights;
export declare function testTheTestimage_Failed(): Sprite;
export {};
