import { Rarity } from "@game/constants/Rarity";
import { LiteralUnion } from "type-fest/source/literal-union";

const __prototypes__ = [
  Object.freeze({ level: 1, ampAmount: 1, rarity: Rarity.Uncommon }),
  Object.freeze({ level: 2, ampAmount: 2, rarity: Rarity.Rare }),
  Object.freeze({ level: 3, ampAmount: 6, rarity: Rarity.Epic }),
  Object.freeze({ level: 4, ampAmount: 12, rarity: Rarity.Legendary }),
  Object.freeze({ level: 5, ampAmount: 18, rarity: Rarity.Mythic }),
] as CenturyVialData[];

export type CenturyVialData = {
  readonly level: 1 | 2 | 3 | 4 | 5;
  readonly ampAmount: number;
  readonly rarity: Rarity;
};

export function* iterateCenturyVialDataPrototypes() {
  for (const amp in __prototypes__) {
    yield __prototypes__[+amp as keyof typeof __prototypes__];
  }
}

const __prototypes_by_amp__ = __prototypes__.reduce((acc, p) => {
  acc[p.ampAmount] = p;
  return acc;
}, {} as Record<number, CenturyVialData>);

export function createCenturyVialDataFromAMPAmount(amp: LiteralUnion<CenturyVialData["ampAmount"], number>) {
  if (amp in __prototypes_by_amp__) {
    return Object.create(__prototypes_by_amp__[amp]) as CenturyVialData;
  }
  throw new Error(`Unknown amp amount: ${amp}`);
}

const __prototypes_by_level__ = __prototypes__.reduce((acc, p) => {
  acc[p.level] = p;
  return acc;
}, {} as Record<number, CenturyVialData>);

export function createCenturyVialDataFromLevel(level: LiteralUnion<CenturyVialData["level"], number>) {
  if (level in __prototypes_by_level__) {
    return Object.create(__prototypes_by_level__[level]) as CenturyVialData;
  }
  throw new Error(`Unknown level: ${level}`);
}
