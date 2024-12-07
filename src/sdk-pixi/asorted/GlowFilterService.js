import { GlowFilter } from "@pixi/filter-glow";
export class GlowFilterService {
    constructor(options) {
        this.targets = new Set();
        this.filter = new GlowFilter({
            outerStrength: 2.6,
            distance: 12,
            color: 0x00ffff,
            ...options,
        });
    }
    addFilter(sprite) {
        this.targets.add(sprite);
        if (sprite.filters == null) {
            sprite.filters = [this.filter];
        }
        else {
            if (!sprite.filters.includes(this.filter)) {
                sprite.filters.push(this.filter);
            }
        }
    }
    removeFrom(sprite) {
        this.targets.delete(sprite);
        if (sprite.filters == null) {
            return;
        }
        const index = sprite.filters.indexOf(this.filter);
        if (index >= 0) {
            sprite.filters.splice(index, 1);
        }
    }
    clear() {
        for (const target of this.targets) {
            this.removeFrom(target);
        }
        this.targets.clear();
    }
}
export class FilterService {
    constructor(filter) {
        this.filter = filter;
        this.targets = new Set();
    }
    addFilter(sprite) {
        this.targets.add(sprite);
        if (sprite.filters == null) {
            sprite.filters = [this.filter];
        }
        else {
            if (!sprite.filters.includes(this.filter)) {
                sprite.filters.push(this.filter);
            }
        }
    }
    removeFrom(sprite) {
        this.targets.delete(sprite);
        if (sprite.filters == null) {
            return;
        }
        const index = sprite.filters.indexOf(this.filter);
        if (index >= 0) {
            sprite.filters.splice(index, 1);
        }
    }
    clear() {
        for (const target of this.targets) {
            this.removeFrom(target);
        }
        this.targets.clear();
    }
}
//# sourceMappingURL=GlowFilterService.js.map