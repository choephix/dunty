import { StatusEffectBlueprints, StatusEffectImpactAlignment } from "@client/game//StatusEffectBlueprints";
import { Card, CardPileType, CardTarget, Combatant, CombatantStatus } from "@client/game/game";
import { getRandomItemFrom } from "@sdk/helpers/arrays";
import { randomIntBetweenIncluding } from "@sdk/utils/random";
import { GameController } from "./game.controller";

export function generateDaggerCard(): Card {
  return {
    cost: 1,
    type: "atk",
    value: 1,
    target: CardTarget.TARGET_ENEMY,
    isToken: true,
  };
}

export function generateBloatCard(key: "stunned" | "frozen"): Card {
  console.log("generateBloatCard", key);
  return {
    cost: 1,
    type: "func",
    mods: { [key]: 0 },
    target: CardTarget.SELF,
    isToken: true,
    isBloat: true,

    gotoAfterPlay: CardPileType.VOID,
    gotoAfterDiscard: CardPileType.VOID,

    onDraw(actor: Combatant) {
      actor.status[key] = -1;
      if (actor.status[key] < 0) actor.status[key] = 0;
    },
    onPlay(actor: Combatant) {
      GameController.drawCards(1, actor);
    },
  };
}

export function generateRandomPlayerCard(): Card {
  return getRandomItemFrom<Card>([
    // generateStatusEffectCard("stunned"),
    // generateStatusEffectCard("frozen"),
    { cost: randomIntBetweenIncluding(0, 3, 2), type: "atk", value: 1, target: CardTarget.ALL_ENEMIES },
    { cost: randomIntBetweenIncluding(0, 3, 2), type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
    { cost: randomIntBetweenIncluding(0, 3, 2), type: "def", value: 2, target: CardTarget.SELF },
    { cost: randomIntBetweenIncluding(0, 3, 2), type: "def", value: 3, target: CardTarget.SELF },
    { cost: randomIntBetweenIncluding(0, 3, 2), type: "func", mods: { health: 2 }, target: CardTarget.SELF },
    generateStatusEffectCard(),
    generateStatusEffectCard(),
    generateStatusEffectCard(),
  ]);
}

export function generateRandomEnemyCard(): Card {
  return getRandomItemFrom<Card>([
    { cost: 1, type: "atk", value: 1, target: CardTarget.TARGET_ENEMY },
    { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
    { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
    // generateStatusEffectCard(),
    // generateStatusEffectCard(),
    // generateStatusEffectCard(),
    // generateStatusEffectCard(),
    // generateStatusEffectCard(),
    // generateStatusEffectCard(),
    // generateStatusEffectCard("frozen"),
  ]);
}

function generateStatusEffectCard(statusProperty?: keyof CombatantStatus): Card {
  const sampleCombatant = new Combatant();

  const keys = Object.keys(StatusEffectBlueprints) as (keyof CombatantStatus)[];
  const key = statusProperty || (getRandomItemFrom(Object.keys(sampleCombatant.status)) as keyof CombatantStatus);
  const { impactAlignment } = StatusEffectBlueprints[key];

  const MAP = {
    [StatusEffectImpactAlignment.POSITIVE]: getRandomItemFrom([CardTarget.SELF]),
    [StatusEffectImpactAlignment.NEUTRAL]: getRandomItemFrom([CardTarget.ALL]),
    [StatusEffectImpactAlignment.NEGATIVE]: getRandomItemFrom([
      CardTarget.TARGET_ENEMY,
      CardTarget.FRONT_ENEMY,
      CardTarget.ALL_ENEMIES,
    ]),
  };

  return { cost: 1, type: "func", mods: { [key]: 2 }, target: MAP[impactAlignment] || CardTarget.ALL };
}
