import { ToolTipComponent } from "@sdk-pixi/ToolTipComponent";
import { Container, DisplayObject } from "@pixi/display";
declare type TooltipOptions = {
    content: string;
    horizontalAlign: number;
    verticalAlign: 1 | -1;
    position: {
        x: number;
        y: number;
    };
    delay: number;
    wordWrapWidth: number;
};
export declare class TooltipManager {
    readonly container: Container;
    private currentTooltip;
    private currentTarget;
    private timeoutHandle;
    readonly targets: Map<DisplayObject, Partial<TooltipOptions>>;
    constructor(container: Container);
    handleClearOnClick(): void;
    clear(): void;
    clearDestroyedTargets(): void;
    registerTarget(target: DisplayObject, options: Partial<TooltipOptions> | string): () => void;
    private setCurrentTooltipTarget;
    playShowAnimationOn(tooltip: ToolTipComponent): Promise<void> | gsap.core.Tween;
    hideAndDestroy(tooltip: ToolTipComponent): Promise<void> | gsap.core.Tween;
}
export {};
