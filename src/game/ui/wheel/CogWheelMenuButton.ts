import { GameContext } from "@game/app/app";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { lerp } from "@sdk/utils/math";

export class CogWheelMenuButton extends Container {
  readonly layer1: Sprite;
  readonly layer2: Sprite;
  readonly icon: Sprite;

  public onClick?: Function;

  _downProgress = 0;
  get downProgress() {
    return this._downProgress;
  }
  set downProgress(value) {
    this._downProgress = value;
    this.icon.alpha = lerp(1.0, 0.7, value);
    this.layer1.scale.set(lerp(1.0, 0.95, value));
    this.layer2.scale.set(lerp(1.0, 0.93, value));
    this.icon.scale.set(lerp(1.0, 0.9, value));
    this.layer1.rotation = lerp(0, 0.25, value);
    this.layer2.rotation = lerp(0, -0.55, value);
  }

  _isDown = false;
  get isDown() {
    return this._isDown;
  }
  set isDown(value: boolean) {
    this._isDown = value;
    const downProgress = value ? 1.0 : 0.0;
    const duration = value ? 0.05 : 0.25;
    this.animator.tween.to(this, { downProgress, duration });
  }

  _isDisabled = false;
  get isDisabled() {
    return this._isDisabled;
  }
  set isDisabled(value: boolean) {
    this._isDisabled = value;
    this.icon.tint = value ? 0x666666 : 0xffffff;
  }

  constructor(textures: Texture[], private readonly animator: GameContext["animator"]) {
    super();

    this.layer1 = this.addChild(new Sprite(textures[0]));
    this.layer2 = this.addChild(new Sprite(textures[1]));
    this.icon = this.addChild(new Sprite(textures[2]));

    this.layer1.anchor.set(0.5);
    this.layer2.anchor.set(0.5);
    this.icon.anchor.set(0.5);
    this.zIndex = 32;
    this.interactive = true;
    this.buttonMode = true;

    this.on("pointerdown", () => (this.isDown = true));
    this.on("pointerup", () => {
      if (this.isDown) {
        this.isDown = false;
        this.onClick?.();
      }
    });
    this.on("pointerupoutside", () => (this.isDown = false));
  }
}
