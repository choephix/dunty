import { deepCopy } from "@sdk/helpers/objects";
import { Card, CardTarget } from "../combat/state/CombatState";

const FloorConfigs: FloorConfig[] = [
  {
    foes: [
      // 1
      {
        name: "Goblin",
        health: 3,
        handReplenishCount: 1,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
        ],
      },
      {
        name: "Goblin's Sister",
        health: 2,
        handReplenishCount: 1,
        deck: [
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
        ],
      },
    ],
  },

  {
    foes: [
      // 2
      {
        health: 3,
        handReplenishCount: 1,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
        ],
      },
      {
        health: 2,
        handReplenishCount: 1,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "func", mods: { health: 2 }, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
        ],
      },
      {
        health: 3,
        handReplenishCount: 1,
        deck: [
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { strength: 1 }, target: CardTarget.ALL_ALLIES },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 1, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
        ],
      },
    ],
  },

  {
    foes: [
      // 3
      {
        health: 4,
        handReplenishCount: 1,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "func", mods: { retaliation: 2 }, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
        ],
      },
      {
        health: 4,
        handReplenishCount: 1,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "func", mods: { health: 2 }, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
        ],
      },
    ],
  },

  {
    foes: [
      // 4
      {
        health: 11,
        handReplenishCount: 2,
        deck: [
          { cost: 1, type: "atk", value: 4, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 4, target: CardTarget.SELF },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { exposed: 2 }, target: CardTarget.TARGET_ENEMY },
          { cost: 3, type: "func", mods: { regeneration: 2 }, target: CardTarget.SELF },
        ],
      },
    ],
  },

  {
    foes: [
      // 5
      {
        health: 6,
        handReplenishCount: 1,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { burning: 2 }, target: CardTarget.TARGET_ENEMY },
        ],
      },
      {
        health: 6,
        handReplenishCount: 1,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { stunned: 2 }, target: CardTarget.TARGET_ENEMY },
        ],
      },
    ],
  },

  {
    foes: [
      // 6
      {
        health: 6,
        handReplenishCount: 1,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 3, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 4, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { stunned: 2 }, target: CardTarget.TARGET_ENEMY },
        ],
      },
      {
        health: 5,
        handReplenishCount: 1,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 3, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 4, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { frozen: 2 }, target: CardTarget.TARGET_ENEMY },
        ],
      },
      {
        health: 6,
        handReplenishCount: 1,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 3, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 4, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { bleeding: 1 }, target: CardTarget.TARGET_ENEMY },
        ],
      },
    ],
  },

  {
    foes: [
      // 7
      {
        health: 6,
        handReplenishCount: 2,
        deck: [
          { cost: 1, type: "atk", value: 3, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 3, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 4, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 4, target: CardTarget.SELF },
          { cost: 0, type: "func", mods: { health: 2 }, target: CardTarget.ALL_ALLIES },
        ],
      },
      {
        health: 6,
        handReplenishCount: 2,
        deck: [
          { cost: 1, type: "atk", value: 3, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 3, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 4, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 4, target: CardTarget.SELF },
          { cost: 0, type: "func", mods: { health: 2 }, target: CardTarget.ALL_ALLIES },
        ],
      },
    ],
  },

  {
    foes: [
      // 8
      {
        health: 6,
        handReplenishCount: 1,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 4, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 4, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { weak: 2 }, target: CardTarget.TARGET_ENEMY },
        ],
      },
      {
        health: 7,
        handReplenishCount: 1,
        deck: [
          { cost: 1, type: "atk", value: 5, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 3, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 5, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 4, target: CardTarget.SELF },
        ],
      },
      {
        health: 6,
        handReplenishCount: 1,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { exposed: 2 }, target: CardTarget.TARGET_ENEMY },
        ],
      },
    ],
  },

  {
    foes: [
      // 9
      {
        health: 10,
        handReplenishCount: 2,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 4, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 4, target: CardTarget.SELF },
          { cost: 1, type: "func", mods: { retaliation: 2 }, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { stunned: 2 }, target: CardTarget.TARGET_ENEMY },
        ],
      },
      {
        health: 10,
        handReplenishCount: 2,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 4, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 4, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { strength: 1 }, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { bleeding: 2 }, target: CardTarget.TARGET_ENEMY },
        ],
      },
    ],
  },

  {
    foes: [
      // 10
      {
        health: 11,
        handReplenishCount: 1,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 4, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 4, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { poisoned: 3 }, target: CardTarget.TARGET_ENEMY },
          { cost: 3, type: "func", mods: { reflect: 1 }, target: CardTarget.SELF },
        ],
      },
      {
        health: 12,
        handReplenishCount: 1,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 4, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 4, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { bleeding: 3 }, target: CardTarget.TARGET_ENEMY },
          { cost: 3, type: "func", mods: { reflect: 1 }, target: CardTarget.SELF },
        ],
      },
      {
        health: 11,
        handReplenishCount: 1,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 4, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 4, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { burning: 3 }, target: CardTarget.TARGET_ENEMY },
          { cost: 3, type: "func", mods: { reflect: 1 }, target: CardTarget.SELF },
        ],
      },
    ],
  },

  {
    foes: [
      // 11
      {
        health: 5,
        handReplenishCount: 3,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 4, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 4, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { regeneration: 4 }, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { rage: 2 }, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { fury: 2 }, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { strength: 1 }, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { frozen: 3 }, target: CardTarget.TARGET_ENEMY },
        ],
      },
      {
        health: 17,
        handReplenishCount: 1,
        deck: [
          { cost: 1, type: "atk", value: 3, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "atk", value: 4, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 4, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { stunned: 2 }, target: CardTarget.TARGET_ENEMY },
        ],
      },
    ],
  },

  {
    foes: [
      // 12
      {
        health: 7,
        handReplenishCount: 1,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 4, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 4, target: CardTarget.SELF },
        ],
      },
      {
        health: 6,
        handReplenishCount: 2,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 4, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 4, target: CardTarget.SELF },
        ],
      },
      {
        health: 5,
        handReplenishCount: 1,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 4, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 4, target: CardTarget.SELF },
        ],
      },
      {
        health: 4,
        handReplenishCount: 2,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 4, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 4, target: CardTarget.SELF },
        ],
      },
    ],
  },

  {
    foes: [
      // 13
      {
        health: 29,
        handReplenishCount: 3,
        deck: [
          { cost: 1, type: "atk", value: 6, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 6, target: CardTarget.SELF },
          { cost: 1, type: "atk", value: 4, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 4, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { regeneration: 4 }, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { fury: 2 }, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { strength: 2 }, target: CardTarget.SELF },
          { cost: 3, type: "func", mods: { frozen: 2 }, target: CardTarget.TARGET_ENEMY },
        ],
      },
    ],
  },
];

export function getFloorConfig(floor: number): FloorConfig {
  floor = Math.max(0, floor - 1);
  floor = floor % FloorConfigs.length;
  const cfg = deepCopy(FloorConfigs[floor]);
  const ascension = Math.floor(floor / FloorConfigs.length);
  console.log("ascension", ascension);
  cfg.foes.forEach(foe => {
    foe.health += ascension * 3;
    foe.handReplenishCount += Math.min(ascension, 4);
  });
  return cfg;
}

export type FloorConfig = {
  foes: {
    name?: string;
    health: number;
    handReplenishCount: number;
    energyReplenishCount?: number;
    deck: Card[];
  }[];
};
