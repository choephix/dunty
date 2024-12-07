import { makeImitateService } from "@sdk/pixi/enchant/services/imitate";
import { makeWaitUntilService } from "@sdk/pixi/enchant/services/waitUntil";
import { makeWatchService } from "@sdk/pixi/enchant/services/watch";
export function createEnchantedFrameLoop(target) {
    const callbacks = [];
    let callbacksLen = 0;
    const $this = this ?? target;
    const observableFunction = (...args) => {
        if (!result.enabled)
            return;
        if (!callbacksLen)
            return;
        const _cbs = [...callbacks];
        for (let i = 0; i < callbacksLen; i++) {
            _cbs[i].apply($this, args);
        }
    };
    function add(...cbs) {
        callbacksLen = callbacks.push(...cbs);
        return () => {
            remove(...cbs);
        };
    }
    function remove(...cbs) {
        if (callbacksLen) {
            for (const cb of cbs) {
                const i = callbacks.indexOf(cb);
                if (i !== -1) {
                    callbacks.splice(i, 1);
                    callbacksLen--;
                }
            }
        }
    }
    function clear() {
        callbacks.length = callbacksLen = 0;
    }
    const makeShiftTicker = { add, remove };
    const result = Object.assign(observableFunction, {
        enabled: true,
        callbacks,
        add,
        remove,
        clear,
        watch: makeWatchService(makeShiftTicker),
        waitUntil: makeWaitUntilService(makeShiftTicker),
        imitate: makeImitateService(makeShiftTicker),
    });
    return result;
}
(function (createEnchantedFrameLoop) {
    function andAssignTo(target) {
        return Object.assign(target, { onEnterFrame: createEnchantedFrameLoop(target) });
    }
    createEnchantedFrameLoop.andAssignTo = andAssignTo;
})(createEnchantedFrameLoop || (createEnchantedFrameLoop = {}));
//# sourceMappingURL=createEnchangedFrameLoop.js.map