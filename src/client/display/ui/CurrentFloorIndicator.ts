import { UserCrossCombatData } from "@client/game/data";
import { Container } from "@pixi/display";
import { Text } from "@pixi/text";
import FontFaceObserver from "fontfaceobserver";

export class CurrentFloorIndicator extends Container {
  label;

  constructor() {
    super();

    this.label = new Text(`Floor ${UserCrossCombatData.current.currentFloor}`.toUpperCase(), {
      fill: 0xffff00,
      // fontFamily: "'Henny Penny', Impact, fantasy",
      fontFamily: "'Jolly Lodger', Impact, fantasy",
      fontWeight: "400",
      fontSize: 52,
      stroke: 0x0,
      strokeThickness: 6,
      align: "center",
    });
    this.label.anchor.set(0.5, 0.0);
    this.addChild(this.label);

    new FontFaceObserver("Jolly Lodger").load().then(() => this.label.updateText(false));
  }
}
