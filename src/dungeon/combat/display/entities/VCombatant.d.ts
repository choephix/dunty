import { Combatant } from "@dungeon/combat/state/CombatState";
import { Container } from "@pixi/display";
export declare class VCombatant extends Container {
    readonly data: Combatant;
    highlight: any;
    sprite: any;
    statusIndicators: any;
    intentionIndicator: any;
    energyIndicator: any;
    thought?: string;
    name: string;
    readonly breathingOptions: {};
    constructor(data: Combatant);
    readonly onEnterFrame: (() => void) & {
        enabled: boolean;
        callbacks: import("@sdk-pixi/asorted/createEnchangedFrameLoop").TFn[];
        add: (...cbs: import("@sdk-pixi/asorted/createEnchangedFrameLoop").TFn[]) => () => void;
        remove: (...cbs: import("@sdk-pixi/asorted/createEnchangedFrameLoop").TFn[]) => void;
        clear: () => void;
        watch: (<T>(getValue: () => T, onChange: (newValue: T, oldValue: T) => any, shouldMakeInitialCall?: boolean) => () => unknown) & {
            _ticker: {
                add: (callback: () => unknown) => () => unknown;
            };
            array: <T_1 extends unknown[]>(getValues: () => Readonly<T_1>, onChange: (newValues: Readonly<T_1>, oldValues: Readonly<T_1>) => any, shouldMakeInitialCall?: boolean) => () => unknown;
            properties: <T_2 extends {}>(getValues: () => Readonly<T_2>, onChange: (newValues: Readonly<T_2>, oldValues: Readonly<T_2>) => any, shouldMakeInitialCall?: boolean) => () => unknown;
            andCleanup: <T_3 = boolean>(getValue: () => T_3, ...handlers: ((newValue: T_3 extends false | "" | 0 ? never : NonNullable<T_3>) => (v?: T_3) => unknown)[]) => (skipHandlersCleanup?: boolean) => void;
            log: <T_4>(getValue: () => T_4, process?: (value: T_4) => unknown) => () => unknown;
        };
        waitUntil: (<T_5 = boolean>(condition: () => T_5, onTruthy?: (value: T_5) => void) => Promise<T_5 extends false | "" | 0 ? never : NonNullable<T_5>>) & {
            _ticker: {
                add: (callback: () => unknown) => () => unknown;
            };
            orCancel: <T_6>(condition: () => T_6, onTruthy: (value: T_6 extends false | "" | 0 ? never : NonNullable<T_6>) => unknown) => () => void;
            orTimeout: <T_7 = boolean>(condition: () => T_7, timeout?: number) => Promise<T_7>;
            orThrowError: <T_8 = boolean>(condition: () => Error | T_8) => Promise<T_8 extends false | "" | 0 ? never : NonNullable<T_8>>;
        };
        imitate: (<T1 extends import("../../../../sdk/pixi/enchant/interfaces").EnchantedInstance<Container<import("@pixi/display").DisplayObject>>, T2>(imitator: T1, source: T2, sourceKeys: (keyof T1 & keyof T2)[]) => () => unknown) & {
            _ticker: {
                add: (callback: () => unknown) => () => unknown;
            };
        };
    };
    startBreathing({ start, speed, skew }?: {
        start?: number;
        speed?: number;
        skew?: number;
    }): void;
    private intializeAnimationReactors;
    private addStatusIndicators;
    private addIntentionIndicator;
    private addEnergyIndicator;
    setRightSide(rightSide: boolean): void;
    waitUntilLoaded(): Promise<any>;
}
