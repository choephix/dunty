import { gsap } from "gsap/gsap-core";
import { DisplayObject } from "@pixi/display";
export declare type DestroyableDisplayObject = Pick<DisplayObject, "destroy" | "destroyed" | "addListener">;
export declare type TweenTarget = null | (gsap.TweenTarget & {
    destroyed?: boolean;
});
/**
 * Currently simply wraps GSAP's native functions for tweening object properties,
 * with the added benefit of destroying any queued up tweens when the object given
 * to the contructor ("sustainer") is destroyed.
 */
export declare class TemporaryTweeener<T extends DestroyableDisplayObject = DestroyableDisplayObject> {
    private readonly onDestroyFunctions;
    private onSustainerDestroyed;
    constructor(sustainer: T);
    onEveryFrame(cb: () => void | null): void;
    registerForDestruction<T extends gsap.core.Animation>(tween: T): T;
    readonly quickTo: <T_1 extends TweenTarget>(target: T_1, property: keyof T_1, vars?: gsap.TweenVars) => (value: number, start?: number, startIsRelative?: boolean) => Promise<void> | gsap.core.Tween;
    readonly to: (targets: TweenTarget, vars: gsap.TweenVars) => Promise<void> | gsap.core.Tween;
    readonly from: (targets: TweenTarget, vars: gsap.TweenVars) => Promise<void> | gsap.core.Tween;
    readonly fromTo: (targets: TweenTarget, fromVars: gsap.TweenVars, toVars: gsap.TweenVars) => Promise<void> | gsap.core.Tween;
    readonly createTimeline: (vars?: gsap.TimelineVars | undefined) => gsap.core.Timeline;
    readonly playTimeline: (fn: (tl: gsap.core.Timeline) => unknown, vars?: gsap.TimelineVars | undefined) => gsap.core.Timeline;
    readonly delay: (seconds: number) => Promise<unknown>;
    readonly add: (fn: gsap.TickerCallback) => (() => true) & {
        kill: () => void;
    };
    readonly remove: (fn: gsap.TickerCallback) => void;
    killTweensOf(...args: any[]): void;
}
