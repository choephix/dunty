import { DisplayObject } from "@pixi/display";
import { InteractionData } from "@pixi/interaction";
export declare class ObservableValue<T> {
    private _value;
    onChange?: (value: T) => void;
    constructor(value: T);
    get value(): T;
    set value(value: T);
}
declare type UpdateProperties = {
    pressProgress: number;
    hoverProgress: number;
    highlightProgress: number;
    disableProgress: number;
};
export declare function createAnimatedButtonBehavior<T extends DisplayObject>(target: T, callbacks: {
    onClick?: (e: InteractionData) => unknown;
    onUpdate?: (this: T, state: UpdateProperties) => void;
}, initialUpdate?: boolean | Partial<UpdateProperties>, { tweenPressDuration, tweenHoverDuration, tweenDisabledDuration, tweenHightlightDuration, }?: {
    tweenPressDuration?: number;
    tweenHoverDuration?: number;
    tweenDisabledDuration?: number;
    tweenHightlightDuration?: number;
}): {
    isPressed: ObservableValue<boolean>;
    isHovered: ObservableValue<boolean>;
    isDisabled: ObservableValue<boolean>;
    isHighlighted: ObservableValue<boolean>;
    pressProgress: number;
    hoverProgress: number;
    disableProgress: number;
    highlightProgress: number;
};
export {};
