import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Card } from "../game/game";

export class VCard extends Container {
  background;
  art;

  constructor(public readonly data: Card) {
    super();

    this.background = this.addBackground();
    this.art = this.addArt();
  }

  addBackground() {
    const sprite = Sprite.from("https://public.cx/public/mock/cards/front-unit-mida.png");
    sprite.anchor.set(0.5);
    this.addChild(sprite);
    return sprite;
  }

  addArt() {
    const sprite = Sprite.from("https://public.cx/public/mock/cards/skull-straight-9.png");
    sprite.anchor.set(0.5);
    this.addChild(sprite);
    return sprite;
  }
}
