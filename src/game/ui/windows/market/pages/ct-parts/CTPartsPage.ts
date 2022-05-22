import { PageObjectManager } from "@sdk-pixi/ui-helpers/PageObjectManager";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { Container } from "@pixi/display";
import { CTPartsFusionSubpage } from "./CTPartsFusionSubpage";
import { CTPartsOttoSubpage } from "./CTPartsOttoSubpage";

export enum CTPartsSubpageKey {
  DiscoveredParts = "discoveredParts",
  Fuse = "fuse",
  Forge = "forge",
}

export class CTPartsPage extends EnchantedContainer {
  public readonly titleString = "Century Train Parts";

  async loadAndInitialize(initialSubpage: CTPartsSubpageKey = CTPartsSubpageKey.DiscoveredParts) {
    const builderFunctions: Record<CTPartsSubpageKey, () => Container> = {
      [CTPartsSubpageKey.Fuse]: () => {
        const page = new CTPartsFusionSubpage();
        page.onSwitchShopkeeperClick = () => pageManager.setCurrentPage(CTPartsSubpageKey.DiscoveredParts);
        return page;
      },
      [CTPartsSubpageKey.DiscoveredParts]: () => {
        const page = new CTPartsOttoSubpage();
        page.onSwitchShopkeeperClick = () => pageManager.setCurrentPage(CTPartsSubpageKey.Fuse);
        return page;
      },
      [CTPartsSubpageKey.Forge]: () => new Container(),
    };

    const pageManager = new PageObjectManager(builderFunctions, this);

    pageManager.setCurrentPage(initialSubpage);
  }
}
