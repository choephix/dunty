import { COMBATANT_TEXTURES_LOOKING_RIGHT } from "@client/display/entities/VCombatant.textures";
import { getRandomItemFrom } from "@sdk/helpers/arrays";
import { range } from "@sdk/utils/range";

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

  calculateAttackPower(card: Card, attacker?: Combatant, target?: Combatant) {
    if (card.type !== "atk") return 0;

    let value = card.value || 0;
    if (attacker) {
      value += attacker.status.strength || 0;
    }

    return value;
  }

  calculateDamage(damage: number, target: Combatant) {
    let blockedDamage = 0;
    let directDamage = 0;

    let block = target.status.block || 0;

    if (damage <= block) {
      blockedDamage = damage;
      directDamage = 0;
    } else {
      blockedDamage = Math.min(block, damage);
      directDamage = damage - block;
    }

    console.log({ damage, block, directDamage, blockedDamage, target });

    return { directDamage, blockedDamage };
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

  status = {
    // ❤
    health: 1,

    // Positive
    block: 0,
    protection: 0,
    retaliation: 0,
    reflect: 0,
    leech: 0,
    regeneration: 0,
    strength: 0,
    rage: 0,
    fury: 0,
    haste: 0,
    taunt: 0,
    tactical: 0,
    inspiring: 0,
    daggers: 0,
    defensive: 0,

    // Negative
    weak: 0,
    brittle: 0,
    doomed: 0,
    burning: 0,
    poisoned: 0,
    bleeding: 0,
    stunned: 0,
    frozen: 0,

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

export type CombatantStatus = Combatant["status"];

export interface Card {
  type: string;
  value?: number;
  effect?: (actor: Combatant, target?: Combatant) => void;
}

export module Card {
  export function generateRandomCard(): Card {
    return getRandomItemFrom<Card>([
      { type: "atk", value: 0 },
      { type: "atk", value: 1 },
      { type: "atk", value: 2 },
      { type: "def", value: 1 },
      { type: "def", value: 2 },
      { type: "func", effect: actor => (actor.status.health += 2) },
      { type: "func", effect: actor => (actor.status.retaliation += 1) },
      generateRandomStatusEffectCard(),
    ]);
  }

  export function generateRandomEnemyCard(): Card {
    return getRandomItemFrom<Card>([
      { type: "atk", value: 1 },
      { type: "atk", value: 2 },
      { type: "def", value: 2 },
      generateRandomStatusEffectCard(),
    ]);
  }

  function generateRandomStatusEffectCard(): Card {
    const sampleCombatant = new Combatant();
    const key = getRandomItemFrom(Object.keys(sampleCombatant.status)) as keyof CombatantStatus;
    return { type: "func", effect: actor => (actor.status[key] += 1) };
  }
}
