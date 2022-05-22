import { getRandomItemFrom, range } from "../sdk/misc";

export class Game {
  readonly sideA = new CombatSide(1);
  readonly sideB = new CombatSide(3);

  constructor() {
    
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
