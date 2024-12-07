import { Container } from "@pixi/display";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
export declare class VScene extends Container {
    readonly designWidth: number;
    readonly designHeight: number;
    readonly tweeener: TemporaryTweeener<this>;
    constructor();
    onEnterFrame(): void;
    getFractionalPosition(x: number, y: number): {
        x: number;
        y: number;
    };
    playShowAnimation(): Promise<void> | gsap.core.Tween;
    playHideAnimation(): Promise<void> | gsap.core.Tween;
}
