import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
export function spawnSpriteWave(textureId, tweenVars, mods) {
    const sprite = new Sprite(Texture.from(textureId));
    sprite.anchor.set(0.5);
    const tweeener = new TemporaryTweeener(sprite);
    const tween = tweeener
        .to(sprite, {
        pixi: { scale: 2 },
        alpha: 0,
        duration: 0.87,
        ease: `power3.out`,
        ...tweenVars,
    })
        .then(() => sprite.destroy());
    if (mods) {
        if (mods.parent) {
            mods.parent.addChild(sprite);
            delete mods.parent;
        }
        if (mods.scale) {
            sprite.scale.set(mods.scale);
            delete mods.scale;
        }
        Object.assign(sprite, mods);
    }
    const result = Object.assign(sprite, { tween });
    return result;
}
//# sourceMappingURL=spawnSpriteWave.js.map