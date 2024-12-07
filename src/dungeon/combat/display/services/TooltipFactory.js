import { CardTarget } from "@dungeon/combat/state/CombatState";
import { StatusEffectBlueprints, StatusEffectExpiryType, } from "@dungeon/combat/state/StatusEffectBlueprints";
import { GameSingletons } from "@dungeon/core/GameSingletons";
export var ToolTipFactory;
(function (ToolTipFactory) {
    function getStatusEffectHintText(statusEffect, value) {
        const blueprint = StatusEffectBlueprints[statusEffect];
        const { displayName = statusEffect.toUpperCase(), description = `Unknown status effect` } = blueprint || {};
        const expiryHint = {
            [StatusEffectExpiryType.DECREMENT_AFTER_HURT]: `Decrements after taking damage.`,
            [StatusEffectExpiryType.DECREMENT_BEFORE_TURN]: `Decrements before next turn.`,
            [StatusEffectExpiryType.RESET_AFTER_ENCOUNTER]: `Resets after the combat encounter.`,
            [StatusEffectExpiryType.RESET_BEFORE_TURN]: `Resets before next turn.`,
            [StatusEffectExpiryType.NULL]: `Does not expire.`,
        }[blueprint.expiryType] || ``;
        return `${displayName.toUpperCase()}\n${description}\n(${expiryHint})`.trim().replace(/ X /g, ` ${value} `);
    }
    function getCardHintText(card) {
        if (card.description) {
            return card.description;
        }
        const TARGET = {
            [CardTarget.ALL]: "everyone",
            [CardTarget.ALL_ENEMIES]: "all enemies",
            [CardTarget.FRONT_ENEMY]: "front enemy",
            [CardTarget.SELF]: "self",
            [CardTarget.TARGET_ENEMY]: "selected enemy",
            [CardTarget.TARGET_ANYONE]: "any target",
        }[card.target];
        switch (card.type) {
            case "atk":
                return `ATTACK ${TARGET} for ${card.value} damage.`;
            case "def":
                return `Play to BLOCK up to ${card.value} of damage until your next turn.\n(Applies to ${TARGET})`;
            case "func": {
                if (!card.mods)
                    return "Play to perform a special action.";
                const entries = Object.entries(card.mods);
                const modsList = entries.map(([k, v]) => `${v}x ${k.toUpperCase()}`).join(", ");
                const paragraphs = [
                    `Play to apply ${modsList} to ${TARGET}.`,
                    ...entries.map(([k, v]) => getStatusEffectHintText(k, v)),
                ];
                return paragraphs.join("\n\n");
            }
            default:
                return `Unknown card type: ${card.type}`;
        }
    }
    function getEnemyIntentionHintText(card) {
        if (typeof card === "string") {
            return card;
        }
        const TARGET = {
            [CardTarget.ALL]: "everyone",
            [CardTarget.ALL_ENEMIES]: "you",
            [CardTarget.FRONT_ENEMY]: "you",
            [CardTarget.SELF]: "self",
            [CardTarget.TARGET_ENEMY]: "you",
            [CardTarget.TARGET_ANYONE]: "someone",
        }[card.target];
        switch (card.type) {
            case "atk":
                return `Enemy intends to\nATTACK you for ${card.value} damage next turn.`;
            case "def":
                return `Enemy intends to apply\n${card.value}x BLOCK to self next turn.`;
            case "func": {
                if (!card.mods)
                    return "Play to perform a special action.";
                const entries = Object.entries(card.mods);
                const modsList = entries.map(([k, v]) => `${v}x ${k.toUpperCase()}`).join(", ");
                const paragraphs = [
                    `Enemy intends to apply\n${modsList} to ${TARGET}.`,
                    ...entries.map(([k, v]) => getStatusEffectHintText(k, v)),
                ];
                return paragraphs.join("\n\n");
            }
            default:
                return `Unknown card type: ${card.type}`;
        }
    }
    function addToCard(card) {
        const tooltips = GameSingletons.getTooltipManager();
        const hint = getCardHintText(card.data) + `\n\nCosts ⦿${card.data.cost} energy to play.`;
        tooltips.registerTarget(card, { content: hint, wordWrapWidth: 300 });
    }
    ToolTipFactory.addToCard = addToCard;
    function addIntentionIndicator(sprite, data) {
        const tooltips = GameSingletons.getTooltipManager();
        tooltips.registerTarget(sprite, { content: getEnemyIntentionHintText(data), wordWrapWidth: 300 });
    }
    ToolTipFactory.addIntentionIndicator = addIntentionIndicator;
    function addToStatusEffect(sprite, statusEffect, value) {
        const tooltips = GameSingletons.getTooltipManager();
        tooltips.registerTarget(sprite, { content: getStatusEffectHintText(statusEffect, value), wordWrapWidth: 300 });
    }
    ToolTipFactory.addToStatusEffect = addToStatusEffect;
    function addToEnergyIndicator(sprite, value) {
        const tooltipHintText = `Energy is used to play cards.\n\nYou have ${value} energy.`;
        const tooltips = GameSingletons.getTooltipManager();
        tooltips.registerTarget(sprite, {
            content: tooltipHintText,
            wordWrapWidth: 300,
        });
    }
    ToolTipFactory.addToEnergyIndicator = addToEnergyIndicator;
})(ToolTipFactory || (ToolTipFactory = {}));
//# sourceMappingURL=TooltipFactory.js.map