import { COMBATANT_TEXTURES_LOOKING_RIGHT } from "@dungeon/combat/display/entities/VCombatant.textures";
import { ConsumableItem } from "@dungeon/combat/state/ConsumableItemBlueprints";
import { CardPools } from "@dungeon/run/CardPools";
import { __window__ } from "@debug/__window__";
import { getRandomItemFrom } from "@sdk/helpers/arrays";

const PLAYER_HEALTH = 3;

export class UserCrossCombatData {
  currentFloor = 1;

  health = PLAYER_HEALTH;
  handReplenishCount = 4;
  energyReplenishCount = 3;

  // readonly deck = range(DECK_SIZE).map(() => generateRandomPlayerCard());
  readonly deck = CardPools.playerStartingCards.map(c => Object.create(c));

  readonly consumables = new Array<ConsumableItem>();

  //// //// //// ////

  playerCharacterId = getRandomItemFrom(COMBATANT_TEXTURES_LOOKING_RIGHT);
}

export module UserCrossCombatData {
  export const current = new UserCrossCombatData();
}

__window__.UserCrossCombatData = UserCrossCombatData;
