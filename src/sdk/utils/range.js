export function range(count) {
    if (count <= 0)
        return [];
    return new Array(count).fill(0).map((_, i) => i);
}
(function (range) {
    function onlyNulls(count) {
        if (count <= 0)
            return [];
        return new Array(count).fill(null);
    }
    range.onlyNulls = onlyNulls;
    function fromTo(min, max) {
        if (max <= min)
            return [];
        return new Array(~~(max - min)).fill(null).map((_, i) => (~~min + i));
    }
    range.fromTo = fromTo;
    function fromToIncluding(min, max) {
        if (max < min)
            return [];
        return new Array(~~(max - min + 1)).fill(null).map((_, i) => ~~min + i);
    }
    range.fromToIncluding = fromToIncluding;
    function iterator(start, end = NaN, step = 1) {
        if (isNaN(end)) {
            end = start;
            start = 0;
        }
        return {
            [Symbol.iterator]() {
                return this;
            },
            next() {
                if (start >= end)
                    return { done: true, value: end };
                const value = start;
                start += step;
                return { value, done: false };
            },
        };
    }
    range.iterator = iterator;
})(range || (range = {}));
//# sourceMappingURL=range.js.map