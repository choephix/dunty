import { Combatant, CombatantStatus, Game } from "@client/game/game";

export const statusEffectEmojis: Record<keyof CombatantStatus, { icon: string }> = {
  health: { icon: `❤` },
  block: { icon: `⛊` },
  retaliation: { icon: `⥃` },
  reflect: { icon: `⮎` },
  strength: { icon: `🡅` },
  weak: { icon: `🡇` },
  burning: { icon: "♨︎" },
  wet: { icon: "☂" },
  oiled: { icon: "🌢" },
  poisoned: { icon: "☣" },
  stunned: { icon: "⚡︎" },
  regeneration: { icon: "✚" },
  doomed: { icon: "☠" },
  haste: { icon: "♞" },
  tactical: { icon: "♚" },
  taunt: { icon: `⚑` },
  fury: { icon: "⮙" },
  rage: { icon: "⮝" },
  warm: { icon: "🌡" },
  bleeding: { icon: "⚕" },
  daggers: { icon: "⚔" },
  defensive: { icon: "⛨" },
  protection: { icon: "☥" },
  brittle: { icon: "✖" },
  leech: { icon: "⤽" },
  cold: { icon: "❅" },
  frozen: { icon: "❆" },
  exposed: { icon: "⍟" },
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
  // bullseye: { icon: "◎" },
};

export function getStatusEffectEmojifiedString(actor: Combatant, game: Game) {
  const { health, ...props } = actor.status;
  const col = [`❤${health}`];
  for (const [k, v] of Object.entries(props) as [keyof CombatantStatus, number][]) {
    const { icon = "?" } = statusEffectEmojis[k] || {};
    if (typeof v === "number" && v != 0) col.unshift(`${icon}${v}`);
    if (typeof v === "boolean") col.unshift(`${icon}`);
  }
  return col.join("\n");
}

export function getIntentionEmojifiedString(actor: Combatant, game: Game) {
  if (actor.nextCard) {
    const { type, value } = actor.nextCard;
    if (type === "atk") {
      const atk = game.calculateAttackPower(actor.nextCard, actor);
      return `⚔${atk}`;
    }
    if (type === "def") {
      return `⛊${value || "?"}`;
    }
    if (type === "func") {
      return `★`;
    }
  }
  return "";
}
