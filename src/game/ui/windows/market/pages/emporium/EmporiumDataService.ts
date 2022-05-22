import { GameSingletons } from "@game/app/GameSingletons";
import { ContractName } from "@sdk-integration/contracts";
import { CenturyTrainPartsDataService } from "../ct-parts/CTPartsDataService";
import {
  EmporiumDataServiceTableService,
  EmporiumListingsTableIndexPosition,
} from "./data/EmporiumDataServiceTableService";
import { EmporiumStoreItemData, EmporiumStoreItemData_CTPart } from "./data/EmporiumStoreItemData.model";

export class EmporiumDataService {
  private readonly table = new EmporiumDataServiceTableService();

  async getPurchasableItems(itemType: null | "amp" | "part"): Promise<EmporiumStoreItemData[]> {
    const { contracts } = GameSingletons.getIntergrationServices();
    const args: [EmporiumListingsTableIndexPosition?, string?] =
      itemType == null ? [] : [EmporiumListingsTableIndexPosition.ItemType, itemType];
    let results = await this.table.getListings(...args);
    results = results.filter(item => item.railroader !== contracts.currentUserName);
    results.sort((a, b) => a.price - b.price);
    return results;
  }

  async getMyListedItems(): Promise<EmporiumStoreItemData[]> {
    const { contracts } = GameSingletons.getIntergrationServices();
    return await this.table.getListings(EmporiumListingsTableIndexPosition.Seller, contracts.currentUserName);
  }

  async getMyInventoryParts(): Promise<EmporiumStoreItemData_CTPart[]> {
    const { contracts } = GameSingletons.getIntergrationServices();
    const dataService = new CenturyTrainPartsDataService();
    const parts = await dataService.getMyOwnedPartsList();
    return parts.map(part => {
      return {
        type: "part",
        id: -1,
        name: part.part,
        railroader: contracts.currentUserName,
        ctPartData: part,
        price: -1,
        inventoryCount: part.inventoryCount,
        timeCreated: -1,
        amount: 1,
      };
    });
  }

  async createListing(data: EmporiumStoreItemData) {
    const { contracts, userDataCtrl } = GameSingletons.getGameContext();

    const priceAssetString = `${data.price.toFixed(4)} TOCIUM`;
    const itemAssetString =
      data.type === "amp" ? `${data.centuryVialData.ampAmount} AMP` : `1 ${data.ctPartData.tokenSymbol}`;
    await contracts.actions.performActionTransactions([
      [
        "addlisting",
        { railroader: contracts.currentUserName, item: itemAssetString, price: priceAssetString },
        ContractName.M,
      ],
    ]);
    await userDataCtrl.updateAll();
  }

  async modifyListing(data: EmporiumStoreItemData) {
    const { contracts, userDataCtrl } = GameSingletons.getGameContext();

    const priceAssetString = `${data.price.toFixed(4)} TOCIUM`;
    await contracts.actions.performActionTransactions([
      [
        "modlisting",
        { railroader: contracts.currentUserName, listing_id: data.id, price: priceAssetString },
        ContractName.M,
      ],
    ]);
    await userDataCtrl.updateAll();
  }

  async cancelListing(data: EmporiumStoreItemData) {
    const { contracts, userDataCtrl } = GameSingletons.getGameContext();
    await contracts.actions.performActionTransactions([
      ["rmvlisting", { railroader: contracts.currentUserName, listing_id: data.id }, ContractName.M],
    ]);
    await userDataCtrl.updateAll();
  }

  async performPurchase(data: EmporiumStoreItemData) {
    const { contracts, userDataCtrl } = GameSingletons.getGameContext();

    const priceAssetString = `${data.price.toFixed(4)} TOCIUM`;
    await contracts.actions.performActionTransactions([
      [
        "transfer",
        {
          from: contracts.currentUserName,
          to: ContractName.M,
          quantity: priceAssetString,
          memo: `EMPORIUM|${data.id}`,
        },
        ContractName.Toc,
      ],
    ]);
    await userDataCtrl.updateAll();
  }

  async getLowestListingPrice(thing: EmporiumStoreItemData) {
    const itemString = thing.type === "amp" ? `AMP` : `${thing.ctPartData.tokenSymbol}`;
    let items = await this.table.getListings(EmporiumListingsTableIndexPosition.ItemAmountAndSymbol, itemString);
    if (thing.type === "amp") {
      items = items.filter(
        item => item.type === "amp" && item.centuryVialData.ampAmount === thing.centuryVialData.ampAmount
      );
    }
    items.sort((a, b) => a.price - b.price);
    console.log(items);

    return items[0]?.price || 1000;
  }
}
