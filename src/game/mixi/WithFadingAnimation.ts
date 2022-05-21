import { Renderer, Texture } from "@pixi/core";
import { globalTime } from "@game/asorted/global.time";

type ConstructorReturnType<T> = T extends { new (...args: any[]): infer U } ? U : never;
type Constructor<T = {}> = new (...args: any[]) => T;

interface Fadable {
  alpha: number;
  render(renderer: Renderer): unknown;
}

export function WithFadingAnimation<TBase extends Constructor<Fadable>>(Base: TBase) {
  const Result = class WithFadingAnimator extends Base {
    _alphaBase: number = 1.0;
    _showAnimationTimeScale: number = 1.0;
    _hideAnimationTimeScale: number = 1.0;
    public shouldShow: boolean = true;

    public get showTweenDuration(): number {
      return 1 / this._showAnimationTimeScale;
    }
    public set showTweenDuration(value: number) {
      this._showAnimationTimeScale = 1 / value;
    }

    public get hideTweenDuration(): number {
      return 1 / this._hideAnimationTimeScale;
    }
    public set hideTweenDuration(value: number) {
      this._hideAnimationTimeScale = 1 / value;
    }

    set alpha(v: number) {
      this._alphaBase = super.alpha = v;
    }

    render(renderer: Renderer) {
      if (this.shouldShow && this.alpha < this._alphaBase) {
        this.alpha += globalTime.deltaSeconds * this._showAnimationTimeScale;
      } else if (!this.shouldShow && this.alpha > 0) {
        this.alpha -= globalTime.deltaSeconds * this._hideAnimationTimeScale;
      }
      super.render(renderer);
    }

    forceSetShouldShow(shouldShow: boolean) {
      this.alpha = shouldShow ? this._alphaBase : 0;
      this.shouldShow = shouldShow;
    }
  };
  return Result;
}

export type IWithFadingAnimator<T = {}> = T & ConstructorReturnType<ReturnType<typeof WithFadingAnimation>>;
