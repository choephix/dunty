import { CardTarget, Combatant, Game } from "./game";
import { GameController } from "./game.controller";

export type ConsumableItem = {
  iconTextureUrl: string;
  onPlay: (actor: Combatant, game: Game) => void | Promise<void>;
  hint: string;
};

export const ConsumableItemBlueprints: ConsumableItem[] = [
  {
    iconTextureUrl: "https://public.cx/mock/items-1-smol/21.png",
    onPlay: (actor: Combatant, game: Game) => {
      actor.status.health += 5;
    },
    hint: "Heal 5",
  },

  {
    iconTextureUrl: "https://public.cx/mock/items-1-smol/45.png",
    onPlay: (actor: Combatant, game: Game) => {
      actor.energy += 2;
    },
    hint: "Gain 2 energy",
  },

  {
    iconTextureUrl: "https://public.cx/mock/items-1-smol/5.png",
    onPlay: (actor: Combatant, game: Game) => {
      actor.status.block += 12;
    },
    hint: "Gain 12 block",
  },

  {
    iconTextureUrl: "https://public.cx/mock/items-1-smol/11.png",
    onPlay: (actor: Combatant, game: Game) => {
      actor.status.fury += 3;
    },
    hint: "Gain 3 fury",
  },

  {
    iconTextureUrl: "https://public.cx/mock/items-1-smol/14.png",
    onPlay: (actor: Combatant, game: Game) => {
      actor.cards.addCardTo(
        { type: "atk", cost: 0, value: 2, isToken: true, target: CardTarget.TARGET_ENEMY },
        actor.cards.hand
      );
      actor.cards.addCardTo(
        { type: "atk", cost: 0, value: 2, isToken: true, target: CardTarget.TARGET_ENEMY },
        actor.cards.hand
      );
    },
    hint: "Add two ⚔2 attack cards to hand",
  },

  {
    iconTextureUrl: "https://public.cx/mock/items-1-smol/48.png",
    onPlay: (actor: Combatant, game: Game) => {
      return GameController.drawCards(3, actor)
    },
    hint: "Draw 3 cards",
  },
];
