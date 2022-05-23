import { COMBATANT_TEXTURES_LOOKING_RIGHT } from "@client/display/entities/VCombatant.textures";
import { getRandomItemFrom } from "@sdk/helpers/arrays";
import { range } from "@sdk/utils/range";

export class Game {
  sideA = new CombatSide();
  sideB = new CombatSide();

  start() {
    const { sideA, sideB } = this;

    const HEALTH = 3;

    const playerCombatant = new Combatant({ health: HEALTH });
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
      value += attacker.strength || 0;
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

  onTurnStart() {
    for (const unit of this.combatants) {
      unit.status.retaliation = 0;
      unit.status.block = 0;
    }
  }

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

  strength: number = 1;
  status = {
    health: 1,
    block: 0,
    retaliation: 0,
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
    ]);
  }
  export function generateRandomEnemyCard(): Card {
    return getRandomItemFrom<Card>([
      { type: "atk", value: 1 },
      { type: "atk", value: 2 },
      { type: "def", value: 1 },
      { type: "func", effect: actor => (actor.status.retaliation += 1) },
    ]);
  }
}
