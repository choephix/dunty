import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
export var VCardAnimations;
(function (VCardAnimations) {
    function playShowAnimation(card) {
        const tweeener = new TemporaryTweeener(card);
        return tweeener.from(card, { alpha: 0 });
    }
    VCardAnimations.playShowAnimation = playShowAnimation;
    function playHideAnimation(card) {
        const tweeener = new TemporaryTweeener(card);
        card.state.isDisabled.value = true;
        return tweeener.to(card, { alpha: 0 });
        // return tweeener.to(card, { alpha: 0, pixi: { scale: card.scale.x * 1.5 } });
    }
    VCardAnimations.playHideAnimation = playHideAnimation;
})(VCardAnimations || (VCardAnimations = {}));
//# sourceMappingURL=VCard.animations.js.map