export declare class EnchantmentCallbacksList<T extends (...rest: any[]) => unknown = () => unknown> {
    private cbs?;
    private cbsLen;
    constructor(...cbs: T[]);
    add(...cbs: T[]): () => void;
    remove(...cbs: T[]): void;
    push(...cbs: T[]): number;
    popAndCallAll($this: any, ...args: Parameters<T>): void;
    callAll($this: any, ...args: Parameters<T>): void;
    clear(): void;
}
