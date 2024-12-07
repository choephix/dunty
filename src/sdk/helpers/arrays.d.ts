export declare function generate<T>(count: number, generator: (i: number) => T): T[];
export declare function getRandomItemFrom<T>(list: Readonly<T[]>, power?: number): T;
export declare function getSeveralRandomItemsFrom<T>(originalList: Readonly<T[]>, count: number): T[];
export declare function shuffled<T>(original: Readonly<T[]>): T[];
/** Shuffle an existing array */
export declare function shuffle<T>(array: T[]): T[];
export declare function rotate<T>(arr: T[], count: number): T[];
export declare function withoutDuplicates<T>(array: Readonly<T[]>): T[];
export declare function count<T>(a: Readonly<T[]>, cb: (o: T) => boolean): number;
export declare function groupBy<T extends {
    [key: string]: any;
}>(xs: Readonly<T[]>, keyProperty: keyof T, keyItems?: string): {
    [x: string]: any;
}[];
export declare function removeFalsies<T>(array: Readonly<T[]>): NonNullable<T>[];
