import { Filter } from "@pixi/core";
import { DisplayObject } from "@pixi/display";
import { GlowFilter, GlowFilterOptions } from "@pixi/filter-glow";
export declare class GlowFilterService {
    readonly filter: any;
    private readonly targets;
    constructor(options: Partial<GlowFilterOptions>);
    addFilter(sprite: DisplayObject): void;
    removeFrom(sprite: DisplayObject): void;
    clear(): void;
}
export declare class FilterService<T extends Filter = GlowFilter> {
    readonly filter: T;
    private readonly targets;
    constructor(filter: T);
    addFilter(sprite: DisplayObject): void;
    removeFrom(sprite: DisplayObject): void;
    clear(): void;
}
