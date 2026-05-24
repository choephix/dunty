import { Container } from "pixi.js";
import { Text } from "pixi.js";

export class EndTurnButton extends Container {
  labelText;

  constructor() {
    super();

    this.labelText = new Text("End Turn".toUpperCase(), {
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
      stroke: { color: 0x0, width: 8 },
    });
    this.labelText.anchor.set(0.5);
    this.addChild(this.labelText);
  }
}
