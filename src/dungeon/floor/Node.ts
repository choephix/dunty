import { __window__ } from "@debug/__window__";
import { Application } from "@pixi/app";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { range2D } from "@sdk/math/range2d";
import { randomInt } from "@sdk/utils/random";
import { Viewport } from "pixi-viewport";
import { gsap } from "gsap";
import { BLEND_MODES } from "@pixi/constants";
import { getRandomItemFrom } from "@sdk/helpers/arrays";
import { range } from "@sdk/utils/range";

export class Node extends Container {
  circleIndex: number = 0;
  rayIndex: number = 0;
  fi: number = 0;

  onEnterFrame() {
    this.rotation = -this.parent.rotation;
  }

  addClickHandler(onClick?: () => void) {
    this.interactive = true;
    this.buttonMode = true;
    this.on("click", onClick);
    return () => {
      this.off("click", onClick);
    };
  }
}

export class RegularNode extends Node {
  readonly holos = new Array<Sprite & { visibility?: number }>();

  init() {
    {
      const sprite = this.addChild(Sprite.from("https://public.cx/mock/ui/ranks-2/ornament_wings.png"));
      sprite.anchor.set(0.5);
      sprite.scale.set(0.21);
      this.holos.push(sprite);

      Object.assign(sprite, {
        set visibility(value: number) {
          sprite.alpha = value;
        },
      });
    }

    {
      const sprite = this.addChild(Sprite.from("https://public.cx/mock/ui/ranks-2/frame_silver.png"));
      sprite.anchor.set(0.5);
      sprite.scale.set(0.2);
      sprite.tint = 0x7080a0;
    }

    {
      const sprite = this.addChild(Sprite.from("https://public.cx/mock/ui/ranks-2/frame_silver.png"));
      sprite.anchor.set(0.5);
      sprite.scale.set(0.2);
      sprite.tint = 0xf08010;
      sprite.blendMode = BLEND_MODES.ADD;
      this.holos.push(sprite);

      Object.assign(sprite, {
        set visibility(value: number) {
          sprite.alpha = value;
        },
      });
    }

    // {
    //   const sprite = this.addChild(Sprite.from("https://public.cx/mock/ui/ranks-1/icon_swords.png"));
    //   sprite.anchor.set(0.5);
    //   sprite.scale.set(1.4);
    //   sprite.tint = 0x7080a0;
    // }

    {
      const sprite = this.addChild(Sprite.from("https://public.cx/mock/ui/ranks-1/icon_skull.png"));
      sprite.anchor.set(0.5);
      sprite.scale.set(0.9);
      sprite.tint = 0xa0c0f0;
    }

    {
      const sprite = this.addChild(Sprite.from("https://public.cx/mock/ui/ranks-1/icon_skull.png"));
      sprite.anchor.set(0.5);
      sprite.scale.set(0.9);
      sprite.blendMode = BLEND_MODES.SCREEN;
      this.holos.push(sprite);

      Object.assign(sprite, {
        set visibility(value: number) {
          sprite.alpha = value;
        },
      });
    }

    // {
    //   const sprite = this.addChild(Sprite.from("https://public.cx/mock/ui/folo.png"));
    //   sprite.anchor.set(0.5);
    //   sprite.scale.set(0.61);
    //   sprite.angle = 270;
    //   sprite.blendMode = BLEND_MODES.ADD;
    // }
  }

  setSelected(selected: boolean) {
    // this.holos.forEach((holo) => {
    //   gsap.to(holo, { duration: 0.4, visibility: selected ? 1 : 0 });
    // });

    this.holos.forEach(holo => {
      holo.visible = selected;
    });
  }
}

export class BossNode extends Node {
  v1() {
    {
      const sprite = this.addChild(Sprite.from("https://public.cx/mock/ui/ranks-1/wings_blue.png"));
      sprite.anchor.set(0.5, 0.589);
      sprite.scale.set(0.25);
    }

    {
      // const sprite = this.addChild(Sprite.from("https://public.cx/mock/ui/ranks-4/frame_gold.png"));
      const sprite = this.addChild(Sprite.from("https://public.cx/mock/ui/ranks-2/frame_bronze.png"));
      sprite.anchor.set(0.5);
      sprite.scale.set(1 / 3);
    }

    {
      const sprite = this.addChild(Sprite.from("https://public.cx/mock/ui/ranks-1/icon_skull_2.png"));
      sprite.anchor.set(0.5);
    }
  }

  v2() {
    {
      const sprite = this.addChild(Sprite.from("https://public.cx/mock/ui/ranks-1/wings_blue.png"));
      sprite.anchor.set(0.5, 0.589);
      sprite.scale.set(0.25);
      sprite.tint = 0x909090;
    }

    {
      const sprite = this.addChild(Sprite.from("https://public.cx/mock/ui/ranks-4/frame_gold.png"));
      sprite.anchor.set(0.5);
      sprite.scale.set(0.5);
    }

    {
      const sprite = this.addChild(Sprite.from("https://public.cx/mock/ui/ranks-1/icon_skull_2.png"));
      sprite.anchor.set(0.5);
    }
  }
}
