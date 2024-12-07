import { BLEND_MODES } from "@pixi/constants";
import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import gsap from "gsap";
export function spawnBling(position, container) {
    async function wave(mods, ani = {}) {
        const textureId = mods.texture;
        delete mods.texture;
        const texture = await Texture.fromURL(textureId);
        const sprite = new Sprite(texture);
        sprite.anchor.set(0.5);
        if (mods.parent) {
            mods.parent.addChild(sprite);
            delete mods.parent;
        }
        Object.assign(sprite, mods);
        await tween(mods.duration || 1, p => {
            sprite.alpha = Math.sin(p * Math.PI);
            sprite.alpha *= sprite.alpha;
            sprite.scale.set(p);
            sprite.rotation += ani.rot || 0;
        });
        try {
            sprite.destroy();
        }
        catch (e) { }
    }
    wave({
        //texture: `https://undroop-assets.web.app/davinci/3/rays-10.png`,
        texture: `https://undroop-assets.web.app/davinci/2/flare-rb.png`,
        //texture: `https://undroop-assets.web.app/davinci/2/boom-w2.png`,
        //texture: `https://undroop-assets.web.app/davinci/2/ring-w.png`,
        //texture: `https://undroop-assets.web.app/davinci/2/plus-x3b.png`,
        parent: container,
        x: position.x,
        y: position.y,
        blendMode: BLEND_MODES.ADD,
        angle: Math.random() * 360,
        duration: 2,
    });
    wave({
        texture: `https://undroop-assets.web.app/davinci/2/plus-x3b.png`,
        parent: container,
        x: position.x,
        y: position.y,
        blendMode: BLEND_MODES.ADD,
        angle: Math.random() * 360,
        duration: 1.5,
    }, {
        rot: 0.01,
    });
}
function tween(seconds, fn) {
    const store = { progress: 0 };
    const animate = gsap.quickTo(store, "progress", {
        duration: seconds,
        onUpdate() {
            try {
                fn(store.progress);
            }
            catch (e) { }
        },
        ease: `power3.out`,
    });
    return animate(1);
}
//# sourceMappingURL=bling.js.map