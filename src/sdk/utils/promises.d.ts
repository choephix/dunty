/**
 * @returns A promise, which resolve on the next render frame.
 */
export declare function nextFrame(): Promise<unknown>;
export declare function delay(seconds: number): Promise<unknown>;
export declare type CancellablePromiseLike<T> = PromiseLike<T> & {
    cancel: () => any;
};
export declare function delayCancellable(seconds: number): Promise<void> & {
    cancel: () => any;
};
/**
 * Repeat a call to an asynchronous function endlessly, with specified time interval between calls.
 *
 * This is close to analogous to `setInterval()`, with the main difference being,
 * that the custom function will be awaited before starting the countdown till the next call.
 *
 * For example, if you provide a function with exectution time around 500 milliseconds,
 * and specify an interval of 3 seconds, the function will be called roughly every ~3.5 seconds.
 *
 * This ensures, that multiple calls to this function will never overlap with each other,
 * even if the calls taking longer than the interval to resolve.
 *
 * Useful when you need to handle regular api requests or other communication methods in a loop.
 *
 * @param update The function to be called every {interval} seconds
 * @param interval
 * @returns A function. When called, the loop will be cancelled
 * and there will be no next call to the update() function.
 */
export declare function runLogicLoop(update: () => PromiseLike<any>, interval: number): () => boolean;
/**
 * @param promise primise to await
 * @param timeout in seconds
 */
export declare const orTimeout: <T>(promise: PromiseLike<T>, timeout?: number) => Promise<unknown>;
export declare type PossiblePromiseLike<T> = T | PromiseLike<T>;
export declare function resolveValueOrError<T>(value: PossiblePromiseLike<T>): Promise<Error | T>;
export declare function runSequentially(...promises: (() => PromiseLike<unknown>)[]): Promise<void>;
export declare function executeAndMeasureTime<T>(promise: Promise<T>): Promise<[T, number]>;
export declare function deferredPromise<T = void>(): {
    promise: Promise<T>;
    resolve(arg: T): void;
};
