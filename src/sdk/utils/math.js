export function lerp(from, to, frac) {
    return from + (to - from) * frac;
}
export function lerpClamped(from, to, frac) {
    if (frac < 0)
        return from;
    if (frac > 1)
        return to;
    return from + (to - from) * frac;
}
export function unlerp(from, to, value) {
    return (value - from) / (to - from) || 0.0;
}
export function unlerpClamped(from, to, value) {
    if (value < from)
        return 0;
    if (value > to)
        return 1;
    return (value - from) / (to - from) || 0.0;
}
export function clamp(value, min, max) {
    return value <= min ? min : value >= max ? max : value;
}
export function loop(value, min, max) {
    return min + loopFromZero(value, max - min);
}
export function loopFromZero(value, max) {
    value = (value % max);
    return value < 0 ? value + max : value;
}
export function yoyo(value, max) {
    const back = Math.floor(value / max) % 2 === 1;
    return back ? max - (value % max) : value % max;
}
export function sum(...values) {
    return values.reduce((a, c) => (a + c), 0);
}
export function signFrom(signSource, target = 1.0) {
    return signSource >= 0 === target >= 0 ? target : -target;
}
export function maxAbs(...values) {
    const _ = 0;
    return values.reduce((a, c) => (Math.abs(c) > Math.abs(a) ? c : a), _);
}
export function minAbs(...values) {
    const _ = Number.POSITIVE_INFINITY;
    return values.reduce((a, c) => (Math.abs(c) < Math.abs(a) ? c : a), _);
}
export function roundTo(value, step) {
    return Math.round(value / step) * step;
}
export function splitNumberByWeights(value, weights, total = sum(...weights)) {
    return weights.map(weight => (value * weight) / total);
}
//# sourceMappingURL=math.js.map