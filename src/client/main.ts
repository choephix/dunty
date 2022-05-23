import { VCombatant } from "@client/display/entities/VCombatant";
import { VCombatStage } from "@client/display/entities/VCombatStage";
import { Card, Combatant, CombatSide as CombatGroup, Game } from "@client/game/game";
import { GameController } from "@client/game/game.controller";
import { __window__ } from "@debug/__window__";
import { createAnimatedButtonBehavior } from "@game/asorted/createAnimatedButtonBehavior";
import { Application } from "@pixi/app";
import { buttonizeInstance } from "@sdk-ui/buttonize";
import { lerp } from "@sdk/utils/math";
import { delay, nextFrame } from "@sdk/utils/promises";
import { VHand } from "./display/compund/VHand";
import { VCombatantAnimations } from "./display/entities/VCombatant.animations";
import { EndTurnButton } from "./display/ui/EndTurnButton";

export let game: Game;

export async function main(app: Application) {
  await nextFrame();

  game = __window__.game = new Game(console.warn);

  const container = new VCombatStage();
  app.stage.addChild(container);

  const combatantsDictionary = new Map<Combatant, VCombatant>();
  function drawSide(state: CombatGroup, leftSide: boolean) {
    const sideMul = leftSide ? -1 : 1;
    const firstUnitPosition = container.getFractionalPosition(0.5 + sideMul * 0.2, 0.55);
    for (const [index, char] of state.combatants.entries()) {
      const unit = new VCombatant(char);
      unit.setRightSide(leftSide);
      unit.position.set(firstUnitPosition.x + sideMul * index * 60, firstUnitPosition.y - index * 240);
      unit.scale.set(1.1 - 0.1 * index);
      unit.zIndex = 100 - index;
      container.addChild(unit);
      container.sortChildren();

      combatantsDictionary.set(char, unit);

      const { behavior } = buttonizeInstance(unit);
      behavior.on({
        hoverIn: () => (container.ln.visible = true),
        hoverOut: () => (container.ln.visible = false),
      });

      unit.visible = false;
      unit.waitUntilLoaded().then(async () => {
        unit.visible = true;
        VCombatantAnimations.enter(unit);
      });
    }
  }

  drawSide(game.sideA, true);
  drawSide(game.sideB, false);

  const handOrigin = container.getFractionalPosition(0.5, 0.8);
  const hand = new VHand();
  hand.cardList = game.sideA.hand;
  hand.position.set(handOrigin.x, handOrigin.y);
  container.addChild(hand);
  __window__.hand = hand;

  hand.onCardClick = async card => {
    game.sideA.hand.splice(game.sideA.hand.indexOf(card), 1);

    if (card.type === "atk") {
      const target = game.sideB.combatants[0];
      performAttack(target, game.sideA.combatants[0], card);

      if (target.health <= 0) {
        game.sideB.combatants.splice(game.sideB.combatants.indexOf(target), 1);
      }
    }

    if (card.type === "def") {
      const target = game.sideA.combatants[0];
      target.block += card.value || 0;
    }
  };

  async function performAttack(target: Combatant, attacker: Combatant, card: Card) {
    const { directDamage, blockDamage } = game.calculateAttackDamage(card, attacker, target);
    target.block -= blockDamage;
    target.health -= directDamage;

    const vatk = combatantsDictionary.get(attacker)!;
    const vdef = combatantsDictionary.get(target)!;
    VCombatantAnimations.attack(vatk, vdef);
  }

  async function startPlayerTurn() {
    endTurnButtonBehavior.isDisabled.value = true;
    await GameController.drawCards(4, game.sideA);
    await delay(0.3);
    endTurnButtonBehavior.isDisabled.value = false;
  }

  async function endPlayerTurn() {
    endTurnButtonBehavior.isDisabled.value = true;
    await GameController.discardHand(game.sideA);

    await delay(0.1);

    for (const foe of game.sideB.combatants) {
      await delay(0.4);

      const card = Card.generateRandomCard();

      if (card.type === "atk") {
        const target = game.sideA.combatants[0];
        performAttack(target, foe, card);
      }

      if (card.type === "def") {
        foe.block += card.value || 0;
      }
    }

    await delay(0.1);

    await startPlayerTurn();
  }

  const endTurnButton = new EndTurnButton();
  endTurnButton.position.copyFrom(container.getFractionalPosition(0.5, 0.9));
  container.addChild(endTurnButton);
  const endTurnButtonBehavior = createAnimatedButtonBehavior(
    endTurnButton,
    {
      onClick: () => {
        endPlayerTurn();
      },
      onUpdate: ({ pressProgress, hoverProgress, disableProgress }) => {
        endTurnButton.alpha = Math.pow(1 - disableProgress, 4) * lerp(0.4, 1.0, hoverProgress);
        endTurnButton.pivot.y = -10 * pressProgress;
        endTurnButton.scale.set(1.0 + Math.pow(disableProgress, 2), Math.pow(1.0 - disableProgress, 4));
      },
    },
    {
      disableProgress: 1,
    }
  );

  await delay(0.6);
  startPlayerTurn();

  // const handOrigin = container.getFractionalPosition(0.5, 0.8);
  // for (const [index, card] of game.sideA.hand.entries()) {
  //   const vcard = new VCard(card);

  //   const xmul = index - (game.sideA.hand.length - 1) / 2;
  //   const delta = Math.min(200, 0.9 * container.designWidth / game.sideA.hand.length);
  //   vcard.position.set(handOrigin.x + delta * xmul, handOrigin.y - 100);
  //   vcard.scale.set(0.4);
  //   container.addChild(vcard);
  // }
}
