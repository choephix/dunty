import { createObservableFunction } from "../core/ObservableFunction";

export function addOnEnterFrame<T>(target: T) {
  return Object.assign(target, {
    onEnterFrame: createObservableFunction.call(target),
  });
}
