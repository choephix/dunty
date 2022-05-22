import { GameContext } from "@game/app/app";
import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { SafeScrollbox } from "@sdk-pixi/display/SafeScrollbox";
import { EmporiumDataService } from "../EmporiumDataService";
import { ListingPlate } from "../components/ListingPlate";
import type { EmporiumStoreItemData } from "../data/EmporiumStoreItemData.model";
import { GameSingletons } from "@game/app/GameSingletons";
import { getRarityColors } from "@game/constants/RarityColors";

export class EmporiumMyListingSection extends SafeScrollbox {
  private readonly context: GameContext = GameSingletons.getGameContext();

  dataService: EmporiumDataService = new EmporiumDataService();
  onItemSelected?: (item: EmporiumStoreItemData) => void;

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

  async loadAndInit() {
    const data: Array<EmporiumStoreItemData> = await this.dataService.getMyListedItems();
    this.init(data);
  }

  async reloadList() {
    this.clear();
    const data = await this.dataService.getMyListedItems();
    this.init(data);
  }

  async init(data: Array<EmporiumStoreItemData>) {
    let x: number = 50;
    let y: number = 25;
    for (const [index, itemData] of data.entries()) {
      const modify = () => {
        if (!this.onItemSelected) return;
        this.onItemSelected(itemData);
      };

      const cancel = async () => {
        const choice = await this.context.modals.confirm({
          title: `Clear Listing`,
          content: `Are you sure you want to cancel this listing?`,
          acceptButtonText: "Yes, Cancel",
          cancelButtonText: "No, Keep It",
        });
        if (choice) {
          await this.dataService.cancelListing(itemData);
          await this.context.modals.alert({
            title: `Listing Cancelled`,
          });
          await this.reloadList();
        }
      };

      const itemPanel = ListingPlate.createMyListedItem(itemData, modify, cancel);
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
