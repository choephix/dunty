import type { Container } from "pixi.js";

export function buttonizeDisplayObject<T extends Container>(
  target: T,
  callbacks: ((this: T) => void) | { onTrigger?: (this: T) => void }
) {
  if (callbacks instanceof Function) {
    callbacks = { onTrigger: callbacks };
  }

  const { onTrigger } = callbacks;

  target.eventMode = "static";
  target.cursor = "pointer";

  if (onTrigger) {
    callbacks.onTrigger = onTrigger.bind(target);
    target.on("pointertap", callbacks.onTrigger);
  }

  return function () {
    target.eventMode = "none";
    target.cursor = "default";
    target.off("pointertap", callbacks.onTrigger);
  };
}
