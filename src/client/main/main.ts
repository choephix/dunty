import { Application } from "@pixi/app";
import { resolveCombatEncounter } from "./main.combat";
import { resolveGameOver } from "./main.gameover";
import { resolveWinScreen } from "./main.winscreen";

export async function main(app: Application) {
  // await resolveWinScreen(app);
  // await resolveWinScreen(app);
  // await resolveWinScreen(app);

  while (true) {
    const winnerParty = await resolveCombatEncounter(app);

    console.log("💀 Combat over.\nWinner:", winnerParty);

    if (winnerParty == null || !winnerParty.isPlayer) {
      await resolveGameOver(app);
      location.reload();
      break;
    } else {
      await resolveWinScreen(app);
    }
  }
}
