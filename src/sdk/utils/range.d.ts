export declare function range(count: number): number[];
export declare module range {
    function onlyNulls(count: number): any[];
    function fromTo<T extends number>(min: T, max: T): T[];
    function fromToIncluding(min: number, max: number): number[];
    function iterator(start: number, end?: number, step?: number): {
        [Symbol.iterator](): any;
        next(): {
            done: boolean;
            value: number;
        };
    };
}
