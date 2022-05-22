import { DisplayObject } from "@pixi/display";
import { InteractionData, InteractionEvent } from "@pixi/interaction";
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
};

export function createAnimatedButtonBehavior<T extends DisplayObject>(
  target: T,
  callbacks: {
    onClick?: (e: InteractionData) => unknown;
    onUpdate?: (this: T, state: UpdateProperties) => void;
  },
  initialUpdate: boolean = false
) {
  const { onClick, onUpdate } = callbacks;

  const state = {
    isPressed: new ObservableValue(false),
    isHovered: new ObservableValue(false),
    isHighlighted: new ObservableValue(false),

    pressProgress: 0,
    hoverProgress: 0,
    highlightProgress: 0,
  };

  target.interactive = true;
  target.buttonMode = true;

  if (onUpdate) {
    let dirty = false;
    const dirtify = () => void (dirty = true);
    const makeTweenFunc = (property: keyof typeof state, duration: number) =>
      tweeener.quickTo(state, property, { duration: duration, onUpdate: dirtify, onComplete: dirtify });

    const tweeener = new TemporaryTweeener(target);
    const tweenPress = makeTweenFunc("pressProgress", 0.2);
    const tweenHover = makeTweenFunc("hoverProgress", 0.3);
    const tweenHightlight = makeTweenFunc("highlightProgress", 0.4);
    tweeener.onEveryFrame(() => {
      if (dirty) onUpdate.call(target, state);
      dirty = false;
    });

    state.isPressed.onChange = value => tweenPress(value ? 1 : 0);
    state.isHovered.onChange = value => tweenHover(value ? 1 : 0);
    state.isHighlighted.onChange = value => tweenHightlight(value ? 1 : 0);

    target.on("pointerdown", function (e: InteractionEvent) {
      state.isPressed.value = true;
    });
    target.on("pointerup", function (e: InteractionEvent) {
      state.isPressed.value = false;
    });
    target.on("pointerupoutside", function (e: InteractionEvent) {
      state.isPressed.value = false;
    });
    target.on("pointerover", function (e: InteractionEvent) {
      state.isHovered.value = true;
    });
    target.on("pointerout", function (e: InteractionEvent) {
      state.isHovered.value = false;
      state.isPressed.value = false;
    });

    if (initialUpdate) {
      onUpdate.call(target, state);
    }
  }

  if (onClick) {
    target.on("click", e => onClick(e.data));
    target.on("tap", e => onClick(e.data));
  }

  return state;
}
