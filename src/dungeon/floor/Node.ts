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
import { EnchantmentCallbacksList } from "@sdk/pixi/enchant/core/EnchantmentCallbacksList";
import { MultipleCallbacks } from "@sdk/MultipleCallbacks";
import { createRandomizedFactory } from "@sdk/createRandomizedFactory";
import { Ease } from "@sdk/animation/Ease";

export class Node extends Container {
  circleIndex: number = 0;
  rayIndex: number = 0;
  fi: number = 0;
  linkRange = 0;
  rx = 0;
  ry = 0;

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

  readonly #setSelectedness = new MultipleCallbacks<(n: number) => void>();
  _selectedness = 0;
  set selectedness(value: number) {
    this._selectedness = value;
    this.#setSelectedness.callAll(this, value);
  }
  get selectedness() {
    return this._selectedness;
  }

  static readonly getRandomIcon = createRandomizedFactory([
    [2, () => "icon_skull"],
    [1, () => "icon_swords"],
    [1, () => "icon_shield"],
    [1, () => "icon_storm"],
    [1, () => "icon_star"],
  ]);

  init() {
    {
      const sprite = this.addChild(Sprite.from("https://public.cx/mock/ui/ranks-2/ornament_wings.png"));
      sprite.anchor.set(0.5);
      sprite.scale.set(0.21);
      this.holos.push(sprite);
      this.#setSelectedness.add(n => (sprite.alpha = n));
      this.#setSelectedness.add(n => sprite.scale.set(0.31 * n * n));
    }

    {
      const sprite = this.addChild(Sprite.from("https://public.cx/mock/ui/ranks-2/frame_bronze.png"));
      sprite.anchor.set(0.5);
      sprite.scale.set(0.25);
      this.#setSelectedness.add(n => sprite.scale.set(0.31 * n));
    }

    {
      const sprite = this.addChild(Sprite.from("https://public.cx/mock/ui/ranks-2/frame_silver.png"));
      sprite.anchor.set(0.5);
      sprite.scale.set(0.2);
      sprite.tint = 0x7080a0;
      this.#setSelectedness.add(n => sprite.scale.set(0.2 + 0.05 * Ease.OutSine(n)));
    }

    {
      const sprite = this.addChild(Sprite.from("https://public.cx/mock/ui/ranks-2/frame_gold.png"));
      sprite.anchor.set(0.5);
      sprite.scale.set(0.2);
      this.holos.push(sprite);
      this.#setSelectedness.add(n => (sprite.alpha = n));
      this.#setSelectedness.add(n => sprite.scale.set(0.2 + 0.05 * Ease.OutSine(n)));
    }

    // {
    //   const sprite = this.addChild(Sprite.from("https://public.cx/mock/ui/ranks-1/icon_swords.png"));
    //   sprite.anchor.set(0.5);
    //   sprite.scale.set(1.3);
    //   sprite.tint = 0xc0c0c0;
    //   this.#setVisibility.add(n => {
    //     sprite.alpha = n;
    //     sprite.scale.set(1.3 * n * n * n * n);
    //   });
    // }

    const icon = RegularNode.getRandomIcon();

    {
      const sprite = this.addChild(Sprite.from(`https://public.cx/mock/ui/ranks-1/${icon}.png`));
      sprite.anchor.set(0.5);
      sprite.scale.set(0.9);
      sprite.tint = 0xa0c0f0;
      this.#setSelectedness.add(n => sprite.scale.set(0.9 + 0.45 * Ease.OutBack(n)));
    }

    {
      const sprite = this.addChild(Sprite.from(`https://public.cx/mock/ui/ranks-1/${icon}.png`));
      sprite.anchor.set(0.5);
      sprite.scale.set(0.9);
      sprite.blendMode = BLEND_MODES.SCREEN;
      this.holos.push(sprite);
      this.#setSelectedness.add(n => (sprite.alpha = n));
      this.#setSelectedness.add(n => sprite.scale.set(0.9 + 0.45 * Ease.OutBack(n)));
    }

    this.selectedness = 0;
  }

  setSelected(selected: boolean) {
    gsap.to(this, { duration: 0.55, selectedness: selected ? 1 : 0, ease: "power1.out", overwrite: true });
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
      sprite.scale.set(0.255);
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
