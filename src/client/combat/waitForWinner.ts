import { GameSingletons } from "@client/core/GameSingletons";
import { createEnchantedFrameLoop } from "@game/asorted/createEnchangedFrameLoop";
import { Combat } from "./logic/Combat";

export async function waitForWinner() {
  const app = GameSingletons.getPixiApplicaiton();
  const game = Combat.current;
  const { groupA, groupB }= game.state;
  const { isGroupAlive } = game.faq;

  const onEnterFrame = createEnchantedFrameLoop(app.stage);
  app.ticker.add(onEnterFrame);
  const winner = await onEnterFrame.waitUntil(() => !isGroupAlive(groupA) ? groupB : !isGroupAlive(groupB) ? groupA : null);
  app.ticker.remove(onEnterFrame);
  return winner;
}
