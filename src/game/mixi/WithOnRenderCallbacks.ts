import { Renderer } from "@pixi/core";
import { globalTime } from "@game/asorted/global.time";

type ConstructorReturnType<T> = T extends { new (...args: any[]): infer U } ? U : never;
type Constructor<T = {}> = new (...args: any[]) => T;

type Renderable = {
  render(renderer: Renderer): unknown;
  destroy(...rest: unknown[]): unknown;
};
type OnRenderCallback = (time: typeof globalTime) => unknown;

export function WithOnRenderCallbacks<TBase extends Constructor<Renderable>>(Base: TBase) {
  const Result = class WithOnRenderCallbacks extends Base {
    #onRenderCallbacks = new Array<OnRenderCallback>();

    render(renderer: Renderer) {
      for (const callback of this.#onRenderCallbacks) {
        callback.call(this, globalTime);
      }
      return super.render(renderer);
    }

    onRender(callback: OnRenderCallback) {
      this.#onRenderCallbacks.push(callback);
    }

    destroy(...rest: unknown[]) {
      this.#onRenderCallbacks.length = 0;
      super.destroy(...rest);
    }
  };

  return Object.defineProperty(Result, "name", { value: Base.name + "WithOnRenderCallbacks" });
}

export type IWithOnRenderCallbacks<T = {}> = T & ConstructorReturnType<ReturnType<typeof WithOnRenderCallbacks>>;
