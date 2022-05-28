import { __window__ } from "@debug/__window__";
import { range } from "@sdk/utils/range";
import { generateRandomEnemyCard, generateRandomPlayerCard } from "@client/game/game.factory";
import { Card } from "./game";

const PLAYER_HEALTH = 3;
const DECK_SIZE = 14;

export class UserCrossCombatData {
  currentFloor = 1;

  health = PLAYER_HEALTH;
  handReplenishCount = 4;
  energyReplenishCount = 4;

  readonly deck = range(DECK_SIZE).map(() => generateRandomPlayerCard());
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
