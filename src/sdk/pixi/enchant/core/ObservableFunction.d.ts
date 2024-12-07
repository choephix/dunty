export declare function createObservableFunction<T extends (...args: any[]) => unknown = () => void>(this: any, fn?: T): ((...args: Parameters<T>) => void) & {
    enabled: boolean;
    callbacks: T[];
    add: (...cbs: T[]) => () => void;
    remove: (...cbs: T[]) => void;
    clear: () => void;
};
