import { Application } from "@pixi/app";
import { resolveCombatEncounter } from "./main.combat";
import { resolveGameOver } from "./main.gameover";

export async function main(app: Application) {
  resolveGameOver(app);
  return;

  while (true) {
    const winnerParty = await resolveCombatEncounter(app);

    console.log("Game over.\nWinner:", winnerParty);
  }
}
