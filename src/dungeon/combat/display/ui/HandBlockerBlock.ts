import { Texture } from "pixi.js";
import { Container } from "pixi.js";
import { Sprite } from "pixi.js";
import { Text } from "pixi.js";

export class HandBlockerBlock extends Container {
  pad;
  labelText;

  constructor(str: string) {
    super();

    this.pad = new Sprite(Texture.WHITE);
    this.pad.tint = 0x000000;
    this.pad.alpha = 0.8;
    this.pad.width = 1080;
    this.pad.height = 400;
    this.pad.anchor.set(0.5);
    this.addChild(this.pad);

    this.labelText = new Text(str.toUpperCase(), {
      fill: 0xffffff,
      fontFamily: "Impact, fantasy",
      fontSize: 60,
      stroke: { color: 0x0, width: 8 },
    });
    this.labelText.anchor.set(0.5);
    this.addChild(this.labelText);

    this.pad.eventMode = "static";
  }
}
