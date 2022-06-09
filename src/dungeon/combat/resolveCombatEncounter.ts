import { VHand } from "@dungeon/combat/display/compund/VHand";
import { VCombatant } from "@dungeon/combat/display/entities/VCombatant";
import { VCombatantAnimations } from "@dungeon/combat/display/entities/VCombatant.animations";
import { VCombatScene } from "@dungeon/combat/display/entities/VCombatScene";
import { CurrentFloorIndicator } from "@dungeon/combat/display/ui/CurrentFloorIndicator";
import { EndTurnButton } from "@dungeon/combat/display/ui/EndTurnButton";
import { HandBlockerBlock } from "@dungeon/combat/display/ui/HandBlockerBlock";
import { Card, CardTarget, Combatant, CombatantStatus, CombatGroup } from "@dungeon/combat/state/CombatState";
import { generateBloatCard } from "@dungeon/combat/state/StuffFactory";
import { GameSingletons } from "@dungeon/core/GameSingletons";
import { getFloorConfig } from "@dungeon/run/FloorConfig";
import { UserCrossCombatData } from "@dungeon/run/UserCrossCombatData";
import { CurrentSelectionHelper } from "@sdk/CurrentSelectionHelper";
import { drawRect } from "@debug/utils/drawRect";
import { __window__ } from "@debug/__window__";
import { createAnimatedButtonBehavior } from "@sdk-pixi/asorted/createAnimatedButtonBehavior";
import { GlowFilterService } from "@sdk-pixi/asorted/GlowFilterService";
import { Color } from "@sdk/utils/color/Color";
import { lerp } from "@sdk/utils/math";
import { delay } from "@sdk/utils/promises";
import { range } from "@sdk/utils/range";
import { spawnBling } from "./display/fx/bling";
import { ConsumablesList } from "./display/ui/ConsumablesList";
import { Combat } from "./logic/Combat";
import { waitForWinner } from "./waitForWinner";
import { StatusEffectBlueprints, StatusEffectExpiryType } from "./state/StatusEffectBlueprints";
import { Spotlights } from "@surface/__experiments";
import { BLEND_MODES } from "@pixi/constants";
import { createEnchantedFrameLoop } from "@sdk-pixi/asorted/createEnchangedFrameLoop";
import { Point } from "@pixi/math";

