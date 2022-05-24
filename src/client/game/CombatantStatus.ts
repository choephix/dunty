export enum StatusEffectExpiryType {
  NULL,
  DECREMENT_BEFORE_TURN,
  RESET_BEFORE_TURN,
  RESET_AFTER_COMBAT,
}

export const StatusEffectBlueprints = {
  block: {
    emoji: "⛊",
    expiryType: StatusEffectExpiryType.RESET_BEFORE_TURN,
  }, //
  protection: {
    emoji: "☥",
    expiryType: StatusEffectExpiryType.RESET_BEFORE_TURN,
  }, //
  retaliation: {
    emoji: "⥃",
    expiryType: StatusEffectExpiryType.RESET_BEFORE_TURN,
  },
  reflect: {
    emoji: "⮎",
    expiryType: StatusEffectExpiryType.RESET_BEFORE_TURN,
  },
  leech: {
    emoji: "⤽",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
  },
  regeneration: {
    emoji: "✚",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
  },
  strength: {
    emoji: "🡅",
    expiryType: StatusEffectExpiryType.RESET_AFTER_COMBAT,
  },
  rage: {
    emoji: "⮝",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
  },
  fury: {
    emoji: "⮙",
    expiryType: StatusEffectExpiryType.RESET_BEFORE_TURN,
  },
  haste: {
    emoji: "♞",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
  },
  taunt: {
    emoji: "⚑",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
  },
  tactical: {
    emoji: "♚",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
  },
  daggers: {
    emoji: "⚔",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
  },
  defensive: {
    emoji: "⛨",
    expiryType: StatusEffectExpiryType.RESET_AFTER_COMBAT,
  },
  weak: {
    emoji: "🡇",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
  },
  brittle: {
    emoji: "✖",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
  }, // + to dmg received
  exposed: {
    emoji: "◎",
    expiryType: StatusEffectExpiryType.RESET_BEFORE_TURN,
  }, // + to dmg received
  doomed: {
    emoji: "☠",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
  },
  burning: {
    emoji: "♨︎",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
  },
  poisoned: {
    emoji: "☣",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
  },
  bleeding: {
    emoji: "⚕",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
  },
  stunned: {
    emoji: "⚡︎",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
  },
  frozen: {
    emoji: "❆",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
  },
  wet: {
    emoji: "☂",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
  },
  warm: {
    emoji: "🌡",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
  },
  oiled: {
    emoji: "🌢",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
  },
  cold: {
    emoji: "❅",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
  },
};
