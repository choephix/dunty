import { Container } from "@pixi/display";
import { PageObject, PageObjectAugmentations } from "../PageObjectSwitcher";

export function createPageObject<T>(augmentations: PageObjectAugmentations<T>): PageObject<T> {
  return Object.assign(new Container(), augmentations);
} 
