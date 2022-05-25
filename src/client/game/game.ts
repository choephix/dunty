import { COMBATANT_TEXTURES_LOOKING_RIGHT } from "@client/display/entities/VCombatant.textures";
import { getRandomItemFrom } from "@sdk/helpers/arrays";
import { randomIntBetweenIncluding } from "@sdk/utils/random";
import { range } from "@sdk/utils/range";
import { StatusEffectBlueprints, StatusEffectImpactAlignment } from "./StatusEffectBlueprints";

const BASE_DRAW_COUNT_ON_TURN_START = 4;

export class Game {
  sideA = new CombatSide();
  sideB = new CombatSide();

  start() {
    const { sideA, sideB } = this;

    const HEALTH = 3;

    const playerCombatant = new Combatant({ health: HEALTH * 2 });
    sideA.addCombatant(playerCombatant);
    sideA.drawPile.push(...range(200).map(() => Card.generateRandomCard()));

    for (const _ of range(3)) {
      sideB.addCombatant(new Combatant({ health: HEALTH }));
    }
  }

  calculateCardsToDrawOnTurnStart(target: Combatant) {
    return BASE_DRAW_COUNT_ON_TURN_START + target.status.tactical;
  }

  calculateEnergyToAddOnTurnStart(target: Combatant) {
    return BASE_DRAW_COUNT_ON_TURN_START + target.status.haste;
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

export class CombatSide {
  readonly drawPile = new Array<Card>();
  readonly discardPile = new Array<Card>();
  readonly hand = new Array<Card>();

  readonly combatants = new Array<Combatant>();

  addCombatant(combatant: Combatant) {
    this.combatants.push(combatant);
    combatant.side = this;
  }
}

export class Combatant {
  side!: CombatSide;

  // Properties
  characterId: string = getRandomItemFrom(COMBATANT_TEXTURES_LOOKING_RIGHT);
  textureId: string = `https://public.cx/mock/sugimori/${this.characterId}.png`;
  color: number = ~~(Math.random() * 0xffffff);

  // State

  nextCard: Card | null = null;

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
  // effect?: (actor: Combatant, target?: Combatant) => void;
  mods?: Partial<CombatantStatus>;
  isToken?: boolean;
  target?: CardTarget;
}

export enum CardTarget {
  SELF = "self",
  TARGET_ENEMY = "target-enemy",
  FRONT_ENEMY = "front-enemy",
  ALL_ENEMIES = "all-enemies",
  ALL = "all",
}

export module Card {
  export function generateRandomCard(): Card {
    return getRandomItemFrom<Card>([
      { cost: randomIntBetweenIncluding(0, 3, 2), type: "atk", value: 1 },
      { cost: randomIntBetweenIncluding(0, 3, 2), type: "atk", value: 2 },
      { cost: randomIntBetweenIncluding(0, 3, 2), type: "def", value: 1 },
      { cost: randomIntBetweenIncluding(0, 3, 2), type: "def", value: 2 },
      { cost: randomIntBetweenIncluding(0, 3, 2), type: "func", mods: { health: 2 } },
      generateStatusEffectCard(),
    ]);
  }

  export function generateRandomEnemyCard(): Card {
    return getRandomItemFrom<Card>([
      { cost: 1, type: "atk", value: 1 },
      { cost: 1, type: "atk", value: 2 },
      { cost: 1, type: "def", value: 2 },
      generateStatusEffectCard(),
      generateStatusEffectCard(),
      generateStatusEffectCard(),
      generateStatusEffectCard(),
      generateStatusEffectCard(),
      generateStatusEffectCard(),
    ]);
  }

  function generateStatusEffectCard(statusProperty?: keyof CombatantStatus): Card {
    const sampleCombatant = new Combatant();
    const key = statusProperty || (getRandomItemFrom(Object.keys(sampleCombatant.status)) as keyof CombatantStatus);
    const { impactAlignment } = StatusEffectBlueprints[key];

    const MAP = {
      [StatusEffectImpactAlignment.POSITIVE]: getRandomItemFrom([CardTarget.SELF]),
      [StatusEffectImpactAlignment.NEUTRAL]: getRandomItemFrom([CardTarget.ALL]),
      [StatusEffectImpactAlignment.NEGATIVE]: getRandomItemFrom([
        CardTarget.TARGET_ENEMY,
        CardTarget.FRONT_ENEMY,
        CardTarget.ALL_ENEMIES,
      ]),
    };

    return { cost: 1, type: "func", mods: { [key]: 2 }, target: MAP[impactAlignment] || CardTarget.ALL };
  }
}
