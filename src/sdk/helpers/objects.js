/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
    return item != null && typeof item === "object" && !Array.isArray(item);
}
export function isIterable(obj) {
    return obj != null && typeof obj[Symbol.iterator] === "function";
}
/**
 * Deep merge two objects, and return the resulting copy
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
    if (!sources.length) {
        throw new Error(`No sources for mergeDeep()`);
    }
    if (!isObject(target)) {
        throw new Error(`Target is not an object\n` + target);
    }
    return [target, ...sources].reduce((a, c) => {
        if (c !== undefined && c !== null) {
            for (const key in c) {
                if (c[key] !== undefined) {
                    if (isObject(c[key])) {
                        a[key] = mergeDeep(isObject(a[key]) ? a[key] : {}, c[key]);
                    }
                    else {
                        a[key] = c[key];
                    }
                }
            }
        }
        return a;
    }, {});
}
export function shallowEquals(a, b) {
    for (const key of [...Object.keys(a), ...Object.keys(b)]) {
        if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}
export function deepEquals(a, b) {
    return JSON.stringify(a) == JSON.stringify(b);
}
export function deepCopy(a) {
    return JSON.parse(JSON.stringify(a));
}
export function omit(obj, ...keys) {
    return keys.reduce((result, key) => {
        delete result[key];
        return result;
    }, { ...obj });
}
export function pick(obj, ...keys) {
    return keys.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
}
export function deleteAllObjectProperties(obj) {
    const keys = Object.keys(obj);
    for (const key of keys) {
        delete obj[key];
    }
    return obj;
}
export function deleteUndefinedObjectProperties(obj) {
    const keys = Object.keys(obj);
    for (const key of keys) {
        if (obj[key] === undefined) {
            delete obj[key];
        }
    }
    return obj;
}
export function map(obj, fn) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        result[key] = fn(key, value, obj);
    }
    return result;
}
export function* iterateObjectProperties(obj) {
    for (const [index, [key, value]] of Object.entries(obj).entries()) {
        yield [key, value, index];
    }
}
//# sourceMappingURL=objects.js.map