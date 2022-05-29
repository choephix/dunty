import { Application } from "@pixi/app";
import { BLEND_MODES } from "@pixi/constants";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { IPointData } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import gsap from "gsap";

export function spawnBling(position: IPointData, container: Container) {
  async function wave(mods: Omit<Partial<Sprite>, "texture"> & { texture: string; duration?: number }, ani: any = {}) {
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
    } catch (e) {}
  }

  wave({
    //texture: `https://public.cx/3/rays-10.png`,
    texture: `https://public.cx/2/flare-rb.png`,
    //texture: `https://public.cx/2/boom-w2.png`,
    //texture: `https://public.cx/2/ring-w.png`,
    //texture: `https://public.cx/2/plus-x3b.png`,
    parent: container,
    x: position.x,
    y: position.y,
    blendMode: BLEND_MODES.ADD,
    angle: Math.random() * 360,
    duration: 2,
  });

  wave(
    {
      texture: `https://public.cx/2/plus-x3b.png`,
      parent: container,
      x: position.x,
      y: position.y,
      blendMode: BLEND_MODES.ADD,
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
