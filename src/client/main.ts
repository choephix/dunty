import { GameSingletons } from "@client";
import { __addPikachu } from "@debug/special/pikachu";
import { nextFrame } from "@sdk/utils/promises";
import { VCombatStage } from "./display";
import { Game } from "./game/game";

export async function main() {
  const { app } = GameSingletons.getPixiStuff();

  await nextFrame();

  const game = new Game();

  const container = new VCombatStage();
  app.stage.addChild(container);

  __addPikachu(container, { x: 600, y: 600 });
}
