var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _RegularNode_setSelectedness;
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { gsap } from "gsap";
import { BLEND_MODES } from "@pixi/constants";
import { MultipleCallbacks } from "@sdk/MultipleCallbacks";
import { createRandomizedFactory } from "@sdk/createRandomizedFactory";
import { Ease } from "@sdk/animation/Ease";
export class Node extends Container {
    constructor() {
        super(...arguments);
        this.circleIndex = 0;
        this.rayIndex = 0;
        this.fi = 0;
        this.linkRange = 0;
        this.rx = 0;
        this.ry = 0;
    }
    onEnterFrame() {
        this.rotation = -this.parent.rotation;
    }
    addClickHandler(onClick) {
        this.interactive = true;
        this.buttonMode = true;
        this.on("click", onClick);
        return () => {
            this.off("click", onClick);
        };
    }
}
export class RegularNode extends Node {
    constructor() {
        super(...arguments);
        _RegularNode_setSelectedness.set(this, new MultipleCallbacks());
        this._selectedness = 0;
    }
    set selectedness(value) {
        this._selectedness = value;
        __classPrivateFieldGet(this, _RegularNode_setSelectedness, "f").callAll(this, value);
    }
    get selectedness() {
        return this._selectedness;
    }
    init() {
        {
            const sprite = this.addChild(Sprite.from("https://undroop-assets.web.app/confucius/ui/ranks-2/crown_blue.png"));
            sprite.anchor.set(0.5, 1.375);
            __classPrivateFieldGet(this, _RegularNode_setSelectedness, "f").add(n => (sprite.alpha = n));
            __classPrivateFieldGet(this, _RegularNode_setSelectedness, "f").add(n => sprite.scale.set(0.245 * n * n));
        }
        {
            const sprite = this.addChild(Sprite.from("https://undroop-assets.web.app/confucius/ui/ranks-2/ornament_wings.png"));
            sprite.anchor.set(0.5, 0.43);
            __classPrivateFieldGet(this, _RegularNode_setSelectedness, "f").add(n => (sprite.alpha = n));
            __classPrivateFieldGet(this, _RegularNode_setSelectedness, "f").add(n => sprite.scale.set(0.31 * n * n));
        }
        {
            const sprite = this.addChild(Sprite.from("https://undroop-assets.web.app/confucius/ui/ranks-4/ribbon_blue.png"));
            sprite.anchor.set(0.5, -0.42);
            __classPrivateFieldGet(this, _RegularNode_setSelectedness, "f").add(n => (sprite.alpha = n));
            __classPrivateFieldGet(this, _RegularNode_setSelectedness, "f").add(n => sprite.scale.set(0.5 * n * n * n));
        }
        // {
        //   const sprite = this.addChild(Sprite.from("https://undroop-assets.web.app/confucius/ui/ranks-2/ribbon_blue.png"));
        //   sprite.anchor.set(0.5, -0.55);
        //   this.#setSelectedness.add(n => (sprite.alpha = n));
        //   this.#setSelectedness.add(n => sprite.scale.set(0.25 * n * n * n));
        // }
        {
            const sprite = this.addChild(Sprite.from("https://undroop-assets.web.app/confucius/ui/ranks-2/frame_gold.png"));
            sprite.anchor.set(0.5);
            sprite.scale.set(0.25);
            __classPrivateFieldGet(this, _RegularNode_setSelectedness, "f").add(n => sprite.scale.set(0.31 * n));
        }
        {
            const sprite = this.addChild(Sprite.from("https://undroop-assets.web.app/confucius/ui/ranks-2/frame_silver.png"));
            sprite.anchor.set(0.5);
            sprite.scale.set(0.2);
            sprite.tint = 0x7080a0;
            __classPrivateFieldGet(this, _RegularNode_setSelectedness, "f").add(n => sprite.scale.set(0.2 + 0.05 * Ease.OutSine(n)));
        }
        {
            const sprite = this.addChild(Sprite.from("https://undroop-assets.web.app/confucius/ui/ranks-2/frame_gold.png"));
            sprite.anchor.set(0.5);
            sprite.scale.set(0.2);
            __classPrivateFieldGet(this, _RegularNode_setSelectedness, "f").add(n => (sprite.alpha = n));
            __classPrivateFieldGet(this, _RegularNode_setSelectedness, "f").add(n => sprite.scale.set(0.2 + 0.05 * Ease.OutSine(n)));
        }
        const icon = RegularNode.getRandomIcon();
        {
            const sprite = this.addChild(Sprite.from(`https://undroop-assets.web.app/confucius/ui/ranks-1/${icon}.png`));
            sprite.anchor.set(0.5);
            sprite.scale.set(0.9);
            sprite.tint = 0xa0c0f0;
            __classPrivateFieldGet(this, _RegularNode_setSelectedness, "f").add(n => sprite.scale.set(0.9 + 0.45 * Ease.OutBack(n)));
        }
        {
            const sprite = this.addChild(Sprite.from(`https://undroop-assets.web.app/confucius/ui/ranks-1/${icon}.png`));
            sprite.anchor.set(0.5);
            sprite.scale.set(0.9);
            sprite.blendMode = BLEND_MODES.SCREEN;
            __classPrivateFieldGet(this, _RegularNode_setSelectedness, "f").add(n => (sprite.alpha = n));
            __classPrivateFieldGet(this, _RegularNode_setSelectedness, "f").add(n => sprite.scale.set(0.9 + 0.45 * Ease.OutBack(n)));
        }
        this.selectedness = 0;
    }
    setSelected(selected) {
        gsap.to(this, { duration: 0.55, selectedness: selected ? 1 : 0, ease: "power1.out", overwrite: true });
    }
}
_RegularNode_setSelectedness = new WeakMap();
RegularNode.getRandomIcon = createRandomizedFactory([
    [4, () => "icon_skull"],
    [2, () => "icon_star"],
    [1, () => "icon_swords"],
    [1, () => "icon_shield"],
    [1, () => "icon_storm"],
]);
export class BossNode extends Node {
    v1() {
        {
            const sprite = this.addChild(Sprite.from("https://undroop-assets.web.app/confucius/ui/ranks-1/wings_blue.png"));
            sprite.anchor.set(0.5, 0.589);
            sprite.scale.set(0.25);
        }
        {
            // const sprite = this.addChild(Sprite.from("https://undroop-assets.web.app/confucius/ui/ranks-4/frame_gold.png"));
            const sprite = this.addChild(Sprite.from("https://undroop-assets.web.app/confucius/ui/ranks-2/frame_bronze.png"));
            sprite.anchor.set(0.5);
            sprite.scale.set(1 / 3);
        }
        {
            const sprite = this.addChild(Sprite.from("https://undroop-assets.web.app/confucius/ui/ranks-1/icon_skull_2.png"));
            sprite.anchor.set(0.5);
        }
    }
    v2() {
        {
            const sprite = this.addChild(Sprite.from("https://undroop-assets.web.app/confucius/ui/ranks-1/wings_blue.png"));
            sprite.anchor.set(0.5, 0.589);
            sprite.scale.set(0.255);
            sprite.tint = 0x909090;
        }
        {
            const sprite = this.addChild(Sprite.from("https://undroop-assets.web.app/confucius/ui/ranks-4/frame_gold.png"));
            sprite.anchor.set(0.5);
            sprite.scale.set(0.5);
        }
        {
            const sprite = this.addChild(Sprite.from("https://undroop-assets.web.app/confucius/ui/ranks-1/icon_skull_2.png"));
            sprite.anchor.set(0.5);
        }
    }
}
//# sourceMappingURL=Node.js.map