import { Combatant, Game } from "@client/game/game";
import { StatusEffectBlueprints, StatusEffectKey } from "@client/game/StatusEffectBlueprints";

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

export function getStatusEffectEmojiOnly(statusEffect: StatusEffectKey) {
  return StatusEffectBlueprints[statusEffect].emoji;
}

export function getStatusEffectEmojifiedString(actor: Combatant, game: Game) {
  const { health, ...props } = actor.status;
  const col = [`❤${health}`];
  for (const [k, v] of Object.entries(props) as [keyof typeof props, number][]) {
    const emoji = getStatusEffectEmojiOnly(k);
    if (typeof v === "number" && v != 0) col.unshift(`${emoji}${v}`);
    if (typeof v === "boolean") col.unshift(`${emoji}`);
  }
  return col.join("\n");
}

export function getIntentionEmojifiedString(actor: Combatant, game: Game): [string, number?] {
  if (actor.nextCard) {
    const { type, value } = actor.nextCard;

    if (type === "atk") {
      const atk = game.calculateAttackPower(actor.nextCard, actor);
      return [`⚔${atk}`, 0xf02020];
    }

    if (type === "def") {
      return [`⛊${value || "?"}`, 0x70b0f0];
    }

    if (type === "func") {
      return [`★`, 0x00ffff];
    }
  }
  return [""];
}
