import type { Container, FederatedPointerEvent } from "pixi.js";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";

export class ObservableValue<T> {
  private _value: T;
  public onChange?: (value: T) => void;

  constructor(value: T) {
    this._value = value;
  }

  public get value(): T {
    return this._value;
  }

  public set value(value: T) {
    if (this._value !== value) {
      this._value = value;
      this.onChange?.(value);
    }
  }
}

type UpdateProperties = {
  pressProgress: number;
  hoverProgress: number;
  highlightProgress: number;
  disableProgress: number;
};

export function createAnimatedButtonBehavior<T extends Container>(
  target: T,
  callbacks: {
    onClick?: (e: FederatedPointerEvent) => unknown;
    onUpdate?: (this: T, state: UpdateProperties) => void;
  },
  initialUpdate: boolean | Partial<UpdateProperties> = false,
  {
    tweenPressDuration = 0.2,
    tweenHoverDuration = 0.3,
    tweenDisabledDuration = 0.4,
    tweenHightlightDuration = 0.4,
  } = {}
) {
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

  target.eventMode = "static";
  target.cursor = "pointer";

  if (onUpdate) {
    let dirty = false;
    const dirtify = (): any => void (dirty = true);
    const makeTweenFunc = (property: keyof typeof state, duration: number) =>
      tweeener.quickTo(state, property, { duration, onUpdate: dirtify, onComplete: dirtify });

    const tweeener = new TemporaryTweeener(target);
    const tweenPress = makeTweenFunc("pressProgress", tweenPressDuration);
    const tweenHover = makeTweenFunc("hoverProgress", tweenHoverDuration);
    const tweenDisabled = makeTweenFunc("disableProgress", tweenDisabledDuration);
    const tweenHightlight = makeTweenFunc("highlightProgress", tweenHightlightDuration);
    tweeener.onEveryFrame(() => {
      if (dirty) onUpdate.call(target, state);
      dirty = false;
    });

    state.isPressed.onChange = value => tweenPress(value ? 1 : 0);
    state.isHovered.onChange = value => tweenHover(value ? 1 : 0);
    state.isDisabled.onChange = value => tweenDisabled(value ? 1 : 0);
    state.isHighlighted.onChange = value => tweenHightlight(value ? 1 : 0);

    target.on("pointerdown", () => {
      state.isPressed.value = true;
    });
    target.on("pointerup", () => {
      state.isPressed.value = false;
    });
    target.on("pointerupoutside", () => {
      state.isPressed.value = false;
    });
    target.on("pointerover", () => {
      state.isHovered.value = true;
    });
    target.on("pointerout", () => {
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
    target.on("pointertap", e => !state.isDisabled.value && onClick(e));
  }

  return state;
}
