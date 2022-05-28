import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";

export class HandBlockerBlock extends Container {
  pad;
  label;

  constructor(str: string) {
    super();

    this.pad = new Sprite(Texture.WHITE);
    this.pad.tint = 0x000000;
    this.pad.alpha = 0.8;
    this.pad.width = 1080;
    this.pad.height = 400;
    this.pad.anchor.set(0.5, 0.7);
    this.addChild(this.pad);

    this.label = new Text(str.toUpperCase(), {
      fill: 0xffffff,
      fontFamily: "Impact, fantasy",
      fontSize: 60,
      stroke: 0x0,
      strokeThickness: 8,
    });
    this.label.anchor.set(0.5);
    this.addChild(this.label);

    this.pad.interactive = true;
  }
}
