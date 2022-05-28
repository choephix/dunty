import { GameSingletons } from "@client/core/GameSingletons";
import { Card, CardTarget } from "@client/game/game";
import { StatusEffectBlueprints, StatusEffectKey } from "@client/game/StatusEffectBlueprints";
import { Sprite } from "@pixi/sprite";
import { VCard } from "../entities/VCard";

export module ToolTipFactory {
  function getStatusEffectHintText(statusEffect: StatusEffectKey, value: number) {
    const { displayName = statusEffect.toUpperCase(), description = `Unknown status effect` } =
      StatusEffectBlueprints[statusEffect] || {};

    return `${displayName.toUpperCase()}\n${description}`.trim().replace(/ X /g, ` ${value} `);
  }

  function getCardHintText(card: Card) {
    const TARGET = {
      [CardTarget.ALL]: "everyone",
      [CardTarget.ALL_ENEMIES]: "all enemies",
      [CardTarget.FRONT_ENEMY]: "front enemy",
      [CardTarget.SELF]: "self",
      [CardTarget.TARGET_ENEMY]: "target enemy",
      [CardTarget.TARGET_ANYONE]: "any target",
    }[card.target];

    switch (card.type) {
      case "atk":
        return `Play and select enemy\nto ATTACK for ${card.value} damage.`;
      case "def":
        return `Play to BLOCK up to\n${card.value} of damage until your next turn.`;
      case "func": {
        if (!card.mods) return "Play to perform a special action.";
        const entries = Object.entries(card.mods);
        const modsList = entries.map(([k, v]) => `${v}x ${k.toUpperCase()}`).join(", ");
        const paragraphs = [
          `Play to apply\n${modsList} to ${TARGET}.`,
          ...entries.map(([k, v]) => getStatusEffectHintText(k as any, v)),
        ];
        return paragraphs.join("\n\n");
      }
      default:
        return `Unknown card type: ${card.type}`;
    }
  }

  export function addToCard(card: VCard) {
    const tooltips = GameSingletons.getTooltipManager();
    tooltips.registerTarget(card, getCardHintText(card.data));
    tooltips.registerTarget(card, { content: getCardHintText(card.data), wordWrapWidth: 300 });
  }

  export function addIntentionIndicator(sprite: Sprite, data: Card | string) {
    const TARGET =
      typeof data === "string"
        ? null
        : {
            [CardTarget.ALL]: "everyone",
            [CardTarget.ALL_ENEMIES]: "you",
            [CardTarget.FRONT_ENEMY]: "you",
            [CardTarget.SELF]: "self",
            [CardTarget.TARGET_ENEMY]: "you",
            [CardTarget.TARGET_ANYONE]: "someone",
          }[data.target];

    const tooltipHintText =
      typeof data === "string"
        ? data
        : {
            atk: `Enemy intends to\nATTACK you for ${data.value} damage next turn.`,
            def: `Enemy intends to apply\n${data.value}x BLOCK to self next turn.`,
            func: data.mods
              ? `Enemy intends to apply\n${Object.entries(data.mods)
                  .map(([k, v]) => `${v}x ${k.toUpperCase()}`)
                  .join(", ")} to ${TARGET} next turn.`
              : "Enemy will perform\na special action next turn.",
          }[data.type] || `Unknown card type: ${data.type}`;

    const tooltips = GameSingletons.getTooltipManager();
    tooltips.registerTarget(sprite, tooltipHintText);
  }

  export function addToStatusEffect(sprite: Sprite, statusEffect: StatusEffectKey, value: number) {
    const tooltips = GameSingletons.getTooltipManager();
    tooltips.registerTarget(sprite, { content: getStatusEffectHintText(statusEffect, value), wordWrapWidth: 300 });
  }

  export function addToEnergyIndicator(sprite: Sprite, value: number) {
    const tooltipHintText = `Energy is used to play cards.\nYou have ${value} energy.`;
    const tooltips = GameSingletons.getTooltipManager();
    tooltips.registerTarget(sprite, {
      content: tooltipHintText,
      wordWrapWidth: 300,
    });
  }
}
