import { UserCrossCombatData } from "@client/combat/state/data";
import { __FLOOR__ } from "@client/debug/URL_PARAMS";
import { Application } from "@pixi/app";
import { delay } from "@sdk/utils/promises";
import { resolveCombatEncounter } from "../combat/resolveCombatEncounter";
import { resolveFloorIntroScreen } from "./main.floorintro";
import { resolveGameOver } from "./main.gameover";
import { resolveWinScreen } from "./main.winscreen";
import { resolveTitleScreen } from "./screens/resolveTitleScreen";

export async function main(app: Application) {
  await delay(0.5);

  UserCrossCombatData.current.currentFloor = __FLOOR__;

  await resolveTitleScreen();

  await delay(0.5);

  // await resolveGainItemScreen();
  // console.log("Cards loaded", await loadCards());

  while (true) {
    await resolveFloorIntroScreen();

    const winnerParty = await resolveCombatEncounter();
    const resultIsVictory = Boolean(winnerParty?.isPlayer);

    console.log("💀 Combat over. Result:", resultIsVictory ? "Victory" : "Defeat");

    if (resultIsVictory) { // VICTORY
      UserCrossCombatData.current.health = winnerParty.combatants[0].status.health;
      UserCrossCombatData.current.currentFloor++;
      await resolveWinScreen(app);
    } else { // DEFEAT
      await resolveGameOver(app);
      location.reload();
      break;
    }
  }
}
