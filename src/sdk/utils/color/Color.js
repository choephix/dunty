export class Color {
    constructor(int = 0) {
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.r = (int >> 16) & 0xff;
        this.g = (int >> 8) & 0xff;
        this.b = int & 0xff;
    }
    toHex() {
        return ("#" +
            this.r.toString(16).padStart(2, "0") +
            this.g.toString(16).padStart(2, "0") +
            this.b.toString(16).padStart(2, "0"));
    }
    setFromInteger(value) {
        this.r = (value >> 16) & 0xff;
        this.g = (value >> 8) & 0xff;
        this.b = value & 0xff;
    }
    copyFrom(other) {
        this.r = other.r;
        this.g = other.g;
        this.b = other.b;
    }
    toInteger() {
        return (this.r << 16) + (this.g << 8) + this.b;
    }
    toRgbString() {
        return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    }
    toRgbArrayNormalized() {
        return [this.r / 255, this.g / 255, this.b / 255];
    }
    static frozen(...rest) {
        return Object.freeze(new Color(...rest));
    }
}
Color.BLACK = Object.freeze(new Color(0x000000));
Color.WHITE = Object.freeze(new Color(0x000000));
Color.RED = Object.freeze(new Color(0xff0000));
Color.GREEN = Object.freeze(new Color(0x00ff00));
Color.BLUE = Object.freeze(new Color(0x0000ff));
Color.YELLOW = Object.freeze(new Color(0xffff00));
Color.CYAN = Object.freeze(new Color(0x00ffff));
Color.MAGENTA = Object.freeze(new Color(0xff00ff));
Color.lerp = lerpColor;
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
export function lerpColor(a, b, amount) {
    if (typeof a === "number") {
        a = new Color(a);
    }
    if (typeof b === "number") {
        b = new Color(b);
    }
    const result = new Color();
    result.r = Math.round(a.r + amount * (b.r - a.r));
    result.g = Math.round(a.g + amount * (b.g - a.g));
    result.b = Math.round(a.b + amount * (b.b - a.b));
    return result;
}
//# sourceMappingURL=Color.js.map