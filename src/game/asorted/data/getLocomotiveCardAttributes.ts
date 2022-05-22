import { CardEntity } from "@game/data/entities/CardEntity";
import { CardData } from "@sdk-integration/contracts";

function makeAttributeDataObject(base: number, boost: number | undefined) {
  boost ??= 0;
  return { base, boost, total: base + boost };
}

export function getLocomotiveCardAttributes(card: CardEntity | CardData) {
  if (card instanceof CardEntity) {
    card = card.data;
  }

  if (card.asset_schema_type != "locomotive") {
    throw new Error(`Card is not a locomotive: ${card.asset_schema_type}`);
  }

  return {
    boosted: !!card.boosted,
    distance: makeAttributeDataObject(card.distance, card.distance_boost),
    speed: makeAttributeDataObject(card.speed, card.speed_boost),
    haul: makeAttributeDataObject(card.hauling_power, card.haul_boost),
    luck: makeAttributeDataObject(0, card.luck_boost),
  };
}
