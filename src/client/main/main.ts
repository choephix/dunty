import { UserCrossCombatData } from "@client/game/data";
import { Application } from "@pixi/app";
import { delay } from "@sdk/utils/promises";
import { resolveCombatEncounter } from "./main.combat";
import { resolveGameOver } from "./main.gameover";
import { resolveMessageScreen } from "./main.messagescr";
import { resolveWinScreen } from "./main.winscreen";

export async function main(app: Application) {
  await delay(.5);
//   await resolveWinScreen(app);
//   await resolveWinScreen(app);
//   await resolveWinScreen(app);

  while (true) {
    await resolveMessageScreen(`Floor ${UserCrossCombatData.current.currentFloor}`);
    
    const winnerParty = await resolveCombatEncounter();
    const resultIsVictory = Boolean(winnerParty?.isPlayer);

    console.log("💀 Combat over. Result:", resultIsVictory ? "Victory" : "Defeat");

    if (resultIsVictory) {
      // VICTORY
      //

      UserCrossCombatData.current.health = winnerParty.combatants[0].status.health;
      UserCrossCombatData.current.currentFloor++;

      await resolveWinScreen(app);
    } else {
      // DEFEAT
      //

      await resolveGameOver(app);
      location.reload();
      break;
    }
  }
}
