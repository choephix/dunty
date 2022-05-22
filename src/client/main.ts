import { __addPikachu } from "@debug/special/pikachu";
import { Application } from "@pixi/app";
import { nextFrame } from "@sdk/utils/promises";
import { VCombatStage } from "./display";
import { Game } from "./game/game";

const DESIGN_SPECS = {
  width: 1080,
  height: 1920,
};

export async function main(app: Application) {
  console.log(`Main initializing...`, app);

  await nextFrame();

  const game = new Game();

  const container = new VCombatStage();
  app.stage.addChild(container);
  app.ticker.add(() => {
    const SCALE = Math.min(app.screen.width / DESIGN_SPECS.width, app.screen.height / DESIGN_SPECS.height);
    container.scale.set(SCALE);
    container.position.set(
      0.5 * (app.screen.width - DESIGN_SPECS.width * SCALE),
      0.5 * (app.screen.height - DESIGN_SPECS.height * SCALE)
    );
  });

  __addPikachu(container, { x: 600, y: 600 });
}
