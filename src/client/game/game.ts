import { getRandomItemFrom, range } from "../sdk/misc";

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
    return createOnChangeProxy(onChange, this);
  }
}

export class CombatSide {
  readonly drawPile = new Array<Card>();
  readonly discardPile = new Array<Card>();
  readonly hand = new Array<Card>();

  readonly combatants;

  constructor(combatants: number) {
    this.combatants = range(combatants).map(() => new Combatant());

    this.drawPile.push(
      ...range(20).map(() => {
        return getRandomItemFrom<Card>([
          { emoji: "⚔", atk: 1 },
          { emoji: "🛡", def: 1 },
        ]);
      })
    );
  }
}

export class Combatant {
  // Properties
  textureId: string = `https://upload.wikimedia.org/wikipedia/en/thumb/a/a6/Pok%C3%A9mon_Pikachu_art.png/220px-Pok%C3%A9mon_Pikachu_art.png`;
  color: number = ~~(Math.random() * 0xffffff);

  // State
  health: number = 100;
}

export interface Card {
  emoji: string;
  atk?: number;
  def?: number;
}
