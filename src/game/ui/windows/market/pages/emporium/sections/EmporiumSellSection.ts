import { Container } from "@pixi/display";
import { PageObjectManager } from "@sdk-pixi/ui-helpers/PageObjectManager";
import { EmporiumStoreItemData } from "../data/EmporiumStoreItemData.model";
import { EmporiumToolbar } from "../toolbar/EmporiumToolbar";
import { EmporiumSellAMPSubsection } from "./EmporiumSellAMPSubsection";
import { SellPartsSubsection } from "./EmporiumSellPartsSubsection";

export enum EmporiumSellSubsection {
  CenturyVials = "centuryVials",
  CenturyTrainParts = "centuryTrainParts",
}

let lastSubsection: EmporiumSellSubsection = EmporiumSellSubsection.CenturyVials;

export class EmporiumSellSection extends Container {
  public onItemSell?: (item: EmporiumStoreItemData) => void = () => {};

  public readonly subsectionManager = new PageObjectManager(
    {
      [EmporiumSellSubsection.CenturyVials]: () => {
        const subsection = new EmporiumSellAMPSubsection();
        subsection.onItemSell = item => this.onItemSell?.(item);
        return subsection;
      },
      [EmporiumSellSubsection.CenturyTrainParts]: () => {
        const subsection = new SellPartsSubsection();
        subsection.onItemSell = item => this.onItemSell?.(item);
        return subsection;
      },
    },
    this
  );

  public toolbar = new EmporiumToolbar("sell");

  constructor() {
    super();

    //// TODO: Decouple these button references here
    const currentFilterButton =
      lastSubsection === EmporiumSellSubsection.CenturyVials
        ? "amp"
        : lastSubsection === EmporiumSellSubsection.CenturyTrainParts
        ? "part"
        : "all";
    if (currentFilterButton) this.toolbar.itemTypeFilterTabs?.manager.setSelectedValue(currentFilterButton);

    this.toolbar.onItemTypeFilterSelected = itemType => {
      const key = itemType === "amp" ? EmporiumSellSubsection.CenturyVials : EmporiumSellSubsection.CenturyTrainParts;
      this.subsectionManager.setCurrentPage(key);
    };
    this.addChild(this.toolbar);

    this.subsectionManager.setCurrentPage(lastSubsection);
    this.subsectionManager.events.on({ beforeChange: pageKey => (lastSubsection = pageKey || lastSubsection) });
  }
}
