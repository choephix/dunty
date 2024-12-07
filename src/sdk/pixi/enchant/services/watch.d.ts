declare type Falsy = false | 0 | "" | null | undefined;
declare type Truthy<T> = T extends Falsy ? never : NonNullable<T>;
declare type CleanUpFunction = () => unknown;
declare type ITicker = {
    add: (callback: () => unknown) => CleanUpFunction;
};
export declare function makeWatchService(ticker: ITicker): (<T>(getValue: () => T, onChange: (newValue: T, oldValue: T) => any, shouldMakeInitialCall?: boolean) => CleanUpFunction) & {
    _ticker: ITicker;
    array: <T_1 extends unknown[]>(getValues: () => Readonly<T_1>, onChange: (newValues: Readonly<T_1>, oldValues: Readonly<T_1>) => any, shouldMakeInitialCall?: boolean) => CleanUpFunction;
    properties: <T_2 extends {}>(getValues: () => Readonly<T_2>, onChange: (newValues: Readonly<T_2>, oldValues: Readonly<T_2>) => any, shouldMakeInitialCall?: boolean) => CleanUpFunction;
    andCleanup: <T_3 = boolean>(getValue: () => T_3, ...handlers: ((newValue: Truthy<T_3>) => (v?: T_3) => unknown)[]) => (skipHandlersCleanup?: boolean) => void;
    log: <T_4>(getValue: () => T_4, process?: (value: T_4) => unknown) => CleanUpFunction;
};
export {};
