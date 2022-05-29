import { GameSingletons } from "@client/core/GameSingletons";
import { VHand } from "@client/combat/display/compund/VHand";
import { VCombatant } from "@client/combat/display/entities/VCombatant";
import { VCombatantAnimations } from "@client/combat/display/entities/VCombatant.animations";
import { VCombatScene } from "@client/combat/display/entities/VCombatScene";
import { CurrentFloorIndicator } from "@client/combat/display/ui/CurrentFloorIndicator";
import { EndTurnButton } from "@client/combat/display/ui/EndTurnButton";
import { HandBlockerBlock } from "@client/combat/display/ui/HandBlockerBlock";
import { getFloorConfig, UserCrossCombatData } from "@client/combat/state/data";
import { Card, CardTarget, Combatant, CombatantStatus, CombatGroup, Game } from "@client/combat/state/game";
import { CombatAI } from "@client/combat/state/game.ai";
import { GameController } from "@client/combat/state/game.controller";
import { generateBloatCard } from "@client/combat/state/game.factory";
import { GameFAQ } from "@client/combat/state/game.faq";
import { CurrentSelectionHelper } from "@client/sdk/CurrentSelectionHelper";
import { drawRect } from "@debug/utils/drawRect";
import { __window__ } from "@debug/__window__";
import { createAnimatedButtonBehavior } from "@game/asorted/createAnimatedButtonBehavior";
import { GlowFilterService } from "@game/ui/fx/GlowFilterService";
import { Color } from "@sdk/utils/color/Color";
import { lerp } from "@sdk/utils/math";
import { delay } from "@sdk/utils/promises";
import { range } from "@sdk/utils/range";
import { waitForWinner } from "../main/waitForWinner";
import { ConsumablesList } from "./display/ui/ConsumablesList";
import { spawnBling } from "./display/fx/bling";

export let game: Game;

