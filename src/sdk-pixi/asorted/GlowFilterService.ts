import { Container, Filter } from "pixi.js";
import { GlowFilter, GlowFilterOptions } from "pixi-filters";

export class GlowFilterService {
  public readonly filter;
  private readonly targets;

  constructor(options: Partial<GlowFilterOptions>) {
    this.targets = new Set<Container>();
    this.filter = new GlowFilter({
      outerStrength: 2.6,
      distance: 12,
      color: 0x00ffff,
      ...options,
    });
  }

  addFilter(sprite: Container) {
    this.targets.add(sprite);

    if (sprite.filters == null) {
      sprite.filters = [this.filter];
    } else {
      if (!sprite.filters.includes(this.filter)) {
        sprite.filters = [...sprite.filters, this.filter];
      }
    }
  }

  removeFrom(sprite: Container) {
    this.targets.delete(sprite);

    if (sprite.filters == null) {
      return;
    }

    sprite.filters = sprite.filters.filter(filter => filter !== this.filter);
  }

  clear() {
    for (const target of this.targets) {
      this.removeFrom(target);
    }
    this.targets.clear();
  }
}

export class FilterService<T extends Filter = GlowFilter> {
  private readonly targets = new Set<Container>();

  constructor(public readonly filter: T) {}

  addFilter(sprite: Container) {
    this.targets.add(sprite);

    if (sprite.filters == null) {
      sprite.filters = [this.filter];
    } else {
      if (!sprite.filters.includes(this.filter)) {
        sprite.filters = [...sprite.filters, this.filter];
      }
    }
  }

  removeFrom(sprite: Container) {
    this.targets.delete(sprite);

    if (sprite.filters == null) {
      return;
    }

    sprite.filters = sprite.filters.filter(filter => filter !== this.filter);
  }

  clear() {
    for (const target of this.targets) {
      this.removeFrom(target);
    }
    this.targets.clear();
  }
}
