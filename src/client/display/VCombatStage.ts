import { GameSingletons } from "@client";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";

const T_BACKDROP = `https://public.cx/dunty/bg/gb60.jpg`;

const DESIGN_SPECS = {
  width: 1080,
  height: 1920,
};

export class VCombatStage extends Container {
  readonly backdrop;

  constructor() {
    super();

    this.backdrop = Sprite.from(T_BACKDROP);
    this.addChild(this.backdrop);
  }

  onEnterFrame() {
    const app = GameSingletons.getPixiApplicaiton();
    const SCALE = Math.min(app.screen.width / DESIGN_SPECS.width, app.screen.height / DESIGN_SPECS.height);
    this.scale.set(SCALE);
    this.position.set(
      0.5 * (app.screen.width - DESIGN_SPECS.width * SCALE),
      0.5 * (app.screen.height - DESIGN_SPECS.height * SCALE)
    );
  }

  // addChildAtFractionalPosition(child: Sprite, x: number, y: number) {
  //   child.position.copyFrom(this.getFractionalPosition(x, y));
  //   this.addChild(child);
  // }

  getFractionalPosition(x: number, y: number) {
    return { x: x * DESIGN_SPECS.width, y: y * DESIGN_SPECS.height };
  }
}
