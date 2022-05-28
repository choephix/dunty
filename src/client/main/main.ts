import { UserCrossCombatData } from "@client/game/data";
import { loadCards } from "@client/game/data.load";
import { Application } from "@pixi/app";
import { delay } from "@sdk/utils/promises";
import { resolveCombatEncounter } from "./main.combat";
import { resolveFloorIntroScreen } from "./main.floorintro";
import { resolveGameOver } from "./main.gameover";
import { resolveWinScreen } from "./main.winscreen";

export async function main(app: Application) {
  await delay(0.5);

  const airtableCards = await loadCards();
  console.log("Cards loaded", airtableCards);

  while (true) {
    await resolveFloorIntroScreen();

    const winnerParty = await resolveCombatEncounter();
    const resultIsVictory = Boolean(winnerParty?.isPlayer);

    console.log("💀 Combat over. Result:", resultIsVictory ? "Victory" : "Defeat");

    if (resultIsVictory) {
      // VICTORY

      UserCrossCombatData.current.health = winnerParty.combatants[0].status.health;
      UserCrossCombatData.current.currentFloor++;

      await resolveWinScreen(app);
    } else {
      // DEFEAT

      await resolveGameOver(app);
      location.reload();
      break;
    }
  }
}