export async function resolveCombatEncounter() {
  const app = GameSingletons.getPixiApplicaiton();

  const combat = new Combat();
  combat.ctrl.start(UserCrossCombatData.current, getFloorConfig(UserCrossCombatData.current.currentFloor));

  const vscene = new VCombatScene();
  __window__.container = app.stage.addChildAt(vscene, 0);

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
      unit.startBreathing({
        speed: leftSide ? 4 + Math.random() : 2,
        skew: leftSide ? 0.04 : 0.0,
      });

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

  composeSide(combat.state.groupA, true);
  composeSide(combat.state.groupB, false);

  const vhandOrigin = vscene.getFractionalPosition(0.5, 0.8);
  const vhand = new VHand();
  vhand.cardList = combat.state.groupA.combatants[0].cards.hand;
  vhand.position.set(vhandOrigin.x, vhandOrigin.y);
  vscene.addChild(vhand);
  __window__.hand = vhand;

  vhand.onCardClick = async card => {
    const { combatants } = combat.state.groupA;
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
      await combat.ctrl.disposeCardAfterPlay(card, actor);
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
        return combat.faq.getAliveEnemiesArray(actor);
      }
      case CardTarget.ALL: {
        return combat.faq.getAliveAnyoneArray();
      }
      case CardTarget.FRONT_ENEMY: {
        const foes = combat.faq.getAliveEnemiesArray(actor);
        return foes.length > 0 ? [foes[0]] : [];
      }
      case CardTarget.TARGET_ENEMY: {
        const candidates = combat.faq.getAliveEnemiesArray(actor);
        const choice = await playerSelectTarget(candidates);
        return choice ? [choice] : [];
      }
      case CardTarget.TARGET_ANYONE: {
        const candidates = combat.faq.getAliveAnyoneArray();
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
      if (targets.length === 0) return;

      if (targets.length === 1) {
        const [target] = targets;
        await performTargetedAttack(target, actor, card);
      } else {
        await performSpreadAttack(targets, actor, card);
      }

      // if (!actor.alive) actor.group.combatants.splice(actor.group.combatants.indexOf(target), 1);
      // if (!target.alive) target.group.combatants.splice(target.group.combatants.indexOf(target), 1);

      return;
    }

    if (type === "def") {
      for (const target of targets) {
        await delay(0.1);
        const amountToAdd = combat.faq.calculateBlockPointsToAdd(card, actor);
        combat.ctrl.changeStatus(target, "block", amountToAdd);
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
        for (const [key, delta] of CombatantStatus.entries(mods)) {
          for (const target of targets) {
            await delay(0.1);

            combat.ctrl.changeStatus(target, key, delta);

            if (key === "stunned" || key === "frozen") {
              for (const _ of range(delta)) target.cards.addCardTo(generateBloatCard(key), target.cards.drawPile);
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

    const actor = combat.state.groupA.combatants[0];

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

  async function performTargetedAttack(target: Combatant, attacker: Combatant, card: Card) {
    const atkPwr = combat.faq.calculateAttackPower(card, attacker);
    const {
      directDamage,
      blockedDamage,
      returnedDamage: reflectedDamage,
      healingDamage,
    } = combat.faq.calculateDamage(atkPwr, target, attacker);

    console.log({ directDamage, blockedDamage, reflectedDamage, healingDamage });

    combat.ctrl.dealDamage(target, directDamage, blockedDamage);

    const vatk = combatantsDictionary.get(attacker)!;
    const vdef = combatantsDictionary.get(target)!;
    await VCombatantAnimations.attack(vatk);

    if (healingDamage > 0) {
      combat.ctrl.heal(attacker, healingDamage);
      await VCombatantAnimations.buffHealth(vatk);
    }

    if (target.alive && reflectedDamage > 0) {
      const { directDamage, blockedDamage } = combat.faq.calculateDamage(reflectedDamage, attacker, target);
      combat.ctrl.dealDamage(attacker, directDamage, blockedDamage);
      await VCombatantAnimations.attack(vdef);
    }
  }

  async function performSpreadAttack(targets: Combatant[], attacker: Combatant, card: Card) {
    const atkPwr = combat.faq.calculateAttackPower(card, attacker);

    const damageResults = targets.map(
      target => [target, combat.faq.calculateDamage(atkPwr, target, attacker)] as const
    );

    const vatk = combatantsDictionary.get(attacker)!;
    await VCombatantAnimations.attack(vatk);

    for (const [target, { directDamage, blockedDamage }] of damageResults) {
      combat.ctrl.dealDamage(target, directDamage, blockedDamage);
    }

    for (const [target, { returnedDamage }] of damageResults) {
      if (!target.alive) continue;
      if (!returnedDamage) continue;

      const vdef = combatantsDictionary.get(target)!;
      await VCombatantAnimations.attack(vdef);

      const { directDamage, blockedDamage } = combat.faq.calculateDamage(returnedDamage, attacker, target);
      combat.ctrl.dealDamage(attacker, directDamage, blockedDamage);
    }

    for (const [, { healingDamage }] of damageResults) {
      if (!healingDamage) continue;

      combat.ctrl.heal(attacker, healingDamage);
      await VCombatantAnimations.buffHealth(vatk);
    }
  }

  async function startPlayerTurn() {
    await combat.ctrl.activateCombatantTurnStartStatusEffects(combat.state.groupA);
    await combat.ctrl.resetCombatantsForTurnStart(combat.state.groupA);

    const combatant = combat.state.groupA.combatants[0];
    if (!combatant.alive) return;

    endTurnButtonBehavior.isDisabled.value = true;
    await delay(0.3);
    const cardsToDrawCount = combat.faq.calculateCardsToDrawOnTurnStart(combatant);
    await combat.ctrl.drawCards(cardsToDrawCount, combatant);

    const energyToAdd = combat.faq.calculateEnergyToAddOnTurnStart(combatant);
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

    const combatant = combat.state.groupA.combatants[0];

    if (!combatant.alive) return;

    combatant.energy = 0;

    await combat.ctrl.discardHand(combatant);

    activeCombatant.setCurrent(null);

    await delay(0.1);

    await resolveEnemyTurn();

    if (!combatant.alive) return;

    await startPlayerTurn();
  }

  async function resolveEnemyTurn() {
    vscene.ln.visible = true;

    await combat.ctrl.activateCombatantTurnStartStatusEffects(combat.state.groupB);
    await combat.ctrl.resetCombatantsForTurnStart(combat.state.groupB);

    const playerCombatant = combat.state.groupA.combatants[0];
    if (playerCombatant && combat.state.groupB.combatants.length) {
      for (const foe of combat.state.groupB.combatants) {
        if (!foe.alive) continue;

        if (!playerCombatant.alive) break;

        activeCombatant.setCurrent(foe);

        await delay(0.15);

        const vfoe = combatantsDictionary.get(foe)!;
        vfoe.thought = " ";

        const cardsToDrawCount = combat.faq.calculateCardsToDrawOnTurnStart(foe);
        await combat.ctrl.drawCards(cardsToDrawCount, foe);

        if (!playerCombatant.alive) break;

        if (foe.cards.hand.length > 0) {
          while (foe.cards.hand.length > 0) {
            await delay(0.1);
            const card = foe.cards.hand[foe.cards.hand.length - 1];
            if (card.isBloat) {
              VCombatantAnimations.spawnFloatyText(vfoe, `skip\naction`, 0xd0d0d0);
              await combat.ctrl.discardCard(card, foe);
              await delay(0.9);
              // await VCombatantAnimations.skipAction(vfoe, `skip\naction`);
            } else {
              const targets = combat.ai.chooseCardTargets(foe, card);
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

      for (const foe of combat.state.groupB.combatants) {
        const vfoe = combatantsDictionary.get(foe)!;
        vfoe.thought = foe.alive ? undefined : " ";
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

  function addSpotlightEffect() {
    const spotlights = createEnchantedFrameLoop.andAssignTo(new Spotlights());
    spotlights.tint = 0x0;
    spotlights.alpha = 0.6;
    spotlights.onEnterFrame.watch(
      () => activeCombatant.current,
      combatant => {
        if (!combatant || !combatant.alive) {
          spotlights.visible = false;
          return;
        }

        const vcombatant = combatantsDictionary.get(combatant)!;
        const vcombatantGlobalPosition = vcombatant.toGlobal(new Point());
        const vcombatantSpotlightProps = {
          x: vcombatantGlobalPosition.x / window.innerWidth,
          y: vcombatantGlobalPosition.y / window.innerHeight,
          radius: 0.2,
          lean: 1,
        };
        spotlights.visible = true;
        spotlights.updateSpotlights([vcombatantSpotlightProps]);
        console.log({
          vcombatantGlobalPosition,
          vcombatantSpotlightProps,
        });
      },
      true
    );
    app.stage.addChild(spotlights);
  }
  // addSpotlightEffect();

  await delay(0.6);

  startPlayerTurn();

  const winner = await waitForWinner();

  await vscene.playHideAnimation().then(() => vscene.destroy({ children: true }));

  return winner;
}
