import { __DEBUG__ } from "@debug/__DEBUG__";
import { GameSingletons } from "@game/app/GameSingletons";
import * as WAX from "@sdk-integration/contracts";
import { CenturyTrainPartEntity } from "./data/CenturyTrainPartEntity";
import type { CenturyTrainPartData, CenturyTrainPartTokenSymbol } from "./data/models";

const USE_MOCK_DATA = __DEBUG__ && false;

export class CenturyTrainPartsDataService {
  private readonly context = GameSingletons.getGameContext();
  private readonly tables = this.context.contracts.tables;

  private async getSimpleAssetsBalancesMap() {
    const balancesMap = new Map<CenturyTrainPartTokenSymbol, number>();

    const cfg = this.context.gameConfigData;
    const simpleAssetStats = cfg.simpleAssetsStatsTable;
    let minSimpleAssetId = null;
    let maxSimpleAssetId = null;
    const tokensOfInterest = Object.keys(cfg.ctPartsData);
    for (const [key, stats] of Object.entries(simpleAssetStats)) {
      if (!tokensOfInterest.includes(key)) continue;

      const id = +stats.id;
      if (minSimpleAssetId == null || id < minSimpleAssetId) minSimpleAssetId = id;
      if (maxSimpleAssetId == null || id > maxSimpleAssetId) maxSimpleAssetId = id;
    }

    if (minSimpleAssetId !== null && maxSimpleAssetId !== null) {
      if (maxSimpleAssetId - minSimpleAssetId > 1000) {
        minSimpleAssetId = maxSimpleAssetId - 1000;
      }

      const accountRows = await this.tables.loadRows<{
        id: string;
        author: string;
        balance: `${number} ${CenturyTrainPartTokenSymbol}`;
      }>(
        "accounts",
        {
          scope: this.context.contracts.currentUserName,
          lower_bound: String(minSimpleAssetId),
          upper_bound: String(maxSimpleAssetId),
          limit: 1000,
        },
        WAX.ContractName.SimpleAssets
      );

      for (const row of accountRows) {
        const [amount, tokenSymbol] = row.balance.split(" ") as [
          amount: string,
          tokenSymbol: CenturyTrainPartTokenSymbol
        ];

        if (!tokensOfInterest.includes(tokenSymbol)) continue;

        balancesMap.set(tokenSymbol, +amount);
      }
    }

    return balancesMap;
  }

  async getMyDiscoveredPartsList(): Promise<CenturyTrainPartEntity[]> {
    const discountPercent = this.context.gameConfigData.marketItemDiscountPercent;
    const pricingMap = this.context.gameConfigData.marketItemPrices;

    const partRows = await this.tables.loadRows<{
      symbol: `${number},${CenturyTrainPartTokenSymbol}`;
      discount_time: number;
      century: WAX.CenturyName;
      purchasable: WAX.integer;
      discount_claimed: WAX.integer;
    }>(
      "parts",
      {
        scope: this.context.contracts.currentUserName,
        limit: 1000,
      },
      WAX.ContractName.M
    );

    const discoveredParts: CenturyTrainPartEntity[] = [];

    //// -- //// -- //// -- //// -- //// -- //// -- //// -- //// -- //// -- ////
    //// Fill in purchasable parts

    for (const row of partRows) {
      const [, tokenSymbol] = row.symbol.split(",") as [precision: string, tokenSymbol: CenturyTrainPartTokenSymbol];

      const partData = this.context.gameConfigData.getCenturyPartMarketData(tokenSymbol);
      if (partData == null) {
        console.warn(`Unknown part: ${tokenSymbol}`);
        continue;
      }

      const cost = pricingMap.get(tokenSymbol) ?? partData.cost;
      const expiryTime = new Date(row.discount_time * 1000);
      const purchasableCount = +row.purchasable;
      const discountClaimed: boolean = !!row.discount_claimed;

      if (purchasableCount > 0) {
        const entity = new CenturyTrainPartEntity(
          { ...partData, cost },
          { discountPercent, expiryTime, purchasableCount, discountClaimed }
        );
        discoveredParts.push(entity);
      }
    }

    //// -- //// -- //// -- //// -- //// -- //// -- //// -- //// -- //// -- ////
    //// Fill in owned parts

    const balancesMap = await this.getSimpleAssetsBalancesMap();
    for (const [tokenSymbol, amount] of balancesMap) {
      const inventoryCount = +amount;
      if (inventoryCount <= 0) continue;
      const partData = this.context.gameConfigData.getCenturyPartMarketData(tokenSymbol, { inventoryCount: +amount });
      if (partData == null) {
        console.warn(`Unknown part: ${tokenSymbol}`);
        continue;
      }
      discoveredParts.push(partData);
    }

    //// -- //// -- //// -- //// -- //// -- //// -- //// -- //// -- //// -- ////
    //// Sort results appropriately

    const calculatePartPriority = (part: CenturyTrainPartEntity) => {
      if (part.shouldDiscount()) return 10;
      if (part.inventoryCount > 0) return -10;
      return 0;
    };
    discoveredParts.sort((a, b) => calculatePartPriority(b) - calculatePartPriority(a));

    return discoveredParts;
  }

  async getMyOwnedPartsList(): Promise<CenturyTrainPartEntity[]> {
    const balancesMap = await this.getSimpleAssetsBalancesMap();

    const ownedParts: CenturyTrainPartEntity[] = [];
    for (const [tokenSymbol, amount] of balancesMap) {
      const inventoryCount = +amount;

      if (inventoryCount <= 0) continue;

      const partData = this.context.gameConfigData.getCenturyPartMarketData(tokenSymbol, { inventoryCount: +amount });
      if (partData == null) {
        console.warn(`Unknown part: ${tokenSymbol}`);
        continue;
      }

      ownedParts.push(partData);
    }

    return ownedParts;
  }

  async performPurchase(partData: CenturyTrainPartEntity) {
    const { contracts } = this.context;

    const costAmount = partData.getCostWithDiscountApplied();
    const costField = `${costAmount.toFixed(4)} TOCIUM`;

    await contracts.actions.performActionTransactions([
      [
        WAX.ActionName.Transfer,
        {
          from: contracts.currentUserName,
          to: WAX.ContractName.M,
          quantity: costField,
          memo: "DEPOSIT|" + contracts.currentUserName,
        },
        WAX.ContractName.Toc,
      ],
      [
        "buypart",
        {
          century: contracts.currentCenturyName,
          railroader: contracts.currentUserName,
          part: "0 " + partData.tokenSymbol,
        },
        WAX.ContractName.M,
      ],
    ]);

    if (partData.tokenSymbol === "BETABAR") {
      await this.redeemBetaBarrel();
    }
  }

  async redeemBetaBarrel() {
    const { contracts } = this.context;

    await contracts.actions.performActionTransactions([
      [
        "redeembarrel",
        {
          century: contracts.currentCenturyName,
          railroader: contracts.currentUserName,
        },
        WAX.ContractName.M,
      ],
    ]);
  }
}
