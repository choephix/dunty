import { Sprite } from "@pixi/sprite";
import { Texture } from "@pixi/core";
import { Combatant } from "../game/game";
import { Container } from "@pixi/display";

const T_BACKDROP = `https://public.cx/dunty/bg2.png`;

export class VCombatStage extends Container {
  readonly backdrop;

  constructor() {
    super();

    this.backdrop = Sprite.from(T_BACKDROP);
    this.addChild(this.backdrop);
  }
}

export class VCombatant extends Container {
  sprite;

  constructor(public readonly data: Combatant) {
    super();

    this.sprite = new Sprite(Texture.from(data.textureId));
    this.sprite.anchor.set(0.5);
    this.sprite.tint = data.color;
  }

  setRightSide(rightSide: boolean) {
    this.scale.x = rightSide ? -1 : 1;
  }
}
