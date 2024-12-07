export class MultipleCallbacks {
    constructor(...cbs) {
        this.cbsLen = 0;
        cbs?.length && this.push(...cbs);
        return Object.assign(this, this.callAll.bind(this));
    }
    add(...cbs) {
        this.push(...cbs);
        return () => {
            this.remove(...cbs);
        };
    }
    remove(...cbs) {
        if (this.cbs) {
            for (const cb of cbs) {
                const i = this.cbs.indexOf(cb);
                if (i !== -1) {
                    this.cbs.splice(i, 1);
                    this.cbsLen--;
                }
            }
        }
    }
    push(...cbs) {
        if (this.cbs === undefined) {
            this.cbs = [];
        }
        return (this.cbsLen = this.cbs.push(...cbs));
    }
    popAndCallAll($this, ...args) {
        if (this.cbs) {
            const cbs = [...this.cbs];
            const cbsLen = this.cbsLen;
            this.cbsLen = this.cbs.length = 0;
            for (let i = 0; i < cbsLen; i++) {
                cbs[i].apply($this, args);
            }
        }
    }
    callAll($this, ...args) {
        if (this.cbs) {
            const cbs = [...this.cbs];
            const cbsLen = this.cbsLen;
            for (let i = 0; i < cbsLen; i++) {
                cbs[i].apply($this, args);
            }
        }
    }
    clear() {
        if (this.cbs) {
            this.cbs.length = this.cbsLen = 0;
        }
    }
}
//# sourceMappingURL=MultipleCallbacks.js.map