import { Container } from "@pixi/display";
import { Text } from "@pixi/text";

export class EndTurnButton extends Container {
  label;

  constructor() {
    super();

    this.label = new Text("End Turn".toUpperCase(), {
      fill: 0xffffff,
      // fontFamily: "'Henny Penny', Impact, fantasy",
      // fontWeight: '400',
      // fontFamily: "'Sigmar One', Impact, fantasy",
      // fontWeight: "400",
      // fontFamily: "'Grenze Gotisch', Impact, fantasy",
      // fontWeight: "normal",
      // fontFamily: "'Jolly Lodger', Impact, fantasy",
      // fontWeight: "400",
      fontFamily: "Impact, fantasy",
      fontSize: 60,
      stroke: 0x0,
      strokeThickness: 8,
    });
    this.label.anchor.set(0.5);
    this.addChild(this.label);
  }
}
