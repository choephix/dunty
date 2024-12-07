export declare enum StatusEffectExpiryType {
    NULL = 0,
    RESET_AFTER_ENCOUNTER = 1,
    RESET_BEFORE_TURN = 2,
    DECREMENT_BEFORE_TURN = 3,
    RESET_AFTER_HURT = 4,
    DECREMENT_AFTER_HURT = 5,
    SUBTRACT_HURT = 6
}
export declare enum StatusEffectImpactAlignment {
    NEUTRAL = 0,
    POSITIVE = 1,
    NEGATIVE = 2
}
declare const __StatusEffectBlueprints: {
    health: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    block: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    };
    parry: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    reflect: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    retaliation: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    protection: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    brittle: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    exposed: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    doomed: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    leech: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    regeneration: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    strength: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    rage: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    fury: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    haste: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    taunt: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    tactical: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    daggers: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    defensive: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    weak: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    burning: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    poisoned: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    bleeding: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    stunned: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    frozen: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    wet: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    warm: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    oiled: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
    cold: {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    };
};
export declare const StatusEffectBlueprints: {
    readonly health: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly block: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly parry: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly reflect: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly retaliation: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly protection: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly brittle: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly exposed: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly doomed: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly leech: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly regeneration: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly strength: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly rage: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly fury: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly haste: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly taunt: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly tactical: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly daggers: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly defensive: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly weak: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly burning: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly poisoned: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly bleeding: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly stunned: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly frozen: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly wet: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly warm: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly oiled: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
    readonly cold: {
        displayPriority: number;
    } & ({
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
        reducesWithDamage: boolean;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    } | {
        emoji: string;
        expiryType: StatusEffectExpiryType;
        description: string;
        displayName: string;
        impactAlignment: StatusEffectImpactAlignment;
    });
};
export declare type StatusEffectKey = keyof typeof __StatusEffectBlueprints;
export {};
