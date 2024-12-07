export function generate(count, generator) {
    return new Array(count).fill(0).map((_, i) => generator(i));
}
export function getRandomItemFrom(list, power) {
    if (power && !isNaN(power)) {
        return list[~~(Math.pow(Math.random(), power) * list.length)];
    }
    return list[~~(Math.random() * list.length)];
}
export function getSeveralRandomItemsFrom(originalList, count) {
    const list = [...originalList];
    const result = new Array();
    for (let i = 0; i < count; i++) {
        const index = ~~(Math.random() * originalList.length);
        result.push(originalList[index]);
        list.splice(index, 1);
    }
    return result;
}
//// Feturns a shuffled copy of the original array
export function shuffled(original) {
    return shuffle([...original]);
}
/** Shuffle an existing array */
export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
export function rotate(arr, count) {
    count -= arr.length * Math.floor(count / arr.length);
    arr.push.apply(arr, arr.splice(0, count));
    return arr;
}
export function withoutDuplicates(array) {
    return [...new Set(array)];
}
export function count(a, cb) {
    return a.reduce((a, c) => a + (cb(c) ? 1 : 0), 0);
}
export function groupBy(xs, keyProperty, keyItems = "items") {
    const map = xs.reduce(function (rv, x) {
        const g = (rv[x[keyProperty]] = rv[x[keyProperty]] || []);
        g.push(x);
        return rv;
    }, []);
    return Object.entries(map).map(([key, value]) => ({
        [keyProperty]: key,
        [keyItems]: value,
    }));
}
export function removeFalsies(array) {
    return array.filter(Boolean);
}
//# sourceMappingURL=arrays.js.map