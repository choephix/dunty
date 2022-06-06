import { Combat } from "../logic/Combat";
import { CardTarget, Combatant } from "./CombatState";

export type ConsumableItem = {
  iconTextureUrl: string;
  onPlay: (actor: Combatant, game: Combat) => void | Promise<void>;
  hint: string;
};

export const ConsumableItemBlueprints: ConsumableItem[] = [
  {
    iconTextureUrl: "https://public.cx/mock/items-1-smol/21.png",
    onPlay: (actor: Combatant, game: Combat) => {
      game.ctrl.heal(actor, 5);
    },
    hint: "Heal 5",
  },

  {
    iconTextureUrl: "https://public.cx/mock/items-1-smol/45.png",
    onPlay: (actor: Combatant, game: Combat) => {
      actor.energy += 2;
    },
    hint: "Gain 2 energy",
  },

  {
    iconTextureUrl: "https://public.cx/mock/items-1-smol/5.png",
    onPlay: (actor: Combatant, game: Combat) => {
      game.ctrl.changeStatus(actor, "block", 12);
    },
    hint: "Gain 12 block",
  },

  {
    iconTextureUrl: "https://public.cx/mock/items-1-smol/11.png",
    onPlay: (actor: Combatant, game: Combat) => {
      game.ctrl.changeStatus(actor, "block", 3);
    },
    hint: "Gain 3 fury",
  },

  {
    iconTextureUrl: "https://public.cx/mock/items-1-smol/14.png",
    onPlay: (actor: Combatant, game: Combat) => {
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
    onPlay: (actor: Combatant, game: Combat) => {
      return game.ctrl.drawCards(3, actor);
    },
    hint: "Draw 3 cards",
  },

  {
    iconTextureUrl: "https://public.cx/mock/items-1-smol/6.png",
    onPlay: (actor: Combatant, game: Combat) => {
      for (const foe of game.state.groupB.combatants) {
        return game.ctrl.dealDamage(foe, 3);
      }
    },
    hint: "Deal 3 damage to all enemies",
  },
];
