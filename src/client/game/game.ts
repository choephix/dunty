import { COMBATANT_TEXTURES_LOOKING_RIGHT } from "@client/display/entities/VCombatant.textures";
import { getRandomItemFrom } from "@sdk/helpers/arrays";
import { range } from "@sdk/utils/range";
import { generateRandomPlayerCard, generateRandomEnemyCard } from "@client/game/game.factory";

/**
 * Single instance of a combat encounter.
 */
export class Game {
  groupA = new CombatGroup();
  groupB = new CombatGroup();

  start() {
    const { groupA, groupB } = this;

    groupA.isPlayer = true;

    const PLAYER_HEALTH = 3;
    const DECK_SIZE = 20;

    const playerCombatant = new Combatant({ health: PLAYER_HEALTH });
    playerCombatant.name = "PLAYER";
    playerCombatant.handReplenishCount = 4;
    playerCombatant.energyReplenishCount = 4;
    playerCombatant.cards.drawPile.push(...range(DECK_SIZE).map(() => generateRandomPlayerCard()));
    groupA.addCombatant(playerCombatant);

    const ENEMIES = 2;
    const ENEMY_DECK_SIZE = 6;
    const ENEMY_HAND_SIZE = 3;
    const ENEMY_ENERGY = 1;
    const ENEMY_HEALTH = 3;

    for (const _ of range(ENEMIES)) {
      const foe = new Combatant({ health: ENEMY_HEALTH });
      foe.handReplenishCount = 1 + _;
      // foe.handReplenishCount = ENEMY_HAND_SIZE;
      foe.energyReplenishCount = ENEMY_ENERGY;
      foe.cards.drawPile.push(...range(ENEMY_DECK_SIZE).map(() => generateRandomEnemyCard()));
      groupB.addCombatant(foe);
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

  calculateDamage(damage: number, target: Combatant) {
    let blockedDamage = 0;
    let reflectedDamage = 0;
    let directDamage = 0;
    let healingDamage = 0;

    const { block = 0, retaliation = 0, parry: reflect = 0, leech = 0 } = target.status;

    directDamage = damage;

    if (target.status.block > 0) {
      blockedDamage = Math.min(block, damage);
      directDamage -= blockedDamage;
    }

    if (reflect > 0) {
      reflectedDamage = Math.min(reflect, damage);
      directDamage -= reflectedDamage;
    }

    reflectedDamage += retaliation; // TODO: reflected damage is not implemented yet

    if (directDamage < 0) {
      directDamage = 0;
    }

    healingDamage = Math.min(directDamage, leech); // TODO: leech is not implemented yet

    console.log({ damage, block, directDamage, blockedDamage, reflectedDamage, target });

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
  color: number = ~~(Math.random() * 0xffffff);

  // State

  readonly cards = new CardPiles();

  handReplenishCount = 1;
  energyReplenishCount = 1;

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
}

export enum CardTarget {
  SELF = "SELF",
  TARGET_ANYONE = "TARGET_ANYONE",
  TARGET_ENEMY = "TARGET_ENEMY",
  FRONT_ENEMY = "FRONT_ENEMY",
  ALL_ENEMIES = "ALL_ENEMIES",
  ALL = "ALL",
}

export enum CardPileType {
  DRAW = "DRAW",
  HAND = "HAND",
  DISCARD = "DISCARD",
  VOID = "VOID",
}
