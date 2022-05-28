import { generateRandomEnemyCard } from "@client/game/game.factory";
import { __window__ } from "@debug/__window__";
import { range } from "@sdk/utils/range";
import { CardPools } from "./data.cardpools";
import { Card, CardTarget } from "./game";

const PLAYER_HEALTH = 3;
const DECK_SIZE = 14;

export class UserCrossCombatData {
  currentFloor = 1;

  health = PLAYER_HEALTH;
  handReplenishCount = 4;
  energyReplenishCount = 3;

  // readonly deck = range(DECK_SIZE).map(() => generateRandomPlayerCard());
  readonly deck = CardPools.playerStartingCards.map(c => Object.create(c));
}

export module UserCrossCombatData {
  export const current = new UserCrossCombatData();
}

__window__.UserCrossCombatData = UserCrossCombatData;

//// //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////

const FloorConfigs: FloorConfig[] = [
  {
    foes: [
      {
        name: "Goblin",
        health: 3,
        handReplenishCount: 1,
        deck: [
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "atk", value: 2, target: CardTarget.TARGET_ENEMY },
          { cost: 1, type: "def", value: 2, target: CardTarget.TARGET_ENEMY },
        ],
      },
      {
        name: "Goblin's Sister",
        health: 2,
        handReplenishCount: 1,
        deck: range(DECK_SIZE).map(() => generateRandomEnemyCard()),
      },
    ],
  },
  {
    foes: [
      {
        name: "Goblin",
        health: 3,
        handReplenishCount: 1,
        deck: range(DECK_SIZE).map(() => generateRandomEnemyCard()),
      },
      {
        name: "Goblin's Sister",
        health: 2,
        handReplenishCount: 1,
        deck: range(DECK_SIZE).map(() => generateRandomEnemyCard()),
      },
      {
        name: "Goblin's Sister",
        health: 2,
        handReplenishCount: 1,
        deck: range(DECK_SIZE).map(() => generateRandomEnemyCard()),
      },
    ],
  },
];

export function getFloorConfig(floor: number): FloorConfig {
  floor = Math.max(0, floor - 1);
  floor = floor % FloorConfigs.length;
  return FloorConfigs[floor];
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
