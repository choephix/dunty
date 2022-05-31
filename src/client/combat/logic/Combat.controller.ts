import { delay } from "@sdk/utils/promises";
import { range } from "@sdk/utils/range";
import { Card, CardPileType, Combatant, CombatantStatus, CombatGroup } from "@client/combat/state/CombatState";
import { generateDaggerCard } from "@client/combat/state/StuffFactory";
import { StatusEffectBlueprints, StatusEffectExpiryType } from "@client/combat/state/StatusEffectBlueprints";
import { FloorConfig } from "../../run/FloorConfig";
import { CombatDriver } from "./CombatDriver";
import { UserCrossCombatData } from "@client/run/UserCrossCombatData";

/**
 * Commoon actions and actions steps.
 *
 * This is the proper way to mutate combat state,
 * as opposed to modifying it directly.
 */
export class CombatController extends CombatDriver {
  start(userRunData: UserCrossCombatData, floorConfig: FloorConfig) {
    const { groupA, groupB } = this.state;

    groupA.isPlayer = true;

    {
      const playerCombatant = new Combatant({ health: userRunData.health }, userRunData.playerCharacterId);
      playerCombatant.name = "PLAYER";
      playerCombatant.handReplenishCount = userRunData.handReplenishCount;
      playerCombatant.energyReplenishCount = userRunData.energyReplenishCount;
      playerCombatant.cards.drawPile.push(...userRunData.deck.map(c => Object.create(c)));
      groupA.addCombatant(playerCombatant);

      shuffleArray(playerCombatant.cards.drawPile);
    }

    {
      for (const [index, foeConfig] of floorConfig.foes.entries()) {
        const {
          name = "Unknown Enemy " + (index + 1),
          health = 3,
          handReplenishCount = 1,
          energyReplenishCount = 0,
          deck = [],
        } = foeConfig;
        const foe = new Combatant({ health });
        foe.name = name;
        foe.handReplenishCount = handReplenishCount;
        foe.energyReplenishCount = energyReplenishCount;
        foe.cards.drawPile.push(...deck.map(c => Object.create(c)));
        groupB.addCombatant(foe);

        shuffleArray(foe.cards.drawPile);
      }
    }
  }
  
  async assureDrawPileHasCards(actor: Combatant) {
    const { drawPile, discardPile } = actor.cards;
    if (drawPile.length === 0) {
      while (discardPile.length > 0) {
        const card = discardPile[0];
        actor.cards.moveCardTo(card, drawPile);
        await delay(0.07);
      }
    }
  }

  async drawCards(count: number, actor: Combatant) {
    const { drawPile, hand } = actor.cards;
    for (const _ of range(count)) {
      await this.assureDrawPileHasCards(actor);
      const card = drawPile[0];
      if (!card) return console.error("drawCards: drawPile is empty");
      actor.cards.moveCardTo(card, hand);
      if (card.onDraw) {
        card.onDraw.call(card, actor);
        await delay(0.25);
      }
      await delay(0.07);
    }
    await this.assureDrawPileHasCards(actor);
  }

  async discardHand(actor: Combatant) {
    const { hand } = actor.cards;
    while (hand.length > 0) {
      await this.discardCard(hand[0], actor);
      await delay(0.07);
    }
  }

  async discardCard(card: Card, actor: Combatant) {
    const toPile = this.faq.getPileType(actor, card.gotoAfterDiscard || CardPileType.DISCARD);
    actor.cards.moveCardTo(card, toPile);
  }

  async disposeCardAfterPlay(card: Card, actor: Combatant) {
    const toPile = this.faq.getPileType(actor, card.gotoAfterPlay || CardPileType.DISCARD);
    toPile.push(card);
  }

  async activateCombatantTurnStartStatusEffects(side: CombatGroup) {
    const dict: Partial<Record<keyof CombatantStatus, (unit: Combatant) => void>> = {
      regeneration: u => (u.status.health += u.status.regeneration),
      tactical: u => this.drawCards(u.status.tactical, u),
      daggers: u => range(u.status.daggers).forEach(() => u.cards.hand.push(generateDaggerCard())),
      burning: u => (u.status.health -= u.status.burning),
      poisoned: u => (u.status.health -= u.status.poisoned),
      bleeding: u => (u.status.health -= u.status.bleeding),
    };
    for (const unit of side.combatants) {
      for (const [key, func] of CombatantStatus.entries(dict)) {
        if (unit.status[key] > 0) {
          func?.(unit);
          await delay(0.3);
        }
      }
    }
  }

  async resetCombatantsForTurnStart(side: CombatGroup) {
    for (const unit of side.combatants) {
      for (const [key] of CombatantStatus.entries(unit.status)) {
        if (key === "health") continue;
        const expiryType = StatusEffectBlueprints[key].expiryType;
        switch (expiryType) {
          case StatusEffectExpiryType.RESET_BEFORE_TURN: {
            unit.status[key] = 0;
            break;
          }
          case StatusEffectExpiryType.DECREMENT_BEFORE_TURN: {
            unit.status[key] = Math.max(0, unit.status[key] - 1);
            break;
          }
        }
      }
    }
  }
}

function shuffleArray<T>(target: T[]) {
  for (let i = target.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    let temp = target[i];
    target[i] = target[j];
    target[j] = temp;
  }
  return target;
}
