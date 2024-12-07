/**
 * @param fraction value between 0 and 1 (representing 0% and 100% respectively)
 */
export declare function chance(fraction: number): boolean;
/**
 * Excluding
 * @param max Excluding
 */
export declare const randomInt: (max: number) => number;
export declare const randomIntBetweenIncluding: (min: number, max: number, lean?: number) => number;
export declare const randomSigned: (max?: number) => number;
export declare const randomBetween: (min: number, max: number) => number;
