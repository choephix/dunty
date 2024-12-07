export class CurrentSelectionHelper {
    constructor(callbacks) {
        this.callbacks = callbacks;
        this.current = null;
    }
    setCurrent(item) {
        if (this.current === item)
            return;
        if (this.current)
            this.callbacks.onDeselect(this.current);
        this.current = item;
        if (this.current)
            this.callbacks.onSelect(this.current);
    }
}
//# sourceMappingURL=CurrentSelectionHelper.js.map