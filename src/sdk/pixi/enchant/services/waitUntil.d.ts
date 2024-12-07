declare type Falsy = false | 0 | "" | null | undefined;
declare type Truthy<T> = T extends Falsy ? never : NonNullable<T>;
declare type CleanUpFunction = () => unknown;
declare type ITicker = {
    add: (callback: () => unknown) => CleanUpFunction;
};
export declare function makeWaitUntilService(ticker: ITicker): (<T = boolean>(condition: () => T, onTruthy?: (value: T) => void) => Promise<Truthy<T>>) & {
    _ticker: ITicker;
    orCancel: <T_1>(condition: () => T_1, onTruthy: (value: Truthy<T_1>) => unknown) => () => void;
    orTimeout: <T_2 = boolean>(condition: () => T_2, timeout?: number) => Promise<T_2>;
    orThrowError: <T_3 = boolean>(condition: () => Error | T_3) => Promise<Truthy<T_3>>;
};
export {};
