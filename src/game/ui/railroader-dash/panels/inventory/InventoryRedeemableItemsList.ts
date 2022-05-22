import { GameSingletons } from "@game/app/GameSingletons";
import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { AssetId } from "@sdk-integration/contracts";
import { SafeScrollbox } from "@sdk-pixi/display/SafeScrollbox";
import { InventoryDataService } from "./InventoryDataService";
import { InventoryRedeemableItemPlate } from "./InventoryRedeemableItemPlate";

export type inventoryCard = {
  name: string;
  textureId: string;
  assetId: AssetId;
};

export class InventoryRedeemableItemsList extends SafeScrollbox {
  constructor() {
    super({
      noTicker: true,
      boxWidth: 555,
      boxHeight: 425,
      stopPropagation: true,
      divWheel: GameSingletons.getGameContext().app.view,
      overflowX: "none",
    });
  }

  async initialize() {
    const { ticker, userDataCtrl, tooltips, modals } = GameSingletons.getGameContext();

    const dataService = new InventoryDataService();

    async function redeemItem(itemData: { assetId: AssetId; name: string; textureId: string }) {
      await dataService.redeemAsset(itemData.assetId);
      modals.alert({
        title: "Redeem Successful!",
        content: `Woohoo!\nYou just redeemed\n${itemData.name.toUpperCase()}!`,
      });
      await userDataCtrl.updateAll();
      await populateList();
    }

    const populateList = async () => {
      this.clearList();

      const items = dataService.getRedeemableAssets();

      let startX = 25;
      let startY = 25;
      for (const [index, itemData] of items.entries()) {
        const inventoryCard = new InventoryRedeemableItemPlate(itemData.textureId);
        inventoryCard.onClickRedeem = async () => redeemItem(itemData);
        inventoryCard.scale.set(0.4);
        inventoryCard.position.set(startX, startY);
        this.content.addChild(inventoryCard);

        tooltips.registerTarget(inventoryCard.cardSprite, itemData.name);

        this.update();

        await ticker.nextFrame();

        startX += 175;
        if ((index + 1) % 3 == 0) {
          startX = 25;
          startY += 275;
        }
      }

      this.content.addChild(this.addInvisibleBox(426));
      this.update();
    };

    populateList();
  }

  addInvisibleBox(px: number) {
    const box = new Sprite(Texture.EMPTY);
    box.width = this.boxWidth + 1;
    box.height = px;
    return box;
  }

  clearList() {
    const children = [...this.content.children];
    for (const child of children) {
      child.destroy({ children: true });
    }
  }
}
