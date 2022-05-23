import { COMBATANT_TEXTURES_LOOKING_RIGHT } from "@client/display/entities/VCombatant.textures";
import { getRandomItemFrom } from "@sdk/helpers/arrays";
import { range } from "@sdk/utils/range";

function createOnChangeProxy<T extends object>(onPropertyChange: Function, target: T) {
  return new Proxy(target, {
    get(target: any, property: any): T {
      const item = target[property];
      if (item && typeof item === "object") return createOnChangeProxy(onPropertyChange, item);
      return item;
    },
    set(target, property, newValue) {
      target[property] = newValue;
      if (newValue instanceof Object) {
        onPropertyChange.call(target, property, newValue, target);
      }
      return true;
    },
  });
}

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

  calculateAttackDamage(card: Card, attacker: Combatant, target: Combatant) {
    let directDamage = this.calculateAttackPower(card, attacker, target);
    let blockDamage = 0;

    let block = target.block || 0;

    if (directDamage < block) {
      blockDamage = directDamage;
      directDamage = 0;
    } else {
      blockDamage = Math.min(block, directDamage);
      directDamage -= block;
    }

    return { directDamage, blockDamage };
  }
}

export class CombatSide {
  readonly drawPile = new Array<Card>();
  readonly discardPile = new Array<Card>();
  readonly hand = new Array<Card>();

  readonly combatants;

  constructor(combatants: number) {
    this.combatants = range(combatants).map(() => new Combatant());
    this.drawPile.push(...range(200).map(() => Card.generateRandomCard()));
  }
}

export class Combatant {
  // Properties
  characterId: string = getRandomItemFrom(COMBATANT_TEXTURES_LOOKING_RIGHT);
  textureId: string = `https://public.cx/mock/sugimori/${this.characterId}.png`;
  color: number = ~~(Math.random() * 0xffffff);

  // State
  health: number = 10;
  block: number = 0;

  strength: number = 1;
}

export interface Card {
  emoji: string;
  type: string;
  value?: number;
}

export module Card {
  export function generateRandomCard(): Card {
    return getRandomItemFrom<Card>([
      { type: "atk", emoji: "⚔", value: 0 },
      { type: "atk", emoji: "⚔", value: 1 },
      { type: "atk", emoji: "⚔", value: 2 },
      { type: "def", emoji: "🛡", value: 1 },
      { type: "def", emoji: "🛡", value: 2 },
    ]);
  }
}
