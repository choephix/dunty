import { Application } from "@pixi/app";
import { nextFrame } from "@sdk/utils/promises";
import { resolveCombatEncounter } from "./main.combat";

export async function main(app: Application) {
  while (true) {
    const winnerParty = await resolveCombatEncounter(app);

    console.log("Game over.\nWinner:", winnerParty);
  }
}
