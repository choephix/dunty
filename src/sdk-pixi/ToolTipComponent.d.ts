import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { LiteralUnion } from "type-fest";
export declare type ToolTipComponentHorizontalAlignment = LiteralUnion<-1 | 0 | 1, number>;
export declare type ToolTipComponentVerticalAlignment = 1 | 0 | -1;
export declare class ToolTipComponent extends Container {
    private readonly text;
    private readonly box;
    private readonly arrow?;
    constructor(content: string, horizontalAlignment: ToolTipComponentHorizontalAlignment, verticalAlignment: ToolTipComponentVerticalAlignment, wordWrapWidth?: number);
    drawBox(width: number, height: number): Graphics;
    /**
     * Draws an arrow pointing out of the bubble.
     *
     * @param pointAlignment -1 to 1.
     * @param pointingUp true or false
     */
    drawArrow(pointAlignment: number, pointingUp: boolean): Graphics;
}
