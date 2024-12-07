export function createOnChangeProxy(onPropertyChange, target) {
    return new Proxy(target, {
        get(target, property) {
            const item = target[property];
            if (item && typeof item === "object")
                return createOnChangeProxy(onPropertyChange, item);
            return item;
        },
        set(target, property, newValue) {
            target[property] = newValue;
            if (newValue instanceof Object) {
                onPropertyChange.call(target, property, newValue, target);
            }
            return true;
        },
    });
}
//# sourceMappingURL=createOnChangeProxy.js.map