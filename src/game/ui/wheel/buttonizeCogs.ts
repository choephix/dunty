import { GameContext } from "@game/app/app";
import { Container } from "@pixi/display";
import { Rectangle } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import { lerp } from "@sdk/utils/math";

export function buttonizeCogs(
  object: Container,
  animator: GameContext["animator"],
  onClick?: () => void,
  animatedLayers?: readonly Readonly<[Sprite, number]>[]
) {
  const NORMAL_SCALES = animatedLayers?.map(([o]) => o.scale.x);

  const buttonBehaviour = {
    onClick,

    _downProgress: 0,
    get downProgress() {
      return this._downProgress;
    },
    set downProgress(value) {
      this._downProgress = value;
      animatedLayers?.forEach(([o, scale], i) => {
        const NORMAL_SCALE = NORMAL_SCALES?.[i] || 1;
        o?.scale.set(lerp(NORMAL_SCALE, NORMAL_SCALE * scale, value));
      });
    },

    _isDown: false,
    get isDown() {
      return this._isDown;
    },
    set isDown(value: boolean) {
      this._isDown = value;
      const downProgress = value ? 1.0 : 0.0;
      const duration = value ? 0.05 : 0.25;
      animator.tween.to(buttonBehaviour, { downProgress, duration });
    },
  };

  object.interactive = true;
  object.buttonMode = true;

  object.on("pointerdown", () => (buttonBehaviour.isDown = true));
  object.on("pointerup", () => void (buttonBehaviour.isDown = false) || onClick?.());
  object.on("pointerupoutside", () => (buttonBehaviour.isDown = false));

  const { width, height } = object;
  const hitAreaFraction = 0.5;
  object.hitArea = new Rectangle(
    -width * hitAreaFraction * 0.5,
    -height * hitAreaFraction * 0.5,
    width * hitAreaFraction,
    height * hitAreaFraction
  );

  return Object.assign(object, buttonBehaviour);
}
