import { GameSingletons } from "@client/core/GameSingletons";
import { StatusEffectBlueprints, StatusEffectKey } from "@client/game/StatusEffectBlueprints";
import { Sprite } from "@pixi/sprite";
import { VCard } from "../entities/VCard";

export module ToolTipFactory {

  export function addToCard(card: VCard) {
    const tooltipHintText = {
      atk: `Play and select enemy\nto ATTACK for ${card.data.value} damage.`,
      def: `Play to BLOCK up to\n${card.data.value} of damage until your next turn.`,
      func: card.data.mods
        ? `Play to apply ${Object.keys(card.data.mods)
            .map(s => s.toUpperCase())
            .join(", ")}.`
        : "Play to perform a special action.",
    }[card.data.type];

    const tooltips = GameSingletons.getTooltipManager();
    tooltips.registerTarget(card, tooltipHintText || `Unknown card type: ${card.data.type}`);
  }

  export function addToStatusEffect(sprite: Sprite, statusEffect: StatusEffectKey) {
    const { description = `Unknown status effect "${statusEffect.toUpperCase()}|` } = StatusEffectBlueprints[statusEffect] || {};
    const tooltips = GameSingletons.getTooltipManager();
    tooltips.registerTarget(sprite, description);
  }
}
