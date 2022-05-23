import { COMBATANT_TEXTURES_LOOKING_RIGHT } from "@client/display/entities/VCombatant.textures";
import { getRandomItemFrom } from "@sdk/helpers/arrays";
import { range } from "@sdk/utils/range";

export class Game {
  sideA = new CombatSide(1);
  sideB = new CombatSide(3);

  constructor(onChange: Function) {
    // return createOnChangeProxy(onChange, this);
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

    let block = target.block || 0;

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

  readonly combatants;

  constructor(combatants: number) {
    this.combatants = range(combatants).map(() => new Combatant());
    for (const combatant of this.combatants) combatant.side = this;

    this.drawPile.push(...range(200).map(() => Card.generateRandomCard()));
  }

  onTurnStart() {
    for (const unit of this.combatants) {
      unit.status.retaliation = 0;
      unit.block = 0;
    }
  }
}

export interface CombatantStatus {
  retaliation: number;
}

export class Combatant {
  side!: CombatSide;

  // Properties
  characterId: string = getRandomItemFrom(COMBATANT_TEXTURES_LOOKING_RIGHT);
  textureId: string = `https://public.cx/mock/sugimori/${this.characterId}.png`;
  color: number = ~~(Math.random() * 0xffffff);

  // State
  health: number = 2;
  block: number = 0;

  strength: number = 1;
  status: CombatantStatus = {
    retaliation: 0,
  };

  get alive() {
    return this.health > 0;
  }
}

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
      { type: "func", effect: actor => (actor.health += 2) },
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
