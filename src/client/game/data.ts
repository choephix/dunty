import { __window__ } from "@debug/__window__";
import { range } from "@sdk/utils/range";
import { generateRandomPlayerCard } from "./game.factory";

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
