import { Card } from "./game";

export module GameController {
  export function drawCards(count: number, actor: { hand: Card[], drawPile: Card[] }) {
    const cards = actor.drawPile.splice(0, count);
    actor.hand.push(...cards);
  }
}
