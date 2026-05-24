import { UserCrossCombatData } from "@dungeon/run/UserCrossCombatData";
import { Container } from "pixi.js";
import { Text } from "pixi.js";
import FontFaceObserver from "fontfaceobserver";

export class CurrentFloorIndicator extends Container {
  labelText;

  constructor() {
    super();

    this.labelText = new Text(`Floor ${UserCrossCombatData.current.currentFloor}`.toUpperCase(), {
      fill: 0xff0050,
      // fontFamily: "'Henny Penny', Impact, fantasy",
      fontFamily: "'Jolly Lodger', Impact, fantasy",
      fontWeight: "400",
      fontSize: 52,
      stroke: { color: 0x0, width: 3 },
      align: "center",
    });
    this.labelText.anchor.set(0.5, 0.0);
    this.addChild(this.labelText);

    // this.pad = new Sprite(Texture.WHITE);
    // this.pad.tint = 0x000000;
    // this.pad.alpha = 0.8;
    // this.pad.width = this.labelText.width + 60;
    // this.pad.height = this.labelText.height + 60;
    // this.pad.anchor.set(0.5, 0.5);
    // this.addChildAt(this.pad, 0);

    new FontFaceObserver("Jolly Lodger").load().then(() => void (this.labelText.text = this.labelText.text));
  }
}
