import { EnchantmentCallbacksList } from "./core/EnchantmentCallbacksList";
export declare class Enchantments {
    readonly onDestroyCallbacks: EnchantmentCallbacksList<() => unknown>;
    readonly onDestroy: (...cbs: (() => unknown)[]) => () => void;
    readonly onEnterFrame: (() => void) & {
        enabled: boolean;
        callbacks: (() => void)[];
        add: (...cbs: (() => void)[]) => () => void;
        remove: (...cbs: (() => void)[]) => void;
        clear: () => void;
    };
    readonly watch: (<T>(getValue: () => T, onChange: (newValue: T, oldValue: T) => any, shouldMakeInitialCall?: boolean) => () => unknown) & {
        _ticker: {
            add: (callback: () => unknown) => () => unknown;
        };
        array: <T_1 extends unknown[]>(getValues: () => Readonly<T_1>, onChange: (newValues: Readonly<T_1>, oldValues: Readonly<T_1>) => any, shouldMakeInitialCall?: boolean) => () => unknown;
        properties: <T_2 extends {}>(getValues: () => Readonly<T_2>, onChange: (newValues: Readonly<T_2>, oldValues: Readonly<T_2>) => any, shouldMakeInitialCall?: boolean) => () => unknown;
        andCleanup: <T_3 = boolean>(getValue: () => T_3, ...handlers: ((newValue: T_3 extends false | "" | 0 ? never : NonNullable<T_3>) => (v?: T_3) => unknown)[]) => (skipHandlersCleanup?: boolean) => void;
        log: <T_4>(getValue: () => T_4, process?: (value: T_4) => unknown) => () => unknown;
    };
    readonly waitUntil: (<T = boolean>(condition: () => T, onTruthy?: (value: T) => void) => Promise<T extends false | "" | 0 ? never : NonNullable<T>>) & {
        _ticker: {
            add: (callback: () => unknown) => () => unknown;
        };
        orCancel: <T_1>(condition: () => T_1, onTruthy: (value: T_1 extends false | "" | 0 ? never : NonNullable<T_1>) => unknown) => () => void;
        orTimeout: <T_2 = boolean>(condition: () => T_2, timeout?: number) => Promise<T_2>;
        orThrowError: <T_3 = boolean>(condition: () => Error | T_3) => Promise<T_3 extends false | "" | 0 ? never : NonNullable<T_3>>;
    };
    readonly imitate: (<T1 extends import("./interfaces").EnchantedInstance<import("@pixi/display").Container<import("@pixi/display").DisplayObject>>, T2>(imitator: T1, source: T2, sourceKeys: (keyof T1 & keyof T2)[]) => () => unknown) & {
        _ticker: {
            add: (callback: () => unknown) => () => unknown;
        };
    };
}
