import { Sprite } from "@pixi/sprite";
declare type TModBase<T> = Partial<Omit<T, "scale"> & {
    scale: number;
}>;
export declare function spawnSpriteWave<T extends Sprite, TMods extends TModBase<T> = {}>(textureId: string, tweenVars?: gsap.TweenVars, mods?: TMods): Sprite & Omit<TMods, "scale">;
export {};
