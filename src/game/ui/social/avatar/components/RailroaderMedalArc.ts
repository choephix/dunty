import { Container } from "@pixi/display";
import { RailroaderMedal } from "./RailroaderMedal";

export class RailroaderMedalArc extends Container {
  medals: Array<RailroaderMedal> = [];
  constructor(dist: number) {
    super();
    const firstMedal = new RailroaderMedal();
    firstMedal.setHighlighted(false);
    firstMedal.position.set(-dist * 0.9, 0);
    firstMedal.scale.set(0.35);
    firstMedal.setIcon("ui-social/achievements/icons/loco.png");
    this.addChild(firstMedal);

    const secondMedal = new RailroaderMedal();
    secondMedal.setHighlighted(false);
    secondMedal.position.set(-dist * 0.75, -dist * 0.67);
    secondMedal.scale.set(0.35);
    secondMedal.setIcon("ui-social/achievements/icons/conductor.png");
    this.addChild(secondMedal);

    const thirdMedal = new RailroaderMedal();
    thirdMedal.setHighlighted(false);
    thirdMedal.position.set(0, -dist);
    thirdMedal.scale.set(0.35);
    thirdMedal.setIcon("ui-social/achievements/icons/rc.png");
    this.addChild(thirdMedal);

    const forthMedal = new RailroaderMedal();
    forthMedal.setHighlighted(false);
    forthMedal.position.set(dist * 0.75, -dist * 0.67);
    forthMedal.setIcon("ui-social/achievements/icons/comms.png");
    forthMedal.scale.set(0.35);
    this.addChild(forthMedal);

    const fifthMedal = new RailroaderMedal();
    fifthMedal.setHighlighted(false);
    fifthMedal.position.set(dist * 0.9, 0);
    fifthMedal.setIcon("ui-social/achievements/icons/pass.png");
    fifthMedal.scale.set(0.35);
    this.addChild(fifthMedal);

    this.medals = [firstMedal, secondMedal, thirdMedal, forthMedal, fifthMedal];
  }

  setHighlight(data: boolean, index: number) {
    this.medals[index].setHighlighted(data);
  }
}
