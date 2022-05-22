import { GameSingletons } from "@game/app/GameSingletons";
import { CardEntity } from "@game/data/entities/CardEntity";
import { CardTemplate } from "@game/data/entities/CardTemplate";
import { MarketPriceConstituent } from "@game/data/entities/PriceConstituent";
import * as WAX from "@sdk-integration/contracts";
import { withoutDuplicates } from "@sdk/helpers/arrays";

type CompositionUpgradeInfo = {
  priceConstituents: MarketPriceConstituent[];
  // priceAmount: number;
  // priceCurrency: WAX.MarketCurrencyTicker;
  // pricaFullString: WAX.MonetaryAmountString;
  inputTemplate: CardTemplate<WAX.CardAssetData_Locomotive>;
  outputTemplate: CardTemplate<WAX.CardAssetData_Locomotive>;
};

export async function createCompositionUpgradesService() {
  const { contracts } = GameSingletons.getGameContext();

  const contractTableData = await contracts.market.getCompositionUpgradesInfo();
  const inputTemplateIds = contractTableData.map(o => o.inputs[0]);
  const outputTemplateIds = contractTableData.map(o => o.target);

  const allTemplateIds = withoutDuplicates([...inputTemplateIds, ...outputTemplateIds]);
  const templatesData = await contracts.assets.getAssetTemplatesData<WAX.CardAssetData_Locomotive>(allTemplateIds);

  const inputsToInfoMap = new Map<number, CompositionUpgradeInfo>();
  for (const info of contractTableData) {
    const [input] = info.inputs;
    inputsToInfoMap.set(+input, {
      priceConstituents: info.costs.map(MarketPriceConstituent.fromString),
      // priceAmount: +priceAmount,
      // priceCurrency: priceCurrency as WAX.MarketCurrencyTicker,
      // pricaFullString: pricaFullString,
      inputTemplate: templatesData.find(o => +o.asset_template_id === +input)!,
      outputTemplate: templatesData.find(o => +o.asset_template_id === +info.target)!,
    });
  }

  const service = {
    contractTableData,
    inputTemplateIds,
    outputTemplateIds,
    templatesData,
    inputsToInfoMap,

    getUpgradeInfo: (cardTemplateId: CardEntity.TemplateId) => {
      return inputsToInfoMap.get(+cardTemplateId) || null;
    },

    performUpgrade: async (card: CardEntity) => {
      const upgradeInfo = service.getUpgradeInfo(card.templateId);
      if (!upgradeInfo) {
        return console.error("No upgrade info found for card", card);
      }

      const targetTemplateId: WAX.AssetTemplateId = upgradeInfo.outputTemplate.asset_template_id;
      const cost = upgradeInfo.priceConstituents.find(o => o.currency === "TOCIUM");
      if (!cost) {
        throw new Error(`No cost found for upgrade.\n${JSON.stringify(upgradeInfo.priceConstituents)}`);
      }

      await contracts.actions.performActionTransactions([
        [
          WAX.ActionName.Transfer,
          {
            from: contracts.currentUserName,
            to: WAX.ContractName.M,
            quantity: cost.fullString,
            memo: "DEPOSIT|" + contracts.currentUserName,
          },
          WAX.ContractName.Toc,
        ],
        [
          WAX.ActionName.Transfer,
          {
            from: contracts.currentUserName,
            to: WAX.ContractName.M,
            asset_ids: [+card.assetId],
            memo: targetTemplateId,
          },
          WAX.ContractName.AtomicAssets,
        ],
      ]);
    },
  };

  return service;
}

export type CompositionUpgradesService = Awaited<ReturnType<typeof createCompositionUpgradesService>>;
