import { GameSingletons } from "@client/core/GameSingletons";
import { createEnchantedFrameLoop } from "@game/asorted/createEnchangedFrameLoop";
import { game } from "./main";

export async function waitForWinner() {
  const app = GameSingletons.getPixiApplicaiton();
  const { isGroupAlive, groupA, groupB }= game;
  const onEnterFrame = createEnchantedFrameLoop(app.stage);
  app.ticker.add(onEnterFrame);
  const winner = await onEnterFrame.waitUntil(() => isGroupAlive(groupA) ? groupB : isGroupAlive(groupB) ? groupA : null);
  app.ticker.remove(onEnterFrame);
  return winner;
}
