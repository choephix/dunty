import { COMBATANT_TEXTURES_LOOKING_RIGHT } from "@dungeon/combat/display/entities/VCombatant.textures";
import { getRandomItemFrom } from "@sdk/helpers/arrays";

/**
 * Single instance of a combat encounter.
 */
export class CombatState {
  groupA = new CombatGroup();
  groupB = new CombatGroup();
}

export class CombatGroup {
  isPlayer = false;

  readonly combatants = new Array<Combatant>();

  addCombatant(combatant: Combatant) {
    this.combatants.push(combatant);
    combatant.group = this;
  }
}

export class CardPiles {
  readonly drawPile = new Array<Card>();
  readonly hand = new Array<Card>();
  readonly discardPile = new Array<Card>();
  readonly void = new Array<Card>();

  private readonly piles = [this.drawPile, this.discardPile, this.hand];

  moveCardTo(card: Card, pile: Card[], atTheBottom = false) {
    const prevPile = this.piles.find(p => p.includes(card));

    if (prevPile) {
      prevPile.splice(prevPile.indexOf(card), 1);
    } else {
      console.error("Card not found in any pile");
    }

    if (atTheBottom) {
      pile.push(card);
    } else {
      pile.unshift(card);
    }
  }

  addCardTo(card: Card, pile: Card[], atTheBottom = false) {
    if (pile.includes(card)) {
      return console.error("Card already in pile");
    }

    if (atTheBottom) {
      pile.push(card);
    } else {
      pile.unshift(card);
    }
  }
}

export class Combatant {
  // Properties
  name?: string;
  group!: CombatGroup;

  characterId: string;
  textureId: string;

  // State

  readonly cards = new CardPiles();

  handReplenishCount = 1;
  energyReplenishCount = 0;

  energy = 0;

  status = {
    // ❤
    health: 1,

    // Positive
    block: 0,
    protection: 0,
    retaliation: 0,
    parry: 0,
    reflect: 0,
    leech: 0,
    regeneration: 0,
    strength: 0,
    rage: 0,
    fury: 0,
    haste: 0,
    taunt: 0,
    tactical: 0,
    daggers: 0,
    defensive: 0,

    // Negative
    weak: 0,
    brittle: 0, // + to dmg received
    exposed: 0, // + to dmg received
    doomed: 0,
    burning: 0,
    poisoned: 0,
    bleeding: 0,
    stunned: 0,
    frozen: 0,
    // silenced: 0,
    // disarmed: 0,

    // Neutral
    wet: 0,
    warm: 0,
    oiled: 0,
    cold: 0,
  };

  get alive() {
    return this.status.health > 0;
  }

  constructor(initialStatus: Partial<CombatantStatus> = {}, characterId = getRandomItemFrom(COMBATANT_TEXTURES_LOOKING_RIGHT)) {
    this.characterId = characterId;
    this.textureId = `https://public.cx/mock/sugimori/${this.characterId}.png`;

    Object.assign(this.status, initialStatus);
  }

  toString() {
    return `${this.name || "?"} (${this.status.health})`;
  }
}

export type CombatantStatus = Omit<Combatant["status"], "energy">;
export module CombatantStatus {
  export function entries<T>(obj: Partial<Record<keyof CombatantStatus, T>>) {
    return Object.entries(obj) as [keyof CombatantStatus, T][];
  }
}

export interface Card {
  cost: number;
  type: string;
  value?: number;
  mods?: Partial<CombatantStatus>;
  target: CardTarget;

  isToken?: boolean;
  isBloat?: boolean;

  retain?: boolean;
  gotoAfterPlay?: CardPileType;
  gotoAfterDiscard?: CardPileType;

  onPlay?: (actor: Combatant, targets?: Combatant[]) => void;
  onDraw?: (actor: Combatant) => void;

  textureUrl?: string;
  description?: string;
}

export enum CardTarget {
  SELF = "SELF",
  TARGET_ANYONE = "TARGET_ANYONE",
  TARGET_ENEMY = "TARGET_ENEMY",
  FRONT_ENEMY = "FRONT_ENEMY",
  ALL_ENEMIES = "ALL_ENEMIES",
  ALL_ALLIES = "ALL_ALLIES",
  ALL = "ALL",
}

export enum CardPileType {
  DRAW = "DRAW",
  HAND = "HAND",
  DISCARD = "DISCARD",
  VOID = "VOID",
}
