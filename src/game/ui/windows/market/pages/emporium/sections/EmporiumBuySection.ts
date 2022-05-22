import { GameSingletons } from "@game/app/GameSingletons";
import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { SafeScrollbox } from "@sdk-pixi/display/SafeScrollbox";
import { ListingPlate } from "../components/ListingPlate";
import { EmporiumStoreItemData } from "../data/EmporiumStoreItemData.model";
import { EmporiumDataService } from "../EmporiumDataService";

export class EmporiumBuySection extends SafeScrollbox {
  public readonly dataFilters = {
    itemType: null as null | "amp" | "part",
    order: "newest" as "amount" | "price" | "newest",
  };

  private readonly dataService: EmporiumDataService = new EmporiumDataService();

  constructor() {
    super({
      noTicker: true,
      boxWidth: 1950,
      boxHeight: 735,
      stopPropagation: true,
      divWheel: GameSingletons.getGameContext().app.view,
      overflowX: "none",
    });
    this.position.set(200, 355);
    this.loadAndInit();
  }

  async reloadList() {
    this.clear();
    this.loadAndInit();
  }

  async loadAndInit() {
    const data: Array<EmporiumStoreItemData> = await this.dataService.getPurchasableItems(this.dataFilters.itemType);

    const compareFuncs = {
      amount: (a: EmporiumStoreItemData, b: EmporiumStoreItemData) => b.amount - a.amount,
      price: (a: EmporiumStoreItemData, b: EmporiumStoreItemData) => a.price - b.price,
      newest: (a: EmporiumStoreItemData, b: EmporiumStoreItemData) => b.timeCreated - a.timeCreated,
    };

    const compareFunc = compareFuncs[this.dataFilters.order];

    data.sort(compareFunc);

    this.init(data);
  }

  async init(data: Array<EmporiumStoreItemData>) {
    let x: number = 50;
    let y: number = 25;
    for (const [index, itemData] of data.entries()) {
      const purchase = async () => {
        await this.dataService.performPurchase(itemData);
        this.reloadList();
      };

      const itemPanel = ListingPlate.createPurchaseableItem(itemData, purchase);
      itemPanel.position.set(x, y);
      this.content.addChild(itemPanel);

      x += 500;
      if (index % 4 == 0 && index !== 0) {
        y += 500;
        x = 50;
      }
    }

    this.content.addChild(this.addInvisibleBox(736));
    this.update();
  }

  addInvisibleBox(px: number) {
    const box = new Sprite(Texture.EMPTY);
    box.width = this.boxWidth + 1;
    box.height = px;
    return box;
  }

  clear() {
    const children = [...this.content.children];
    for (const child of children) {
      child.destroy({ children: true });
    }
    this.content.addChild(this.addInvisibleBox(426));
  }
}