export async function resolveCombatEncounter() {
  const app = GameSingletons.getPixiApplicaiton();

  game = __window__.game = new Game();
  game.start(UserCrossCombatData.current, getFloorConfig(UserCrossCombatData.current.currentFloor));

  const vscene = new VCombatScene();
  __window__.container = app.stage.addChild(vscene);

  await vscene.playShowAnimation();

  {
    const flrIndicator = new CurrentFloorIndicator();
    flrIndicator.position.copyFrom(vscene.getFractionalPosition(0.5, 0.01));
    vscene.addChild(flrIndicator);
  }

  {
    const vconsumables = new ConsumablesList();
    vconsumables.position.copyFrom(vscene.getFractionalPosition(0.5, 0.98));
    vscene.addChild(vconsumables);
  }

  const combatantsDictionary = new Map<Combatant, VCombatant>();
  function composeSide(state: CombatGroup, leftSide: boolean) {
    const sideMul = leftSide ? -1 : 1;
    const centerUnitPosition = vscene.getFractionalPosition(0.43 + sideMul * 0.17, 0.3);
    for (const [index, char] of state.combatants.entries()) {
      const unit = new VCombatant(char);
      unit.setRightSide(leftSide);

      const ymul = index - (state.combatants.length - 1) / 2;
      unit.position.set(centerUnitPosition.x + sideMul * index * 90, centerUnitPosition.y - ymul * 300 + sideMul * 80);

      unit.scale.set(1.1 - 0.1 * index);
      unit.zIndex = 100 - index;
      vscene.addChild(unit);
      vscene.sortChildren();

      unit.intentionIndicator.visible = !leftSide;

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
      glow.addFilter(vCombatant.statusIndicators);
    },
    onDeselect: combatant => {
      const vCombatant = combatantsDictionary.get(combatant)!;
      glow.removeFrom(vCombatant.statusIndicators);
    },
  });

  composeSide(game.groupA, true);
  composeSide(game.groupB, false);

  const vhandOrigin = vscene.getFractionalPosition(0.5, 0.8);
  const vhand = new VHand();
  vhand.cardList = game.groupA.combatants[0].cards.hand;
  vhand.position.set(vhandOrigin.x, vhandOrigin.y);
  vscene.addChild(vhand);
  __window__.hand = vhand;

  vhand.onCardClick = async card => {
    const { combatants } = game.groupA;
    const [actor] = combatants;

    if (card.cost > actor.energy) {
      const vactor = combatantsDictionary.get(actor)!;
      VCombatantAnimations.spawnFloatyText(vactor, "⦿\nNo ENERGEY!", 0xff4040);
      return;
    }

    const targets = await getPlayerCardTargets(card, actor);

    actor.energy -= card.cost;

    spawnBling(vhand.cardSprites.get(card)!.position, vhand);
    await playCardFromHand(card, actor, targets);

    if (actor.cards.hand.length === 0) {
      endTurnButtonBehavior.isDisabled.value = true;
      await delay(0.8);
      if (activeCombatant.current === actor) endPlayerTurn();
    }
  };

  async function playCardFromHand(card: Card, actor: Combatant, targets: Combatant[]) {
    try {
      const { hand } = actor.cards;
      hand.splice(hand.indexOf(card), 1);
      await resolveCardEffect(card, actor, targets);
      await GameController.disposeCardAfterPlay(card, actor);
    } catch (error) {
      console.error(error);
    }
  }

  async function getPlayerCardTargets(card: Card, actor: Combatant) {
    switch (card.target) {
      case CardTarget.SELF: {
        return [actor];
      }
      case CardTarget.ALL_ENEMIES: {
        return GameFAQ.getAliveEnemiesArray(actor);
      }
      case CardTarget.ALL: {
        return GameFAQ.getAliveAnyoneArray();
      }
      case CardTarget.FRONT_ENEMY: {
        const foes = GameFAQ.getAliveEnemiesArray(actor);
        return foes.length > 0 ? [foes[0]] : [];
      }
      case CardTarget.TARGET_ENEMY: {
        const candidates = GameFAQ.getAliveEnemiesArray(actor);
        const choice = await playerSelectTarget(candidates);
        return choice ? [choice] : [];
      }
      case CardTarget.TARGET_ANYONE: {
        const candidates = GameFAQ.getAliveAnyoneArray();
        const choice = await playerSelectTarget(candidates);
        return choice ? [choice] : [];
      }
      default:
        console.error(`getValidTargetsArray: invalid target ${card.target}`);
        return [actor];
    }
  }

  async function resolveCardEffect(card: Card, actor: Combatant, targets: Combatant[]) {
    const { type, mods, onPlay: func } = card;

    if (type === "atk") {
      const [target] = targets;

      await performAttack(target, actor, card);

      if (!actor.alive) actor.group.combatants.splice(actor.group.combatants.indexOf(target), 1);
      if (!target.alive) target.group.combatants.splice(target.group.combatants.indexOf(target), 1);

      return;
    }

    if (type === "def") {
      for (const target of targets) {
        await delay(0.1);
        const amountToAdd = game.calculateBlockPointsToAdd(card, actor);
        target.status.block += amountToAdd;
      }

      await delay(0.35);
    }

    if (type === "func") {
      const vactor = combatantsDictionary.get(actor)!;

      if (!card.isBloat) {
        await VCombatantAnimations.spellBegin(vactor);
      }

      if (func) {
        func(actor, targets);
      }

      if (mods) {
        for (const [key, mod] of CombatantStatus.entries(mods)) {
          for (const target of targets) {
            await delay(0.1);

            target.status[key] += mod;
            if (target.status[key] < 0) target.status[key] = 0;

            if (key === "stunned" || key === "frozen") {
              for (const _ of range(mod)) target.cards.addCardTo(generateBloatCard(key), target.cards.drawPile);
            }

            await delay(0.1);
          }

          await delay(0.55);
        }
      }

      // await Promise.resolve(card.effect?.(actor, target));
    }
  }

  async function playerSelectTarget(candidates: Combatant[]) {
    if (candidates.length === 0) return;

    if (candidates.length === 1) return candidates[0];

    const bl = new HandBlockerBlock("Choose a target");
    bl.position.set(vhandOrigin.x, vhandOrigin.y - 100);
    vscene.addChild(bl);

    const actor = game.groupA.combatants[0];

    const cleanUp = new Array<Function>();
    const chosen = await new Promise<Combatant>(resolve => {
      for (const candidate of candidates) {
        const vCombatant = combatantsDictionary.get(candidate)!;

        const glow = new GlowFilterService({ color: 0xff0000, distance: 8, outerStrength: 0.99, innerStrength: 0.99 });
        glow.addFilter(vCombatant.sprite);
        cleanUp.push(() => glow.removeFrom(vCombatant.sprite));

        vCombatant.highlight.visible = true;
        vCombatant.highlight.tint = actor.group.combatants.indexOf(candidate) > 0 ? 0x00ffff : 0xff0000;

        const rect = drawRect(vCombatant, { x: -150, y: -150, width: 300, height: 300 });
        rect.alpha = 0.5;
        rect.renderable = false;
        createAnimatedButtonBehavior(
          rect,
          {
            onUpdate({ hoverProgress }) {
              glow.filter.outerStrength = 1 + hoverProgress;
              glow.filter.color = Color.lerp(0xff7050, 0xff0000, hoverProgress).toInt();

              vCombatant.highlight.alpha = 0.3 + hoverProgress;
            },
            onClick() {
              resolve(candidate);
            },
          },
          true
        );
        cleanUp.push(() => rect.destroy());
        cleanUp.push(() => (vCombatant.highlight.visible = false));
      }
    });
    cleanUp.forEach(fn => fn());

    bl.destroy();

    return chosen;
  }

  async function dealDamage(target: Combatant, directDamage: number, blockDamage: number) {
    target.status.block -= blockDamage;
    target.status.health -= directDamage;
  }

  async function performAttack(target: Combatant, attacker: Combatant, card: Card) {
    const atkPwr = game.calculateAttackPower(card, attacker, target);
    const { directDamage, blockedDamage, reflectedDamage, healingDamage } = game.calculateDamage(atkPwr, target, attacker);

    console.log({ directDamage, blockedDamage, reflectedDamage, healingDamage });

    dealDamage(target, directDamage, blockedDamage);

    const vatk = combatantsDictionary.get(attacker)!;
    const vdef = combatantsDictionary.get(target)!;
    await VCombatantAnimations.attack(vatk);

    if (target.alive && reflectedDamage > 0) {
      const { directDamage, blockedDamage } = game.calculateDamage(reflectedDamage, attacker, target);
      dealDamage(attacker, directDamage, blockedDamage);
      await VCombatantAnimations.attack(vdef);
    }

    if (healingDamage > 0) {
      attacker.status.health += healingDamage;
      await VCombatantAnimations.buffHealth(vatk);
    }
  }

  async function startPlayerTurn() {
    await GameController.activateCombatantTurnStartStatusEffects(game.groupA);
    await GameController.resetCombatantsForTurnStart(game.groupA);

    const combatant = game.groupA.combatants[0];
    if (!combatant.alive) return;

    endTurnButtonBehavior.isDisabled.value = true;
    await delay(0.3);
    const cardsToDrawCount = game.calculateCardsToDrawOnTurnStart(combatant);
    await GameController.drawCards(cardsToDrawCount, combatant);

    const energyToAdd = game.calculateEnergyToAddOnTurnStart(combatant);
    for (const _ of range(energyToAdd)) {
      await delay(0.033);
      combatant.energy++;
    }

    await delay(0.3);
    endTurnButtonBehavior.isDisabled.value = false;

    activeCombatant.setCurrent(combatant);
  }

  async function endPlayerTurn() {
    endTurnButtonBehavior.isDisabled.value = true;

    const combatant = game.groupA.combatants[0];

    if (!combatant.alive) return;

    combatant.energy = 0;

    await GameController.discardHand(combatant);

    activeCombatant.setCurrent(null);

    await delay(0.1);

    await resolveEnemyTurn();

    if (!combatant.alive) return;

    await startPlayerTurn();
  }

  async function resolveEnemyTurn() {
    vscene.ln.visible = true;

    await GameController.activateCombatantTurnStartStatusEffects(game.groupB);
    await GameController.resetCombatantsForTurnStart(game.groupB);
    
    const playerCombatant = game.groupA.combatants[0];
    if (playerCombatant && game.groupB.combatants.length) {
      for (const foe of game.groupB.combatants) {
        if (!playerCombatant.alive) break;
        
        activeCombatant.setCurrent(foe);

        await delay(0.15);

        const vfoe = combatantsDictionary.get(foe)!;
        vfoe.thought = " ";

        const cardsToDrawCount = game.calculateCardsToDrawOnTurnStart(foe);
        await GameController.drawCards(cardsToDrawCount, foe);
        
        if (!playerCombatant.alive) break;

        if (foe.cards.hand.length > 0) {
          while (foe.cards.hand.length > 0) {
            await delay(0.1);
            const card = foe.cards.hand[foe.cards.hand.length - 1];
            if (card.isBloat) {
              VCombatantAnimations.spawnFloatyText(vfoe, `skip\naction`, 0xd0d0d0);
              await GameController.discardCard(card, foe);
              await delay(0.9);
              // await VCombatantAnimations.skipAction(vfoe, `skip\naction`);
            } else {
              const targets = CombatAI.chooseCardTargets(foe, card);
              // console.log(`AI plays ${card.type.toUpperCase()} on ${targets}`);
              console.log(`AI plays ${JSON.stringify(card)} on ${targets}`);
              await playCardFromHand(card, foe, targets);
              await delay(0.1);
            }
          }
        } else {
          await VCombatantAnimations.noCard(vfoe);
        }

        activeCombatant.setCurrent(null);

        await delay(0.1);

        if (!playerCombatant.alive) break;
      }

      await delay(0.4);

      for (const foe of game.groupB.combatants) {
        const vfoe = combatantsDictionary.get(foe)!;
        vfoe.thought = undefined;
        await delay(0.1);
      }
    }

    vscene.ln.visible = false;
  }

  const endTurnButton = new EndTurnButton();
  endTurnButton.position.copyFrom(vscene.getFractionalPosition(0.5, 0.9));
  vscene.addChild(endTurnButton);
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

  const winner = await waitForWinner();

  await vscene.playHideAnimation().then(() => vscene.destroy({ children: true }));

  return winner;
}
