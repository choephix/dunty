import { JsonValue } from "type-fest";
/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export declare function isObject(item: any): boolean;
export declare function isIterable(obj: any): obj is unknown[];
/**
 * Deep merge two objects, and return the resulting copy
 * @param target
 * @param ...sources
 */
export declare function mergeDeep<T>(target: Partial<T>, ...sources: (Partial<T> | undefined | null)[]): T;
export declare function shallowEquals(a: any, b: any): boolean;
export declare function deepEquals(a: JsonValue, b: JsonValue): boolean;
export declare function deepCopy<T extends {} | any[]>(a: T): T;
export declare function omit<T>(obj: T, ...keys: (keyof T)[]): T;
export declare function pick<T>(obj: T, ...keys: (keyof T)[]): {};
export declare function deleteAllObjectProperties(obj: any): any;
export declare function deleteUndefinedObjectProperties<T extends {}>(obj: T): T;
export declare function map<T extends {}, R>(obj: T, fn: <K extends keyof T>(key: K, value: T[K], obj: T) => R): { readonly [K in keyof T]: R; };
export declare function iterateObjectProperties<T extends {}>(obj: T): Generator<readonly [keyof T, T[keyof T], number], void, unknown>;
