import { EnchantmentCallbacksList } from "./core/EnchantmentCallbacksList";
import { createObservableFunction } from "./core/ObservableFunction";
import { makeImitateService } from "./services/imitate";
import { makeWaitUntilService } from "./services/waitUntil";
import { makeWatchService } from "./services/watch";
function extractAddFunc(obj) {
    return obj.add.bind(obj);
}
export class Enchantments {
    constructor() {
        this.onDestroyCallbacks = new EnchantmentCallbacksList();
        this.onDestroy = extractAddFunc(this.onDestroyCallbacks);
        this.onEnterFrame = createObservableFunction();
        this.watch = makeWatchService(this.onEnterFrame); /// resolve on destroy
        this.waitUntil = makeWaitUntilService(this.onEnterFrame); /// resolve on destroy
        this.imitate = makeImitateService(this.onEnterFrame); /// resolve on destroy
    }
}
//# sourceMappingURL=Enchantments.js.map