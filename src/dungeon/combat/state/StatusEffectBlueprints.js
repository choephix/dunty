import { map } from "@sdk/helpers/objects";
export var StatusEffectExpiryType;
(function (StatusEffectExpiryType) {
    StatusEffectExpiryType[StatusEffectExpiryType["NULL"] = 0] = "NULL";
    StatusEffectExpiryType[StatusEffectExpiryType["RESET_AFTER_ENCOUNTER"] = 1] = "RESET_AFTER_ENCOUNTER";
    StatusEffectExpiryType[StatusEffectExpiryType["RESET_BEFORE_TURN"] = 2] = "RESET_BEFORE_TURN";
    StatusEffectExpiryType[StatusEffectExpiryType["DECREMENT_BEFORE_TURN"] = 3] = "DECREMENT_BEFORE_TURN";
    StatusEffectExpiryType[StatusEffectExpiryType["RESET_AFTER_HURT"] = 4] = "RESET_AFTER_HURT";
    StatusEffectExpiryType[StatusEffectExpiryType["DECREMENT_AFTER_HURT"] = 5] = "DECREMENT_AFTER_HURT";
    StatusEffectExpiryType[StatusEffectExpiryType["SUBTRACT_HURT"] = 6] = "SUBTRACT_HURT";
})(StatusEffectExpiryType || (StatusEffectExpiryType = {}));
export var StatusEffectImpactAlignment;
(function (StatusEffectImpactAlignment) {
    StatusEffectImpactAlignment[StatusEffectImpactAlignment["NEUTRAL"] = 0] = "NEUTRAL";
    StatusEffectImpactAlignment[StatusEffectImpactAlignment["POSITIVE"] = 1] = "POSITIVE";
    StatusEffectImpactAlignment[StatusEffectImpactAlignment["NEGATIVE"] = 2] = "NEGATIVE";
})(StatusEffectImpactAlignment || (StatusEffectImpactAlignment = {}));
const __StatusEffectBlueprints = {
    health: {
        emoji: "❤",
        expiryType: StatusEffectExpiryType.NULL,
        description: "",
        displayName: "Health",
        impactAlignment: StatusEffectImpactAlignment.POSITIVE,
    },
    block: {
        emoji: "⛊",
        expiryType: StatusEffectExpiryType.RESET_BEFORE_TURN,
        description: "Blocks up to X damage until next turn. Decreases for each damage point blocked.",
        displayName: "Block",
        impactAlignment: StatusEffectImpactAlignment.POSITIVE,
        reducesWithDamage: true,
    },
    parry: {
        emoji: "⚔",
        expiryType: StatusEffectExpiryType.RESET_BEFORE_TURN,
        description: "Blocks up to X damage and deals it back until next turn.",
        displayName: "Parry",
        impactAlignment: StatusEffectImpactAlignment.POSITIVE,
    },
    reflect: {
        emoji: "⮎",
        expiryType: StatusEffectExpiryType.RESET_BEFORE_TURN,
        // description: "Reflect up to X blocked damage back to attacker.",
        description: "Reflect all damage back to attacker.",
        displayName: "Reflect",
        impactAlignment: StatusEffectImpactAlignment.POSITIVE,
    },
    retaliation: {
        emoji: "⥃",
        expiryType: StatusEffectExpiryType.RESET_BEFORE_TURN,
        description: "When attacked (unless killed) deals X damage back until next turn.",
        displayName: "Retaliation",
        impactAlignment: StatusEffectImpactAlignment.POSITIVE,
    },
    protection: {
        emoji: "☥",
        expiryType: StatusEffectExpiryType.DECREMENT_AFTER_HURT,
        description: "Damage from next X attack(s) is nullified",
        displayName: "Protection",
        impactAlignment: StatusEffectImpactAlignment.POSITIVE,
    },
    brittle: {
        emoji: "✖",
        expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
        description: "Increases damage received by X for X turns.",
        displayName: "Brittle",
        impactAlignment: StatusEffectImpactAlignment.NEGATIVE,
    },
    exposed: {
        emoji: "◎",
        expiryType: StatusEffectExpiryType.DECREMENT_AFTER_HURT,
        description: "Damage from next X attack(s) is doubled",
        displayName: "Exposed",
        impactAlignment: StatusEffectImpactAlignment.NEGATIVE,
    },
    doomed: {
        emoji: "☠",
        expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
        description: "Receive double damage for X turns.",
        displayName: "Doomed",
        impactAlignment: StatusEffectImpactAlignment.NEGATIVE,
    },
    leech: {
        emoji: "⤽",
        expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
        description: "Heal up to X of damage dealt for X turns.",
        displayName: "Leech",
        impactAlignment: StatusEffectImpactAlignment.POSITIVE,
    },
    regeneration: {
        emoji: "✚",
        expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
        description: "Heal up to X health for X turns.",
        displayName: "Regeneration",
        impactAlignment: StatusEffectImpactAlignment.POSITIVE,
    },
    strength: {
        emoji: "🡅",
        expiryType: StatusEffectExpiryType.RESET_AFTER_ENCOUNTER,
        description: "Increases damage dealt by X until the encounter ends.",
        displayName: "Strength",
        impactAlignment: StatusEffectImpactAlignment.POSITIVE,
    },
    rage: {
        emoji: "⮝",
        expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
        description: "Increases damage dealt by X for X turns",
        displayName: "Rage",
        impactAlignment: StatusEffectImpactAlignment.POSITIVE,
    },
    fury: {
        emoji: "⮙",
        expiryType: StatusEffectExpiryType.RESET_BEFORE_TURN,
        description: "Increases damage dealt by X until next turn",
        displayName: "Fury",
        impactAlignment: StatusEffectImpactAlignment.POSITIVE,
    },
    haste: {
        emoji: "♞",
        expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
        description: "Receive X additional energy at turn start for X turns.",
        displayName: "Haste",
        impactAlignment: StatusEffectImpactAlignment.POSITIVE,
    },
    taunt: {
        emoji: "⚑",
        expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
        description: "Allies without Taunt cannot be targeted for X turns.",
        displayName: "Taunt",
        impactAlignment: StatusEffectImpactAlignment.POSITIVE,
    },
    tactical: {
        emoji: "♚",
        expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
        description: "Draw X additional cards at turn start for X turns.",
        displayName: "Tactical",
        impactAlignment: StatusEffectImpactAlignment.POSITIVE,
    },
    daggers: {
        emoji: "⚔",
        expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
        description: "Add X 'Dagger' cards to hand at turn start for X turns.",
        displayName: "Daggers",
        impactAlignment: StatusEffectImpactAlignment.POSITIVE,
    },
    defensive: {
        emoji: "⛨",
        // expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
        expiryType: StatusEffectExpiryType.RESET_AFTER_ENCOUNTER,
        description: "Increases Block gained by cards by X until the encounter ends.",
        displayName: "Defensive",
        impactAlignment: StatusEffectImpactAlignment.POSITIVE,
    },
    weak: {
        emoji: "🡇",
        expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
        description: "Decreases damage dealt by X for X turns.",
        displayName: "Weak",
        impactAlignment: StatusEffectImpactAlignment.NEGATIVE,
    },
    burning: {
        emoji: "♨︎",
        expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
        description: "Receive X Burning damage for X turns.",
        displayName: "Burning",
        impactAlignment: StatusEffectImpactAlignment.NEGATIVE,
    },
    poisoned: {
        emoji: "☣",
        expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
        description: "Receive X Poison damage for X turns.",
        displayName: "Poisoned",
        impactAlignment: StatusEffectImpactAlignment.NEGATIVE,
    },
    bleeding: {
        emoji: "⚕",
        expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
        description: "Receive X Direct Physical damage for X turns.",
        displayName: "Bleeding",
        impactAlignment: StatusEffectImpactAlignment.NEGATIVE,
    },
    stunned: {
        emoji: "⚡︎",
        expiryType: StatusEffectExpiryType.NULL,
        description: "Skips taking actions for X turns.",
        displayName: "Stunned",
        impactAlignment: StatusEffectImpactAlignment.NEGATIVE,
    },
    frozen: {
        emoji: "❆",
        expiryType: StatusEffectExpiryType.NULL,
        description: "Skips taking actions for X turns.",
        displayName: "Frozen",
        impactAlignment: StatusEffectImpactAlignment.NEGATIVE,
    },
    wet: {
        emoji: "☂",
        expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
        description: "Susceptible to Freezing and Lightning damage and resistant to Fire damage for X turns.",
        displayName: "Wet",
        impactAlignment: StatusEffectImpactAlignment.NEUTRAL,
    },
    warm: {
        emoji: "🌡",
        expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
        description: "Susceptible to burning and poison damage and resistant to cold damage for X turns.",
        displayName: "Warm",
        impactAlignment: StatusEffectImpactAlignment.NEUTRAL,
    },
    oiled: {
        emoji: "🌢",
        expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
        description: "Susceptible to burning damage and resistant to lightning damage for X turns.",
        displayName: "Oiled",
        impactAlignment: StatusEffectImpactAlignment.NEUTRAL,
    },
    cold: {
        emoji: "❅",
        expiryType: StatusEffectExpiryType.DECREMENT_BEFORE_TURN,
        description: "Susceptible to cold damage and resistant to burning and poison damage for X turns.",
        displayName: "Cold",
        impactAlignment: StatusEffectImpactAlignment.NEUTRAL,
    },
};
export const StatusEffectBlueprints = map(__StatusEffectBlueprints, (key, v) => {
    return { displayPriority: Object.keys(__StatusEffectBlueprints).indexOf(key), ...v };
});
//# sourceMappingURL=StatusEffectBlueprints.js.map