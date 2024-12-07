import { DisplayObject } from "@pixi/display";
export declare type EnchantableInstance = Pick<DisplayObject, "updateTransform" | "render" | "destroy">;
export declare type TFn = () => unknown;
export declare function createEnchantedFrameLoop<T extends EnchantableInstance>(this: T | void, target: T): (() => void) & {
    enabled: boolean;
    callbacks: TFn[];
    add: (...cbs: TFn[]) => () => void;
    remove: (...cbs: TFn[]) => void;
    clear: () => void;
    watch: (<T_1>(getValue: () => T_1, onChange: (newValue: T_1, oldValue: T_1) => any, shouldMakeInitialCall?: boolean) => () => unknown) & {
        _ticker: {
            add: (callback: () => unknown) => () => unknown;
        };
        array: <T_2 extends unknown[]>(getValues: () => Readonly<T_2>, onChange: (newValues: Readonly<T_2>, oldValues: Readonly<T_2>) => any, shouldMakeInitialCall?: boolean) => () => unknown;
        properties: <T_3 extends {}>(getValues: () => Readonly<T_3>, onChange: (newValues: Readonly<T_3>, oldValues: Readonly<T_3>) => any, shouldMakeInitialCall?: boolean) => () => unknown;
        andCleanup: <T_4 = boolean>(getValue: () => T_4, ...handlers: ((newValue: T_4 extends false | "" | 0 ? never : NonNullable<T_4>) => (v?: T_4) => unknown)[]) => (skipHandlersCleanup?: boolean) => void;
        log: <T_5>(getValue: () => T_5, process?: (value: T_5) => unknown) => () => unknown;
    };
    waitUntil: (<T_6 = boolean>(condition: () => T_6, onTruthy?: (value: T_6) => void) => Promise<T_6 extends false | "" | 0 ? never : NonNullable<T_6>>) & {
        _ticker: {
            add: (callback: () => unknown) => () => unknown;
        };
        orCancel: <T_7>(condition: () => T_7, onTruthy: (value: T_7 extends false | "" | 0 ? never : NonNullable<T_7>) => unknown) => () => void;
        orTimeout: <T_8 = boolean>(condition: () => T_8, timeout?: number) => Promise<T_8>;
        orThrowError: <T_9 = boolean>(condition: () => Error | T_9) => Promise<T_9 extends false | "" | 0 ? never : NonNullable<T_9>>;
    };
    imitate: (<T1 extends import("../../sdk/pixi/enchant/interfaces").EnchantedInstance<import("@pixi/display").Container<DisplayObject>>, T2>(imitator: T1, source: T2, sourceKeys: (keyof T1 & keyof T2)[]) => () => unknown) & {
        _ticker: {
            add: (callback: () => unknown) => () => unknown;
        };
    };
};
export declare module createEnchantedFrameLoop {
    function andAssignTo<T extends EnchantableInstance>(target: T): T & {
        onEnterFrame: (() => void) & {
            enabled: boolean;
            callbacks: TFn[];
            add: (...cbs: TFn[]) => () => void;
            remove: (...cbs: TFn[]) => void;
            clear: () => void;
            watch: (<T_1>(getValue: () => T_1, onChange: (newValue: T_1, oldValue: T_1) => any, shouldMakeInitialCall?: boolean) => () => unknown) & {
                _ticker: {
                    add: (callback: () => unknown) => () => unknown;
                };
                array: <T_2 extends unknown[]>(getValues: () => Readonly<T_2>, onChange: (newValues: Readonly<T_2>, oldValues: Readonly<T_2>) => any, shouldMakeInitialCall?: boolean) => () => unknown;
                properties: <T_3 extends {}>(getValues: () => Readonly<T_3>, onChange: (newValues: Readonly<T_3>, oldValues: Readonly<T_3>) => any, shouldMakeInitialCall?: boolean) => () => unknown;
                andCleanup: <T_4 = boolean>(getValue: () => T_4, ...handlers: ((newValue: T_4 extends false | "" | 0 ? never : NonNullable<T_4>) => (v?: T_4) => unknown)[]) => (skipHandlersCleanup?: boolean) => void;
                log: <T_5>(getValue: () => T_5, process?: (value: T_5) => unknown) => () => unknown;
            };
            waitUntil: (<T_6 = boolean>(condition: () => T_6, onTruthy?: (value: T_6) => void) => Promise<T_6 extends false | "" | 0 ? never : NonNullable<T_6>>) & {
                _ticker: {
                    add: (callback: () => unknown) => () => unknown;
                };
                orCancel: <T_7>(condition: () => T_7, onTruthy: (value: T_7 extends false | "" | 0 ? never : NonNullable<T_7>) => unknown) => () => void;
                orTimeout: <T_8 = boolean>(condition: () => T_8, timeout?: number) => Promise<T_8>;
                orThrowError: <T_9 = boolean>(condition: () => Error | T_9) => Promise<T_9 extends false | "" | 0 ? never : NonNullable<T_9>>;
            };
            imitate: (<T1 extends import("../../sdk/pixi/enchant/interfaces").EnchantedInstance<import("@pixi/display").Container<DisplayObject>>, T2>(imitator: T1, source: T2, sourceKeys: (keyof T1 & keyof T2)[]) => () => unknown) & {
                _ticker: {
                    add: (callback: () => unknown) => () => unknown;
                };
            };
        };
    };
}
