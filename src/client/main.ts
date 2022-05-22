import { __addPikachu } from "@debug/special/pikachu";
import { __window__ } from "@debug/__window__";
import { Application } from "@pixi/app";
import { nextFrame } from "@sdk/utils/promises";
import { VCombatStage } from "@client/display/VCombatStage";
import { CombatSide as CombatGroup, Game } from "./game/game";
import { VCombatant } from "./display/VCombatant";
import { VCard } from "./display/VCard";

export async function main(app: Application) {
  await nextFrame();

  const game = new Game(console.warn);
  __window__.game = game;

  const container = new VCombatStage();
  app.stage.addChild(container);

  container.alpha  = 0.5

  function drawSide(state: CombatGroup, leftSide: boolean) {
    const sideMul = leftSide ? -1 : 1;
    const firstUnitPosition = container.getFractionalPosition(0.5 + sideMul * .2, 0.5);
    for (const [index, char] of state.combatants.entries()) {
      const unit = new VCombatant(char);
      unit.setRightSide(leftSide);
      unit.position.set(firstUnitPosition.x + sideMul * index * 100, firstUnitPosition.y - index * 320);
      unit.scale.set(1.1 - .1 * index);
      unit.zIndex = 100 - index;
      container.addChild(unit);
      container.sortChildren();
    }
  }

  drawSide(game.sideA, true);
  drawSide(game.sideB, false);

  const handOrigin = container.getFractionalPosition(0.5, 0.9);
  for (const card of game.sideA.hand) {
    const vcard = new VCard(card);

    vcard.position.set(handOrigin.x, handOrigin.y - 100);
  }
}
