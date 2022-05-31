import { ConsumableItem } from "@client/combat/state/ConsumableItemBlueprints";
import { CardPools } from "@client/run/CardPools";
import { __window__ } from "@debug/__window__";

const PLAYER_HEALTH = 3;

export class UserCrossCombatData {
  currentFloor = 1;

  health = PLAYER_HEALTH;
  handReplenishCount = 4;
  energyReplenishCount = 3;

  // readonly deck = range(DECK_SIZE).map(() => generateRandomPlayerCard());
  readonly deck = CardPools.playerStartingCards.map(c => Object.create(c));

  readonly consumables = new Array<ConsumableItem>();
}

export module UserCrossCombatData {
  export const current = new UserCrossCombatData();
}

__window__.UserCrossCombatData = UserCrossCombatData;
