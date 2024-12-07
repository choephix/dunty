import { VCard } from "@dungeon/combat/display/entities/VCard";
export declare module VCardAnimations {
    function playShowAnimation(card: VCard): Promise<void> | gsap.core.Tween;
    function playHideAnimation(card: VCard): Promise<void> | gsap.core.Tween;
}
