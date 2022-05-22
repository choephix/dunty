import { GameSingletons } from "@game/app/GameSingletons";
import { ContractName } from "@sdk-integration/contracts";
import { parsePriceString } from "@sdk-integration/contracts/utils/parsePriceString";
import { createCenturyVialDataFromAMPAmount } from "./createCenturyVialDataFromAMPAmount";
import { EmporiumStoreItemData } from "./EmporiumStoreItemData.model";

export enum EmporiumListingsTableIndexPosition {
  ItemAmountAndSymbol = 2,
  PriceAmountAndSymbol = 3,
  ItemType = 4,
  ItemRarity = 5,
  Seller = 6,
}

export class EmporiumDataServiceTableService {
  public async getListings(): Promise<EmporiumStoreItemData[]>;
  public async getListings(
    filterType?: EmporiumListingsTableIndexPosition,
    filterValue?: any
  ): Promise<EmporiumStoreItemData[]>;
  public async getListings(
    filterType?: EmporiumListingsTableIndexPosition,
    filterValue?: any,
    limit = 1000
  ): Promise<EmporiumStoreItemData[]> {
    const { contracts } = GameSingletons.getIntergrationServices();
    const { gameConfigData } = GameSingletons.getGameContext();

    const INDEX_KEY_TYPE = "i64";

    const rows = await contracts.tables.loadRows<{
      listing_id: number;
      item: `${number} ${string}`;
      price: `${number} ${string}`;
      type: string;
      rarity: string;
      listed_time: number;
      seller: string;
    }>(
      "listings",
      {
        scope: ContractName.M,
        index_position: filterType,
        lower_bound: filterValue,
        upper_bound: filterValue,
        key_type: INDEX_KEY_TYPE,
        limit: limit,
        show_payer: false,
      },
      ContractName.M
    );

    const results = new Array<EmporiumStoreItemData>();

    for (const row of rows) {
      const price = parsePriceString(row.price);
      const item = parsePriceString(row.item);
      if (row.type === "amp") {
        results.push({
          type: "amp",
          id: row.listing_id,
          name: row.item,
          railroader: row.seller,
          price: price.amount,
          centuryVialData: createCenturyVialDataFromAMPAmount(item.amount),
          timeCreated: row.listed_time,
          amount: item.amount,
        });
      } else if (row.type === "part") {
        results.push({
          type: "part",
          id: row.listing_id,
          name: row.item,
          railroader: row.seller,
          price: price.amount,
          ctPartData: gameConfigData.getCenturyPartMarketData(item.currency as any)!,
          timeCreated: row.listed_time,
          amount: item.amount,
        });
      } else {
        console.error("Unknown listing type:", row.type);
      }
    }

    return results;
  }
}
