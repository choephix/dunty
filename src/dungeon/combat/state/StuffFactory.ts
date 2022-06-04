import { Card, CardPileType, CardTarget, Combatant, CombatantStatus } from "@dungeon/combat/state/CombatState";
import { StatusEffectBlueprints, StatusEffectImpactAlignment } from "@dungeon/combat/state/StatusEffectBlueprints";
import { getRandomItemFrom } from "@sdk/helpers/arrays";
import { randomIntBetweenIncluding } from "@sdk/utils/random";
import { Combat } from "../logic/Combat";

export function generateDaggerCard(): Card {
  return {
    cost: 0,
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
      Combat.current!.ctrl.drawCards(1, actor);
    },

    description: `${key.toUpperCase()}\nPlay to draw a card\n(player only)`,
  };
}

export function generateRandomPlayerCard(): Card {
  return getRandomItemFrom<Card>([
    // generateStatusEffectCard("stunned"),
    // generateStatusEffectCard("frozen"),
    { cost: randomIntBetweenIncluding(0, 3), type: "atk", value: 1, target: CardTarget.ALL_ENEMIES },
    { cost: randomIntBetweenIncluding(0, 3), type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
    { cost: randomIntBetweenIncluding(0, 3), type: "def", value: 2, target: CardTarget.SELF },
    { cost: randomIntBetweenIncluding(0, 3), type: "def", value: 3, target: CardTarget.SELF },
    { cost: randomIntBetweenIncluding(0, 3), type: "func", mods: { health: 2 }, target: CardTarget.SELF },
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
  const ignore = ["cold", "oiled", "warm", "wet", "taunt"];

  const xMap = {
    health: 2,
    block: 2,
    parry: 2,
    reflect: 2,
    retaliation: 2,
    protection: 2,
    brittle: 2,
    exposed: 2,
    doomed: 2,
    leech: 2,
    regeneration: 3,
    strength: 2,
    rage: 2,
    fury: 2,
    haste: 2,
    tactical: 2,
    daggers: 2,
    defensive: 1,
    weak: 2,
    burning: 3,
    poisoned: 3,
    bleeding: 3,
    stunned: 2,
    frozen: 2,
  }
  console.log(`generateStatusEffectCard`, statusProperty, xMap[statusProperty!]);
  const value = xMap[statusProperty!] || randomIntBetweenIncluding(1, 3, 2);

  let keys = Object.keys(StatusEffectBlueprints) as (keyof CombatantStatus)[];
  keys = keys.filter(key => !ignore.includes(key));
  const key = statusProperty || getRandomItemFrom(keys);
  const { impactAlignment } = StatusEffectBlueprints[key];

  const TARGET_MAP = {
    [StatusEffectImpactAlignment.POSITIVE]: getRandomItemFrom([CardTarget.SELF]),
    [StatusEffectImpactAlignment.NEUTRAL]: getRandomItemFrom([CardTarget.ALL]),
    [StatusEffectImpactAlignment.NEGATIVE]: getRandomItemFrom([
      CardTarget.TARGET_ENEMY,
      CardTarget.FRONT_ENEMY,
      CardTarget.ALL_ENEMIES,
    ]),
  };

  return { cost: 1, type: "func", mods: { [key]: value }, target: TARGET_MAP[impactAlignment] || CardTarget.ALL };
}
