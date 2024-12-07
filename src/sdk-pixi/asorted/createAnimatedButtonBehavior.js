import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
export class ObservableValue {
    constructor(value) {
        this._value = value;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        if (this._value !== value) {
            this._value = value;
            this.onChange?.(value);
        }
    }
}
export function createAnimatedButtonBehavior(target, callbacks, initialUpdate = false, { tweenPressDuration = 0.2, tweenHoverDuration = 0.3, tweenDisabledDuration = 0.4, tweenHightlightDuration = 0.4, } = {}) {
    const { onClick, onUpdate } = callbacks;
    const state = {
        isPressed: new ObservableValue(false),
        isHovered: new ObservableValue(false),
        isDisabled: new ObservableValue(false),
        isHighlighted: new ObservableValue(false),
        pressProgress: 0,
        hoverProgress: 0,
        disableProgress: 0,
        highlightProgress: 0,
    };
    target.interactive = true;
    target.buttonMode = true;
    if (onUpdate) {
        let dirty = false;
        const dirtify = () => void (dirty = true);
        const makeTweenFunc = (property, duration) => tweeener.quickTo(state, property, { duration: duration, onUpdate: dirtify, onComplete: dirtify });
        const tweeener = new TemporaryTweeener(target);
        const tweenPress = makeTweenFunc("pressProgress", tweenPressDuration);
        const tweenHover = makeTweenFunc("hoverProgress", tweenHoverDuration);
        const tweenDisabled = makeTweenFunc("disableProgress", tweenDisabledDuration);
        const tweenHightlight = makeTweenFunc("highlightProgress", tweenHightlightDuration);
        tweeener.onEveryFrame(() => {
            if (dirty)
                onUpdate.call(target, state);
            dirty = false;
        });
        state.isPressed.onChange = value => tweenPress(value ? 1 : 0);
        state.isHovered.onChange = value => tweenHover(value ? 1 : 0);
        state.isDisabled.onChange = value => tweenDisabled(value ? 1 : 0);
        state.isHighlighted.onChange = value => tweenHightlight(value ? 1 : 0);
        target.on("pointerdown", function (e) {
            state.isPressed.value = true;
        });
        target.on("pointerup", function (e) {
            state.isPressed.value = false;
        });
        target.on("pointerupoutside", function (e) {
            state.isPressed.value = false;
        });
        target.on("pointerover", function (e) {
            state.isHovered.value = true;
        });
        target.on("pointerout", function (e) {
            state.isHovered.value = false;
            state.isPressed.value = false;
        });
        if (initialUpdate) {
            if (initialUpdate instanceof Object) {
                Object.assign(state, initialUpdate);
            }
            onUpdate.call(target, state);
        }
    }
    if (onClick) {
        target.on("click", e => !state.isDisabled.value && onClick(e.data));
        target.on("tap", e => !state.isDisabled.value && onClick(e.data));
    }
    return state;
}
//# sourceMappingURL=createAnimatedButtonBehavior.js.map