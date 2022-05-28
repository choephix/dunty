import { Card, CardTarget } from "./game";

export module CardPools {
  export const playerStartingCards: Card[] = [
    { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
    { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
    { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
    { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
    { cost: 1, type: "atk", value: 1, target: CardTarget.ALL_ENEMIES },
    { cost: 2, type: "atk", value: 5, target: CardTarget.FRONT_ENEMY },
    { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
    { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
    { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
    { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
  ];

  const playerCardsToChooseFrom: Card[][] = [
    [
      { cost: 1, type: "func", mods: { retaliation: 2 }, target: CardTarget.SELF },
      { cost: 1, type: "def", value: 3, target: CardTarget.SELF },
      { cost: 2, type: "def", value: 5, target: CardTarget.SELF },
      { cost: 1, type: "func", mods: { health: 2 }, target: CardTarget.SELF },
      { cost: 2, type: "func", mods: { health: 4 }, target: CardTarget.SELF },
    ],
    [
      { cost: 1, type: "atk", value: 2, target: CardTarget.ALL_ENEMIES },
      { cost: 3, type: "atk", value: 4, target: CardTarget.ALL_ENEMIES },
      { cost: 2, type: "atk", value: 4, target: CardTarget.TARGET_ENEMY },
      { cost: 1, type: "atk", value: 3, target: CardTarget.FRONT_ENEMY },
      { cost: 1, type: "atk", value: 4, target: CardTarget.FRONT_ENEMY },

      { cost: 0, type: "def", value: 2, target: CardTarget.ALL },
      { cost: 1, type: "def", value: 4, target: CardTarget.SELF },
      { cost: 2, type: "def", value: 4, target: CardTarget.SELF },
      { cost: 3, type: "def", value: 10, target: CardTarget.SELF },

      { cost: 0, type: "func", mods: { health: 2 }, target: CardTarget.ALL },
      { cost: 1, type: "func", mods: { health: 3 }, target: CardTarget.SELF },
      { cost: 2, type: "func", mods: { health: 5 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { health: 6 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { health: 7 }, target: CardTarget.SELF },

      { cost: 1, type: "func", mods: { retaliation: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { protection: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { parry: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { reflect: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { leech: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { regeneration: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { strength: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { rage: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { fury: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { haste: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { taunt: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { tactical: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { daggers: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { defensive: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { weak: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { brittle: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { exposed: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { doomed: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { burning: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { poisoned: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { bleeding: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { stunned: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { frozen: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { wet: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { warm: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { oiled: 2 }, target: CardTarget.SELF },
      { cost: 3, type: "func", mods: { cold: 2 }, target: CardTarget.SELF },
    ],
    [],
  ];
}
