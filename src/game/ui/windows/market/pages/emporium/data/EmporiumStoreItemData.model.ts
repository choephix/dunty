import { Rarity } from "@game/constants/Rarity";
import { CenturyTrainPartData } from "../../ct-parts/data/models";

export type EmporiumStoreItemData = EmporiumStoreItemData_CenturyVial | EmporiumStoreItemData_CTPart;
export type EmporiumStoreItemData_CenturyVial = {
  type: "amp";
  id: number;
  name: string;
  railroader: string;
  price: number;
  centuryVialData: {
    level: 1 | 2 | 3 | 4 | 5;
    rarity: Rarity;
    ampAmount: number;
  };
  timeCreated: number;
  amount: number;
};
export type EmporiumStoreItemData_CTPart = {
  type: "part";
  id: number;
  name: string;
  railroader: string;
  price: number;
  ctPartData: CenturyTrainPartData;
  inventoryCount?: number;
  timeCreated: number;
  amount: number;
};

// export module EmporiumStoreItemData {
//   export function createCenturyVialListingData(
//     data: CenturyVialData | CenturyVialData["ampAmount"],
//     price: number,
//     listingId?: number,
//   ): EmporiumStoreItemData_CenturyVial {
//     if (typeof data === "number") {
//       data = createCenturyVialDataFromAMPAmount(data);
//     }

//     return {
//       type: "amp",
//       id: listingId,
//       name: `${data.ampAmount} AMP`,
//       railroader: row.seller,
//       price: price.amount,
//       centuryVialData: createCenturyVialDataFromAMPAmount(item.amount),
//     };
//   }
// }
