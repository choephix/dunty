import { VCombatant } from "@client/display/entities/VCombatant";
import { VCombatStage } from "@client/display/entities/VCombatStage";
import { Card, Combatant, CombatantStatus, CombatSide as CombatGroup, Game } from "@client/game/game";
import { GameController } from "@client/game/game.controller";
import { drawRect } from "@debug/utils/drawRect";
import { __window__ } from "@debug/__window__";
import { createAnimatedButtonBehavior } from "@game/asorted/createAnimatedButtonBehavior";
import { createEnchantedFrameLoop } from "@game/asorted/createEnchangedFrameLoop";
import { GlowFilterService } from "@game/ui/fx/GlowFilterService";
import { Application } from "@pixi/app";
import { lerp } from "@sdk/utils/math";
import { delay, nextFrame } from "@sdk/utils/promises";
import { VHand } from "./display/compund/VHand";
import { VCombatantAnimations } from "./display/entities/VCombatant.animations";
import { EndTurnButton } from "./display/ui/EndTurnButton";
import { CurrentSelectionHelper } from "./sdk/CurrentSelectionHelper";
import { AdjustmentFilter } from "@pixi/filter-adjustment";
import { Color } from "@sdk/utils/color/Color";
import { statusEffectEmojis } from "./display/entities/VCombatant.emojis";

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
    const centerUnitPosition = container.getFractionalPosition(0.45 + sideMul * 0.2, 0.35);
    for (const [index, char] of state.combatants.entries()) {
      const unit = new VCombatant(char);
      unit.setRightSide(leftSide);

      const ymul = index - (state.combatants.length - 1) / 2;
      unit.position.set(centerUnitPosition.x + sideMul * index * 60, centerUnitPosition.y - ymul * 280);

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

  const glow = new GlowFilterService({ color: 0x30ffff, distance: 30, outerStrength: 1.99, innerStrength: 0.09 });
  // const glow = new FilterService(new AdjustmentFilter({ brightness: 1.2 }));
  const activeCombatant = new CurrentSelectionHelper<Combatant>({
    onSelect: combatant => {
      const vCombatant = combatantsDictionary.get(combatant)!;
      glow.addFilter(vCombatant.statusIndicator);
    },
    onDeselect: combatant => {
      const vCombatant = combatantsDictionary.get(combatant)!;
      glow.removeFrom(vCombatant.statusIndicator);
    },
  });

  composeSide(game.sideA, true);
  composeSide(game.sideB, false);

  const handOrigin = container.getFractionalPosition(0.5, 0.8);
  const hand = new VHand();
  hand.cardList = game.sideA.hand;
  hand.position.set(handOrigin.x, handOrigin.y);
  container.addChild(hand);
  __window__.hand = hand;

  hand.onCardClick = async card => {
    const { hand, combatants } = game.sideA;
    hand.splice(hand.indexOf(card), 1);

    const actor = combatants[0];
    const target = card.type === "atk" ? await selectAttackTarget() : actor;
    await playCard(card, actor, target);

    if (hand.length === 0) {
      endPlayerTurn();
      await delay(0.8);
    }
  };

  async function playCard(card: Card, actor: Combatant, target: Combatant = actor) {
    const { type, mods } = card;

    if (type === "atk") {
      await performAttack(target, actor, card);

      if (!actor.alive) actor.side.combatants.splice(actor.side.combatants.indexOf(target), 1);
      if (!target.alive) target.side.combatants.splice(target.side.combatants.indexOf(target), 1);

      return;
    }

    if (type === "def") {
      const amountToAdd = game.calculateBlockPointsToAdd(card, actor);
      target.status.block += amountToAdd;

      await delay(0.35);
    }

    if (type === "func") {
      const vact = combatantsDictionary.get(actor)!;
      await VCombatantAnimations.spellBegin(vact);

      if (mods) {
        const noFloatyTextKeys = ["health"];
        for (const [key, mod] of CombatantStatus.entries(mods)) {
          target.status[key] += mod;

          if (target.status.stunned > 0 || target.status.frozen > 0) {
            target.nextCard = null;
          }

          if (noFloatyTextKeys.indexOf(key) === -1) {
            VCombatantAnimations.spawnFloatyText(vact, `${statusEffectEmojis[key].icon}${mod}`, 0x607090);
          }
          await delay(0.45);
        }
      }

      // await Promise.resolve(card.effect?.(actor, target));
    }
  }

  async function selectAttackTarget() {
    const candidates = game.sideB.combatants.filter(c => c.alive);
    if (candidates.length === 0) return;

    if (candidates.length === 1) return candidates[0];

    const cleanUp = new Array<Function>();
    const chosen = await new Promise<Combatant>(resolve => {
      for (const candidate of candidates) {
        const vCombatant = combatantsDictionary.get(candidate)!;

        const glow = new GlowFilterService({ color: 0xff0000, distance: 8, outerStrength: 0.99, innerStrength: 0.99 });
        glow.addFilter(vCombatant.sprite);
        cleanUp.push(() => glow.removeFrom(vCombatant.sprite));

        const rect = drawRect(vCombatant, { x: -150, y: -150, width: 300, height: 300 });
        rect.alpha = 0.5;
        rect.renderable = false;
        createAnimatedButtonBehavior(
          rect,
          {
            onUpdate({ hoverProgress }) {
              glow.filter.outerStrength = 1 + hoverProgress;
              glow.filter.color = Color.lerp(0xff7050, 0xff0000, hoverProgress).toInt();
            },
            onClick() {
              resolve(candidate);
            },
          },
          true
        );
        cleanUp.push(() => rect.destroy());
      }
    });
    cleanUp.forEach(fn => fn());

    return chosen;
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
    await GameController.activateCombatantTurnStartStatusEffects(game.sideA);
    await GameController.resetCombatantsForTurnStart(game.sideA);

    for (const foe of game.sideB.combatants) {
      await delay(0.15);

      const vunit = combatantsDictionary.get(foe)!;
      if (foe.status.frozen) {
        foe.nextCard = null;
        vunit.thought = statusEffectEmojis.frozen.icon;
      } else if (foe.status.stunned) {
        foe.nextCard = null;
        vunit.thought = statusEffectEmojis.stunned.icon;
      } else {
        foe.nextCard = Card.generateRandomEnemyCard();
      }
    }

    const combatant = game.sideA.combatants[0];

    endTurnButtonBehavior.isDisabled.value = true;
    await delay(0.3);
    const cardsToDrawCount = game.calculateCardsToDrawOnTurnStart(combatant);
    await GameController.drawCards(cardsToDrawCount, game.sideA);
    await delay(0.3);
    endTurnButtonBehavior.isDisabled.value = false;

    activeCombatant.setCurrent(combatant);
  }

  async function endPlayerTurn() {
    endTurnButtonBehavior.isDisabled.value = true;
    await GameController.discardHand(game.sideA);

    activeCombatant.setCurrent(null);

    await delay(0.1);

    await resolveEnemyTurn();

    await startPlayerTurn();
  }

  async function resolveEnemyTurn() {
    container.ln.visible = true;

    await GameController.activateCombatantTurnStartStatusEffects(game.sideB);
    await GameController.resetCombatantsForTurnStart(game.sideB);

    const playerCombatant = game.sideA.combatants[0];
    if (playerCombatant && game.sideB.combatants.length) {
      for (const foe of game.sideB.combatants) {
        activeCombatant.setCurrent(foe);

        await delay(0.15);

        const card = foe.nextCard;
        foe.nextCard = null;

        if (!card) {
          const vunit = combatantsDictionary.get(foe)!;
          await VCombatantAnimations.noCard(vunit);
        } else {
          const target = card.type === "atk" ? playerCombatant : foe;
          await playCard(card, foe, target);
        }

        await delay(0.1);

        activeCombatant.setCurrent(null);

        await delay(0.1);

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
