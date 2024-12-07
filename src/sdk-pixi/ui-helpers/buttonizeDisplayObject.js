export function buttonizeDisplayObject(target, callbacks) {
    if (callbacks instanceof Function) {
        callbacks = { onTrigger: callbacks };
    }
    const { onTrigger } = callbacks;
    target.interactive = true;
    target.buttonMode = true;
    if (onTrigger) {
        callbacks.onTrigger = onTrigger.bind(target);
        target.on("click", onTrigger);
        target.on("tap", onTrigger);
    }
    /**
     * Clean up function to remove any events added by `buttonizeDisplayObject()`.
     */
    return function () {
        target.interactive = false;
        target.buttonMode = false;
        target.off("click", onTrigger);
        target.off("tap", onTrigger);
    };
}
//# sourceMappingURL=buttonizeDisplayObject.js.map