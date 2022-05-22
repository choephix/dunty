import { delay } from "@sdk/utils/promises";
import { Card } from "./game";

export module GameController {
  export async function drawCards(count: number, actor: { hand: Card[], drawPile: Card[] }) {
    const cards = actor.drawPile.splice(0, count);
    for (const card of cards) {
      actor.hand.push(card);
      await delay(0.07);
    }
  }
}
