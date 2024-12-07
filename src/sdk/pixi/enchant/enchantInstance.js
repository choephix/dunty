import { Enchantments } from "./Enchantments";
export function enchantInstance(target) {
    const $super = {
        updateTransform: target.updateTransform,
        render: target.render,
        destroy: target.destroy,
    };
    const enchantments = new Enchantments();
    const enchantedInstance = Object.assign(target, {
        __enchantedInstance__: true,
        enchantments,
        onEnterFrame: enchantments.onEnterFrame,
        destroy(...args) {
            enchantments.onEnterFrame.clear();
            enchantments.onDestroyCallbacks.popAndCallAll(enchantedInstance);
            $super.destroy.call(target, ...args);
        },
    });
    return enchantedInstance;
}
//# sourceMappingURL=enchantInstance.js.map