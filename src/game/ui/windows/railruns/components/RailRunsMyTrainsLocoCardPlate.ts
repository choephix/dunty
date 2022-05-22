import { GameSingletons } from "@game/app/GameSingletons";
import { Container } from "@pixi/display";

export class RailRunsMyTrainsLocoCardPlate extends Container {
  private readonly simpleFactory = GameSingletons.getSimpleObjectFactory();

  constructor() {
    super();

    //// Add background
    const bg = this.simpleFactory.createSprite("ui-railruns-window/boost-bg-clean.png");
    bg.height = bg.height * 0.95;
    bg.width = bg.width * 0.9;
    this.addChild(bg);

    //// Add notches
    let startY = 25;
    for (let i = 0; i < 4; i++) {
      const bgPad = this.simpleFactory.createSprite("ui-railruns-window/boost-bg-notch.png", { x: 15, y: startY });
      bgPad.scale.set(0.92);
      this.addChild(bgPad);
      startY += 80;
    }
  }
}
