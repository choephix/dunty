import { DisplayObject } from "@pixi/display";
export declare function buttonizeDisplayObject<T extends DisplayObject>(target: T, callbacks: ((this: T) => void) | {
    onTrigger?: (this: T) => void;
}): () => void;
