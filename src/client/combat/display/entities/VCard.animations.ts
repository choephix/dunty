import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { VCard } from "@client/combat/display/entities/VCard";

export module VCardAnimations {
  export function playShowAnimation(card: VCard) {
    const tweeener = new TemporaryTweeener(card);
    return tweeener.from(card, { alpha: 0 });
  }
  export function playHideAnimation(card: VCard) {
    const tweeener = new TemporaryTweeener(card);

    card.state.isDisabled.value = true;
    return tweeener.to(card, { alpha: 0 });
    // return tweeener.to(card, { alpha: 0, pixi: { scale: card.scale.x * 1.5 } });
  }
}
