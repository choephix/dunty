import { Card, CardPileType, CardTarget, Combatant, CombatantStatus } from "@dungeon/combat/state/CombatState";
import { StatusEffectBlueprints, StatusEffectImpactAlignment } from "@dungeon/combat/state/StatusEffectBlueprints";
import { createRandomizedFactory } from "@sdk/createRandomizedFactory";
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

    onDraw(actor: Combatant, combat: Combat) {
      combat.ctrl.decrementStatus(actor, key);
    },
    onPlay(actor: Combatant) {
      Combat.current!.ctrl.drawCards(1, actor);
    },

    description: `${key.toUpperCase()}\nPlay to draw a card\n(player only)`,
  };
}

export const generateRandomPlayerCard = createRandomizedFactory<() => Card>([
  [
    8,
    () => {
      const pow = randomIntBetweenIncluding(0, 3);
      return { cost: pow, type: "atk", value: 1 + pow * 2, target: CardTarget.TARGET_ENEMY };
    },
  ],
  [
    4,
    () => {
      const pow = randomIntBetweenIncluding(0, 3);
      return { cost: pow, type: "atk", value: 1 + pow, target: CardTarget.ALL_ENEMIES };
    },
  ],
  [
    8,
    () => {
      const pow = randomIntBetweenIncluding(0, 3);
      return { cost: pow, type: "def", value: 2 + pow * 2, target: CardTarget.SELF };
    },
  ],
  [
    4,
    () => {
      const pow = randomIntBetweenIncluding(0, 3);
      return { cost: pow, type: "func", mods: { health: 1 + pow * 2 }, target: CardTarget.SELF };
    },
  ],
  [24, generateStatusEffectCard],
]);

function generateStatusEffectCard(statusProperty?: keyof CombatantStatus): Card {
  const ignore = ["cold", "oiled", "warm", "wet", "taunt", "health", "block"];

  const xMap = {
    // health: 1,
    // block: 1,
    parry: 1,
    reflect: 1,
    retaliation: 1,
    protection: 1,
    brittle: 1,
    exposed: 1,
    doomed: 1,
    leech: 1,
    strength: 1,
    rage: 1,
    fury: 1,
    haste: 1,
    tactical: 1,
    daggers: 1,
    defensive: 1,
    weak: 1,
    stunned: 1,
    frozen: 1,
    burning: 2,
    poisoned: 2,
    bleeding: 2,
    regeneration: 2,
  };
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

  const pow = randomIntBetweenIncluding(0, 3);

  return {
    cost: pow,
    type: "func",
    mods: { [key]: 1 + pow * value },
    target: TARGET_MAP[impactAlignment] || CardTarget.ALL,
  };
}
