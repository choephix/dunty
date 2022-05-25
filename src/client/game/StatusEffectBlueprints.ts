import { map } from "@sdk/helpers/objects";

export enum StatusEffectExpiryType {
  NULL,
  DECREMENT_BEFORE_TURN,
  RESET_BEFORE_TURN,
  RESET_AFTER_ENCOUNTER,
  DECREMENT_AFTER_HURT,
}

const __StatusEffectBlueprints = {
  health: {
    emoji: "❤",
    expiryType: StatusEffectExpiryType.NULL,
    description: "",
    displayName: "Health",
  },
  block: {
    emoji: "⛊",
    expiryType: StatusEffectExpiryType.RESET_BEFORE_TURN,
    description: "Blocks up to X damage until next turn. Decreases for each damage point blocked.",
    displayName: "Block",
    reducesWithDamage: true,
  },
  parry: {
    emoji: "⚔",
    expiryType: StatusEffectExpiryType.RESET_BEFORE_TURN,
    description: "Blocks up to X damage and deals it back until next turn.",
    displayName: "Parry",
  },
  reflect: {
    emoji: "⮎",
    expiryType: StatusEffectExpiryType.RESET_BEFORE_TURN,
    description: "Reflect up to X blocked damage back to attacker.",
    displayName: "Reflect",
  },
  retaliation: {
    emoji: "⥃",
    expiryType: StatusEffectExpiryType.RESET_BEFORE_TURN,
    description: "When attacked (unless killed) deals X damage back until next turn.",
    displayName: "Retaliation",
  },
  protection: {
    emoji: "☥",
    expiryType: StatusEffectExpiryType.DECREMENT_AFTER_HURT,
    description: "Damage from next X attack(s) is nullified",
    displayName: "Protection",
  },
  brittle: {
    emoji: "✖",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
    description: "Increases damage received by X for X turns.",
    displayName: "Brittle",
  }, // + to dmg received
  exposed: {
    emoji: "◎",
    expiryType: StatusEffectExpiryType.DECREMENT_AFTER_HURT,
    description: "Damage from next X attack(s) is doubled",
    displayName: "Exposed",
  }, // x2 to dmg received
  doomed: {
    emoji: "☠",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
    description: "Receive double damage for X turns.",
    displayName: "Doomed",
  }, // x2 to dmg received
  leech: {
    emoji: "⤽",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
    description: "Heal up to X of damage dealt for X turns.",
    displayName: "Leech",
  },
  regeneration: {
    emoji: "✚",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
    description: "Heal up to X health for X turns.",
    displayName: "Regeneration",
  },
  strength: {
    emoji: "🡅",
    expiryType: StatusEffectExpiryType.RESET_AFTER_ENCOUNTER,
    description: "Increases damage dealt by X until the encounter ends.",
    displayName: "Strength",
  },
  rage: {
    emoji: "⮝",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
    description: "Increases damage dealt by X for X turns",
    displayName: "Rage",
  },
  fury: {
    emoji: "⮙",
    expiryType: StatusEffectExpiryType.RESET_BEFORE_TURN,
    description: "Increases damage dealt by X until next turn",
    displayName: "Fury",
  },
  haste: {
    emoji: "♞",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
    description: "Receive X additional energy at turn start for X turns.",
    displayName: "Haste",
  },
  taunt: {
    emoji: "⚑",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
    description: "Allies without Taunt cannot be targeted for X turns.",
    displayName: "Taunt",
  },
  tactical: {
    emoji: "♚",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
    description: "Draw X additional cards at turn start for X turns.",
    displayName: "Tactical",
  },
  daggers: {
    emoji: "⚔",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
    description: "Add X 'Dagger' cards to hand at turn start for X turns.",
    displayName: "Daggers",
  },
  defensive: {
    emoji: "⛨",
    expiryType: StatusEffectExpiryType.RESET_AFTER_ENCOUNTER,
    description: "Increases Block gained by cards by X until the encounter ends.",
    displayName: "Defensive",
  },
  weak: {
    emoji: "🡇",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
    description: "Decreases damage dealt by X for X turns.",
    displayName: "Weak",
  },
  burning: {
    emoji: "♨︎",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
    description: "Receive X Burning damage for X turns.",
    displayName: "Burning",
  },
  poisoned: {
    emoji: "☣",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
    description: "Receive X Poison damage for X turns.",
    displayName: "Poisoned",
  },
  bleeding: {
    emoji: "⚕",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
    description: "Receive X Direct Physical damage for X turns.",
    displayName: "Bleeding",
  },
  stunned: {
    emoji: "⚡︎",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
    description: "Skips taking actions for X turns.",
    displayName: "Stunned",
  },
  frozen: {
    emoji: "❆",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
    description: "Skips taking actions for X turns.",
    displayName: "Frozen",
  },
  wet: {
    emoji: "☂",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
    description: "Susceptible to Freezing and Lightning damage and resistant to Fire damage for X turns.",
    displayName: "Wet",
  },
  warm: {
    emoji: "🌡",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
    description: "Susceptible to burning and poison damage and resistant to cold damage for X turns.",
    displayName: "Warm",
  },
  oiled: {
    emoji: "🌢",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
    description: "Susceptible to burning damage and resistant to lightning damage for X turns.",
    displayName: "Oiled",
  },
  cold: {
    emoji: "❅",
    expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
    description: "Susceptible to cold damage and resistant to burning and poison damage for X turns.",
    displayName: "Cold",
  },
};

export const StatusEffectBlueprints = map(__StatusEffectBlueprints, (key, v) => {
  return {
    displayPriority: Object.keys(__StatusEffectBlueprints).indexOf(key),
    ...v,
  };
});

export type StatusEffectKey = keyof typeof __StatusEffectBlueprints;
