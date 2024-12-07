export declare class Color {
    static readonly BLACK: Readonly<Color>;
    static readonly WHITE: Readonly<Color>;
    static readonly RED: Readonly<Color>;
    static readonly GREEN: Readonly<Color>;
    static readonly BLUE: Readonly<Color>;
    static readonly YELLOW: Readonly<Color>;
    static readonly CYAN: Readonly<Color>;
    static readonly MAGENTA: Readonly<Color>;
    r: number;
    g: number;
    b: number;
    constructor(int?: number);
    toHex(): string;
    setFromInteger(value: number): void;
    copyFrom(other: Color): void;
    toInteger(): number;
    toRgbString(): string;
    toRgbArrayNormalized(): [number, number, number];
    static frozen(...rest: ConstructorParameters<typeof Color>): Readonly<Color>;
    static readonly lerp: typeof lerpColor;
}
/**
 * A linear interpolator for hexadecimal colors
 *
 * @param {Number} a
 * @param {Number} b
 * @param {Number} amount
 *
 * @example
 * lerpColor(0x000000', 0xffffff, 0.5)
 * // returns 0x7F7F7F
 *
 * @returns {Number}
 */
export declare function lerpColor(a: number | Color, b: number | Color, amount: number): Color;
