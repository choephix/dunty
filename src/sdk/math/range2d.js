export function* range2D(X, Y) {
    for (let ix = 0; ix < X; ix++) {
        for (let iy = 0; iy < Y; iy++) {
            yield [ix, iy];
        }
    }
}
(function (range2D) {
    function* fromToIncluding(xFrom, yFrom, xTo, yTo) {
        for (let ix = xFrom; ix <= xTo; ix++) {
            for (let iy = yFrom; iy <= yTo; iy++) {
                yield [ix, iy];
            }
        }
    }
    range2D.fromToIncluding = fromToIncluding;
})(range2D || (range2D = {}));
//# sourceMappingURL=range2d.js.map