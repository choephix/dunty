export function makeWaitUntilService(ticker) {
    /**
     * @param condition primise will resolve the first time this returns true
     */
    function waitUntil(condition, onTruthy) {
        return new Promise(resolve => {
            const fn = function onWaitUntilEnterFrame() {
                const result = condition();
                if (!!result) {
                    onTruthy?.(result);
                    resolve(result);
                    cleanup();
                }
            };
            const cleanup = ticker.add(fn);
            fn();
        });
    }
    function orCancel(condition, onTruthy) {
        let cancel = null;
        new Promise(resolve => {
            cancel = ticker.add(function onWaitUntilEnterFrame() {
                const result = condition();
                if (!!result) {
                    resolve(result);
                    cancel();
                }
            });
        }).then(onTruthy);
        return cancel;
    }
    /**
     * @param condition primise will resolve the first time this returns true
     * @param timeout in seconds
     *
     * @return
     */
    function orTimeout(condition, timeout = 1.0) {
        return new Promise((resolve, reject) => {
            let error = null;
            setTimeout(() => (error = new Error(`Timed out`)), timeout * 1000);
            const cleanup = ticker.add(function onWaitUntilOrTimeoutEnterFrame() {
                try {
                    if (error)
                        throw error;
                    const result = condition();
                    if (!!result) {
                        resolve(result);
                        cleanup();
                    }
                }
                catch (error) {
                    reject(error);
                    cleanup();
                }
            });
        });
    }
    /**
     * @param condition primise will resolve the first time this returns a truthy value
     * Additionally, if it returns an error object, it will immediaely be thrown
     */
    function orThrowError(condition) {
        return new Promise((resolve, reject) => {
            const cleanup = ticker.add(function onWaitUntilOrThrowErrorEnterFrame() {
                const result = condition();
                if (!!result) {
                    if (result instanceof Error) {
                        // console.warn(`will throw error!!!!`)
                        reject(result);
                    }
                    else {
                        resolve(result);
                    }
                    cleanup();
                }
            });
        });
    }
    return Object.assign(waitUntil, {
        _ticker: ticker,
        orCancel: orCancel,
        orTimeout: orTimeout,
        orThrowError: orThrowError,
    });
}
//# sourceMappingURL=waitUntil.js.map