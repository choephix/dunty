import { loadTexture } from "@sdk-pixi/assets/loadTexture";
import { Container } from "pixi.js";
import { PointData } from "pixi.js";
import { Sprite } from "pixi.js";
import gsap from "gsap";

export function spawnBling(position: PointData, container: Container) {
  async function wave(
    mods: Omit<Partial<Sprite>, "texture" | "parent"> & { texture: string; parent?: Container; duration?: number },
    ani: any = {}
  ) {
    const { texture: textureId, parent, ...spriteMods } = mods;

    const texture = await loadTexture(textureId);
    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5);
    parent?.addChild(sprite);
    Object.assign(sprite, spriteMods);

    await tween(mods.duration || 1, p => {
      sprite.alpha = Math.sin(p * Math.PI);
      sprite.alpha *= sprite.alpha;
      sprite.scale.set(p);
      sprite.rotation += ani.rot || 0;
    });
    
    try {
      sprite.destroy();
    } catch (e) {}
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
    blendMode: "add",
    angle: Math.random() * 360,
    duration: 2,
  });

  wave(
    {
      texture: `https://undroop-assets.web.app/davinci/2/plus-x3b.png`,
      parent: container,
      x: position.x,
      y: position.y,
      blendMode: "add",
      angle: Math.random() * 360,
      duration: 1.5,
    },
    {
      rot: 0.01,
    }
  );
}

function tween(seconds: number, fn: (p: number) => unknown) {
  const store = { progress: 0 };
  const animate = gsap.quickTo(store, "progress", {
    duration: seconds,
    onUpdate() {
      try {
        fn(store.progress);
      } catch (e) {}
    },
    ease: `power3.out`,
  });
  return animate(1);
}
