import { StatusEffectBlueprints } from "@dungeon/combat/state/StatusEffectBlueprints";
// export const statusEffectEmojis: Record<keyof CombatantStatus, { icon: string }> = {
//   health: { icon: `❤` },
//   block: { icon: `⛊` },
//   retaliation: { icon: `⥃` },
//   reflect: { icon: `⮎` },
//   strength: { icon: `🡅` },
//   weak: { icon: `🡇` },
//   burning: { icon: "♨︎" },
//   wet: { icon: "☂" },
//   oiled: { icon: "🌢" },
//   poisoned: { icon: "☣" },
//   stunned: { icon: "⚡︎" },
//   regeneration: { icon: "✚" },
//   doomed: { icon: "☠" },
//   haste: { icon: "♞" },
//   tactical: { icon: "♚" },
//   taunt: { icon: `⚑` },
//   fury: { icon: "⮙" },
//   rage: { icon: "⮝" },
//   warm: { icon: "🌡" },
//   bleeding: { icon: "⚕" },
//   daggers: { icon: "⚔" },
//   defensive: { icon: "⛨" },
//   protection: { icon: "☥" },
//   brittle: { icon: "✖" },
//   leech: { icon: "⤽" },
//   cold: { icon: "❅" },
//   frozen: { icon: "❆" },
//   exposed: { icon: "◎" },
// exposed: { icon: "⍟" },
// inspiring: { icon: "♫" },
// resurrected: { icon: "✟" },
// ranged: { icon: "➳" },
// a: { icon: "⛯" },
// a: { icon: "⛒" },
// a: { icon: "⛏" },
// a: { icon: "⛬" },
// a: { icon: "⛸" },
// a: { icon: "⛆" },
// a: { icon: "⚠" },
// a: { icon: "⚖" },
// a: { icon: "♦" },
// a: { icon: "⚉" },
// a: { icon: "♻" },
// a: { icon: "⚒" },
// a: { icon: "✺" },
// a: { icon: "✷" },
// a: { icon: "✶" },
// a: { icon: "✦" },
// a: { icon: "❀" },
// a: { icon: "✿" },
// a: { icon: "⚘" },
// a: { icon: "❦" },
// a: { icon: "☁" },
// a: { icon: "⚫︎" },
// a: { icon: "⛺︎" },
// sun: { icon: "☀" },
// lucky: { icon: "☘" },
// shogi: { icon: "☗" },
// };
export function getStatusEffectEmojiOnly(statusEffect) {
    return StatusEffectBlueprints[statusEffect].emoji;
}
export function getStatusEffectEmojifiedString(actor, game) {
    const { health, ...props } = actor.status;
    const col = [`❤${health}`];
    for (const [k, v] of Object.entries(props)) {
        const emoji = getStatusEffectEmojiOnly(k);
        if (typeof v === "number" && v != 0)
            col.unshift(`${emoji}${v}`);
        if (typeof v === "boolean")
            col.unshift(`${emoji}`);
    }
    return col.join("\n");
}
export function getIntentionEmojifiedString(actor, game) {
    // const emojifySingleCardIntention = (card: Card) => {
    //   const { type } = card;
    //   if (type === "atk") {
    //     const atk = game.calculateAttackPower(card, actor);
    //     return [`⚔${atk}`, 0xf02020];
    //   }
    //   if (type === "def") {
    //     const def = game.calculateBlockPointsToAdd(card, actor);
    //     return [`⛊${def || "?"}`, 0x70b0f0];
    //   }
    //   if (type === "func") {
    //     return [`★`, 0x00ffff];
    //   }
    // };
    // if (actor.drawPile[0]) {
    //   let result = '';
    //   let color = 0xffffff;
    //   const cardsToDrawCount = game.calculateCardsToDrawOnTurnStart(actor);
    //   for (let i = 0; i < cardsToDrawCount && i < actor.drawPile.length; i++) {
    //     const card = actor.drawPile[i];
    //     [emojifySingleCardIntention(card));
    //   }
    // }
    return [""];
}
//# sourceMappingURL=VCombatant.emojis.js.map