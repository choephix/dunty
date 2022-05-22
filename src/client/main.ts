import { __addPikachu } from "@debug/special/pikachu";
import { __window__ } from "@debug/__window__";
import { Application } from "@pixi/app";
import { nextFrame } from "@sdk/utils/promises";
import { VCombatStage } from "@client/display/VCombatStage";
import { CombatSide as CombatGroup, Game } from "./game/game";
import { VCombatant } from "./display/VCombatant";
import { VCard } from "./display/VCard";
import { GameController } from "./game/game.controller";
import { buttonizeInstance } from "@sdk-ui/buttonize";

export async function main(app: Application) {
  await nextFrame();

  const game = new Game(console.warn);
  __window__.game = game;

  const container = new VCombatStage();
  app.stage.addChild(container);

  function drawSide(state: CombatGroup, leftSide: boolean) {
    const sideMul = leftSide ? -1 : 1;
    const firstUnitPosition = container.getFractionalPosition(0.5 + sideMul * 0.2, 0.55);
    for (const [index, char] of state.combatants.entries()) {
      const unit = new VCombatant(char);
      unit.setRightSide(leftSide);
      unit.position.set(firstUnitPosition.x + sideMul * index * 100, firstUnitPosition.y - index * 320);
      unit.scale.set(1.1 - 0.1 * index);
      unit.zIndex = 100 - index;
      container.addChild(unit);
      container.sortChildren();

      const { behavior } = buttonizeInstance(unit);
      behavior.on({
        hoverIn: () => container.ln.visible = true,
        hoverOut: () => container.ln.visible = false,
      })
    }
  }

  drawSide(game.sideA, true);
  drawSide(game.sideB, false);

  GameController.drawCards(5, game.sideA);

  const handOrigin = container.getFractionalPosition(0.5, 0.8);
  for (const [index, card] of game.sideA.hand.entries()) {
    const vcard = new VCard(card);
    
    const xmul = index - (game.sideA.hand.length - 1) / 2;
    const delta = Math.min(200, 0.9 * container.designWidth / game.sideA.hand.length);
    vcard.position.set(handOrigin.x + delta * xmul, handOrigin.y - 100);
    vcard.scale.set(0.4);
    container.addChild(vcard);
  }
}
