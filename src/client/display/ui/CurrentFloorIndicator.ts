import { UserCrossCombatData } from "@client/game/data";
import { Container } from "@pixi/display";
import { Text } from "@pixi/text";
import FontFaceObserver from "fontfaceobserver";

export class CurrentFloorIndicator extends Container {
  label;

  constructor() {
    super();

    this.label = new Text(`Floor ${UserCrossCombatData.current.currentFloor}`.toUpperCase(), {
      fill: 0xff0050,
      // fontFamily: "'Henny Penny', Impact, fantasy",
      fontFamily: "'Jolly Lodger', Impact, fantasy",
      fontWeight: "400",
      fontSize: 52,
      stroke: 0x0,
      strokeThickness: 3,
      align: "center",
    });
    this.label.anchor.set(0.5, 0.0);
    this.addChild(this.label);

    // this.pad = new Sprite(Texture.WHITE);
    // this.pad.tint = 0x000000;
    // this.pad.alpha = 0.8;
    // this.pad.width = this.label.width + 60;
    // this.pad.height = this.label.height + 60;
    // this.pad.anchor.set(0.5, 0.5);
    // this.addChildAt(this.pad, 0);

    new FontFaceObserver("Jolly Lodger").load().then(() => this.label.updateText(false));
  }
}
