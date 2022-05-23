import { VCombatant } from "@client/display/entities/VCombatant";
import { VCombatStage } from "@client/display/entities/VCombatStage";
import { Card, Combatant, CombatSide as CombatGroup, Game } from "@client/game/game";
import { GameController } from "@client/game/game.controller";
import { __window__ } from "@debug/__window__";
import { createAnimatedButtonBehavior } from "@game/asorted/createAnimatedButtonBehavior";
import { createEnchantedFrameLoop } from "@game/asorted/createEnchangedFrameLoop";
import { Application } from "@pixi/app";
import { lerp } from "@sdk/utils/math";
import { delay, nextFrame } from "@sdk/utils/promises";
import { VHand } from "./display/compund/VHand";
import { VCombatantAnimations } from "./display/entities/VCombatant.animations";
import { EndTurnButton } from "./display/ui/EndTurnButton";

export let game: Game;

export async function main(app: Application) {
  await nextFrame();

  while (true) {
    await startGame(app);
  }
}

export async function startGame(app: Application) {
  await nextFrame();

  game = __window__.game = new Game();

  game.start();

  const container = new VCombatStage();
  app.stage.addChild(container);

  await container.playShowAnimation();

  const combatantsDictionary = new Map<Combatant, VCombatant>();
  function composeSide(state: CombatGroup, leftSide: boolean) {
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

      unit.visible = false;
      unit.waitUntilLoaded().then(async () => {
        unit.visible = true;
        VCombatantAnimations.enter(unit);
      });
    }
  }

  composeSide(game.sideA, true);
  composeSide(game.sideB, false);

  const handOrigin = container.getFractionalPosition(0.5, 0.8);
  const hand = new VHand();
  hand.cardList = game.sideA.hand;
  hand.position.set(handOrigin.x, handOrigin.y);
  container.addChild(hand);
  __window__.hand = hand;

  hand.onCardClick = async card => {
    game.sideA.hand.splice(game.sideA.hand.indexOf(card), 1);

    const actor = game.sideA.combatants[0];
    const target = card.type === "atk" ? game.sideB.combatants[0] : game.sideA.combatants[0];
    await playCard(card, actor, target);
  };

  async function playCard(card: Card, actor: Combatant, target: Combatant = actor) {
    if (card.type === "atk") {
      await performAttack(target, actor, card);

      if (!actor.alive) actor.side.combatants.splice(actor.side.combatants.indexOf(target), 1);
      if (!target.alive) target.side.combatants.splice(target.side.combatants.indexOf(target), 1);

      return;
    }

    if (card.type === "def") {
      target.status.block += card.value || 0;

      await delay(.35)
    }

    if (card.type === "func") {
      const vact = combatantsDictionary.get(actor)!;
      await VCombatantAnimations.spellBegin(vact);

      await Promise.resolve(card.effect?.(actor, target));
    }
  }

  async function dealDamage(target: Combatant, directDamage: number, blockDamage: number) {
    target.status.block -= blockDamage;
    target.status.health -= directDamage;
  }

  async function performAttack(target: Combatant, attacker: Combatant, card: Card) {
    const atkPwr = game.calculateAttackPower(card, attacker, target);
    const { directDamage, blockedDamage } = game.calculateDamage(atkPwr, target);

    dealDamage(target, directDamage, blockedDamage);

    const vatk = combatantsDictionary.get(attacker)!;
    const vdef = combatantsDictionary.get(target)!;
    await VCombatantAnimations.attack(vatk, vdef);

    if (target.alive) {
      if (target.status.retaliation) {
        const { directDamage, blockedDamage } = game.calculateDamage(target.status.retaliation || 0, target);
        dealDamage(attacker, directDamage, blockedDamage);
        await VCombatantAnimations.attack(vdef, vatk);
      }
    }
  }

  async function startPlayerTurn() {
    game.sideA.onTurnStart();

    for (const foe of game.sideB.combatants) {
      await delay(0.15);
      foe.nextCard = Card.generateRandomEnemyCard();
    }

    endTurnButtonBehavior.isDisabled.value = true;
    await delay(0.3);
    await GameController.drawCards(4, game.sideA);
    await delay(0.3);
    endTurnButtonBehavior.isDisabled.value = false;
  }

  async function endPlayerTurn() {
    endTurnButtonBehavior.isDisabled.value = true;
    await GameController.discardHand(game.sideA);

    await delay(0.1);

    await resolveEnemyTurn();

    await startPlayerTurn();
  }

  async function resolveEnemyTurn() {
    container.ln.visible = true;

    game.sideB.onTurnStart();

    const playerCombatant = game.sideA.combatants[0];
    if (playerCombatant && game.sideB.combatants.length) {
      for (const foe of game.sideB.combatants) {
        await delay(0.35);

        const card = foe.nextCard;
        foe.nextCard = null;

        if (!card) {
          const vunit = combatantsDictionary.get(foe)!;
          await VCombatantAnimations.noCard(vunit);
        } else {
          const target = card.type === "atk" ? playerCombatant : foe;
          await playCard(card, foe, target);
        }

        if (!playerCombatant.alive) break;
      }

      if (!game.sideA.combatants[0]?.alive) return;

      await delay(0.4);
    }

    container.ln.visible = false;
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

  const onEnterFrame = createEnchantedFrameLoop(container);
  app.ticker.add(onEnterFrame);
  await onEnterFrame.waitUntil(() => !game.sideA.combatants.length || !game.sideB.combatants.length);
  app.ticker.remove(onEnterFrame);

  await container.playHideAnimation();
  container.destroy({ children: true });

  console.log("Game over");

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
