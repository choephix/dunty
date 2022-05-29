import { COMBATANT_TEXTURES_LOOKING_RIGHT } from "@client/combat/display/entities/VCombatant.textures";
import { getRandomItemFrom } from "@sdk/helpers/arrays";
import { FloorConfig, UserCrossCombatData } from "./data";
import { shuffleArray } from "./game.utils";

/**
 * Single instance of a combat encounter.
 */
export class Game {
  groupA = new CombatGroup();
  groupB = new CombatGroup();

  start(userRunData: UserCrossCombatData, floorConfig: FloorConfig) {
    const { groupA, groupB } = this;

    groupA.isPlayer = true;

    {
      const playerCombatant = new Combatant({ health: userRunData.health });
      playerCombatant.name = "PLAYER";
      playerCombatant.handReplenishCount = userRunData.handReplenishCount;
      playerCombatant.energyReplenishCount = userRunData.energyReplenishCount;
      playerCombatant.cards.drawPile.push(...userRunData.deck.map(c => Object.create(c)));
      groupA.addCombatant(playerCombatant);

      shuffleArray(playerCombatant.cards.drawPile);
    }

    {
      for (const [index, foeConfig] of floorConfig.foes.entries()) {
        const {
          name = "Unknown Enemy " + (index + 1),
          health = 3,
          handReplenishCount = 1,
          energyReplenishCount = 0,
          deck = [],
        } = foeConfig;
        const foe = new Combatant({ health });
        foe.name = name;
        foe.handReplenishCount = handReplenishCount;
        foe.energyReplenishCount = energyReplenishCount;
        foe.cards.drawPile.push(...deck.map(c => Object.create(c)));
        groupB.addCombatant(foe);

        shuffleArray(foe.cards.drawPile);
      }
    }
  }

  *iterateCombatants() {
    yield* this.groupA.combatants;
    yield* this.groupB.combatants;
  }

  isGroupAlive(g: CombatGroup) {
    return g.combatants.some(c => c.status.health > 0);
  }

  calculateCardsToDrawOnTurnStart(target: Combatant) {
    return target.handReplenishCount + target.status.tactical;
  }

  calculateEnergyToAddOnTurnStart(target: Combatant) {
    return target.energyReplenishCount + target.status.haste;
  }

  calculateBlockPointsToAdd(card: Card, target?: Combatant) {
    if (card.type !== "def") return 0;

    let value = card.value || 0;

    if (target) {
      value += target.status.defensive || 0;
    }

    return value;
  }

  calculateAttackPower(card: Card, attacker?: Combatant, target?: Combatant) {
    if (card.type !== "atk") return 0;

    let value = card.value || 0;
    if (attacker) {
      value += attacker.status.strength || 0;
      value += attacker.status.rage || 0;
      value += attacker.status.fury || 0;
      value -= attacker.status.weak || 0;
    }

    if (target) {
      value += target.status.brittle || 0;
      value *= target.status.exposed > 0 ? 2.0 : 1;
      value *= target.status.doomed > 0 ? 2.0 : 1;
    }

    return value;
  }

  calculateDamage(damage: number, target: Combatant, attacker: Combatant) {
    let blockedDamage = 0;
    let reflectedDamage = 0;
    let directDamage = 0;
    let healingDamage = 0;

    const { leech = 0 } = attacker.status;
    const { block = 0, retaliation = 0, parry = 0, reflect = 0, health } = target.status;

    if (reflect > 0) {
      return {
        directDamage: 0,
        blockedDamage: 0,
        reflectedDamage: damage,
        healingDamage: 0,
      };
    }

    directDamage = damage;

    if (target.status.block > 0) {
      blockedDamage = Math.min(block, damage);
      directDamage -= blockedDamage;
    }

    if (parry > 0) {
      reflectedDamage = Math.min(parry, damage);
      directDamage -= reflectedDamage;
    }

    reflectedDamage += retaliation;

    if (directDamage < 0) {
      directDamage = 0;
    }

    healingDamage = Math.min(directDamage, leech, health);

    console.log({
      damage,
      directDamage,
      blockedDamage,
      reflectedDamage,
      healingDamage,
      block,
      retaliation,
      parry,
      leech,
      target,
    });

    return { directDamage, blockedDamage, reflectedDamage, healingDamage };
  }
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

  characterId: string = getRandomItemFrom(COMBATANT_TEXTURES_LOOKING_RIGHT);
  textureId: string = `https://public.cx/mock/sugimori/${this.characterId}.png`;

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

  constructor(initialStatus: Partial<CombatantStatus> = {}) {
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
