import { delay } from "@sdk/utils/promises";
import { range } from "@sdk/utils/range";
import { CardPileType, Combatant, CombatantStatus } from "@dungeon/combat/state/CombatState";
import { generateDaggerCard } from "@dungeon/combat/state/StuffFactory";
import { StatusEffectBlueprints, StatusEffectExpiryType, } from "@dungeon/combat/state/StatusEffectBlueprints";
import { CombatDriver } from "./CombatDriver";
/**
 * Commoon actions and actions steps.
 *
 * This is the proper way to mutate combat state,
 * as opposed to modifying it directly.
 */
export class CombatController extends CombatDriver {
    start(userRunData, floorConfig) {
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
                const { name = "Unknown Enemy " + (index + 1), health = 3, handReplenishCount = 1, energyReplenishCount = 0, deck = [], } = foeConfig;
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
    async assureDrawPileHasCards(actor) {
        const { drawPile, discardPile } = actor.cards;
        if (drawPile.length === 0) {
            while (discardPile.length > 0) {
                const card = discardPile[0];
                actor.cards.moveCardTo(card, drawPile);
                await delay(0.07);
            }
        }
    }
    async drawCards(count, actor) {
        const { drawPile, hand } = actor.cards;
        for (const _ of range(count)) {
            await this.assureDrawPileHasCards(actor);
            const card = drawPile[0];
            if (!card)
                return console.error("drawCards: drawPile is empty");
            actor.cards.moveCardTo(card, hand);
            if (card.onDraw) {
                card.onDraw.call(card, actor, this.combat);
                await delay(0.25);
            }
            await delay(0.07);
        }
        await this.assureDrawPileHasCards(actor);
    }
    async discardHand(actor) {
        const { hand } = actor.cards;
        while (hand.length > 0) {
            await this.discardCard(hand[0], actor);
            await delay(0.07);
        }
    }
    async discardCard(card, actor) {
        const toPile = this.faq.getPileType(actor, card.gotoAfterDiscard || CardPileType.DISCARD);
        actor.cards.moveCardTo(card, toPile);
    }
    async disposeCardAfterPlay(card, actor) {
        const toPile = this.faq.getPileType(actor, card.gotoAfterPlay || CardPileType.DISCARD);
        toPile.push(card);
    }
    async activateCombatantTurnStartStatusEffects(side) {
        const dict = {
            regeneration: u => this.heal(u, u.status.regeneration),
            tactical: u => this.drawCards(u.status.tactical, u),
            daggers: u => range(u.status.daggers).forEach(() => u.cards.hand.push(generateDaggerCard())),
            burning: u => this.dealDamage(u, -u.status.burning),
            poisoned: u => this.dealDamage(u, -u.status.poisoned),
            bleeding: u => this.dealDamage(u, -u.status.bleeding),
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
    async resetCombatantsForTurnStart(side) {
        function updateStatusExpiryAfterTurn(combatant, key) {
            const blueprint = StatusEffectBlueprints[key];
            if (!blueprint)
                return;
            switch (blueprint.expiryType) {
                case StatusEffectExpiryType.RESET_BEFORE_TURN:
                    this.resetStatus(combatant, key);
                case StatusEffectExpiryType.DECREMENT_BEFORE_TURN:
                    this.decrementStatus(combatant, key);
            }
        }
        for (const combatant of side.combatants) {
            for (const [key] of CombatantStatus.entries(combatant.status)) {
                updateStatusExpiryAfterTurn.call(this, combatant, key);
            }
        }
    }
    //
    dealDamage(target, directDamage, blockDamage = 0) {
        this.changeStatus(target, "health", -directDamage);
        this.changeStatus(target, "block", -blockDamage);
        function updateStatusExpiryAfterHurt(key) {
            const blueprint = StatusEffectBlueprints[key];
            if (!blueprint)
                return;
            switch (blueprint.expiryType) {
                case StatusEffectExpiryType.RESET_AFTER_HURT:
                    return this.resetStatus(target, key);
                case StatusEffectExpiryType.DECREMENT_AFTER_HURT:
                    return this.decrementStatus(target, key);
                case StatusEffectExpiryType.SUBTRACT_HURT:
                    return this.changeStatus(target, key, -directDamage);
            }
        }
        if (directDamage) {
            for (const [key] of CombatantStatus.entries(target.status)) {
                updateStatusExpiryAfterHurt.call(this, key);
            }
        }
    }
    heal(combatant, amount) {
        this.changeStatus(combatant, "health", amount);
    }
    //
    decrementStatus(status, key) {
        return this.changeStatus(status, key, -1);
    }
    changeStatus(status, key, delta) {
        if (status instanceof Combatant) {
            status = status.status;
        }
        status[key] = Math.max(0, status[key] + delta);
    }
    resetStatus(status, key) {
        if (status instanceof Combatant) {
            status = status.status;
        }
        status[key] = 0;
    }
}
function shuffleArray(target) {
    for (let i = target.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * i);
        let temp = target[i];
        target[i] = target[j];
        target[j] = temp;
    }
    return target;
}
//# sourceMappingURL=Combat.controller.js.map