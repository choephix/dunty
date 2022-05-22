import { GameConfigurationData } from "@game/data/GameConfigurationData";
import { WaxContractsGateway } from "@sdk-integration/contracts/WaxContractsGateway";
import { ContractName, RailroaderSimpleAssets } from "@sdk-integration/contracts";

type Services = {
  contracts: Readonly<WaxContractsGateway>;
  gameConfigData: GameConfigurationData;
};

export async function getUserSimpleAssetData(simpleAssetKey: string, { contracts, gameConfigData }: Services) {
  const simpleAssetData = gameConfigData.simpleAssetsStatsTable[simpleAssetKey];

  if (!simpleAssetData) {
    throw new Error(`Unknown simple asset key ${simpleAssetKey}`);
  }

  const simpleAssetId = simpleAssetData.id;

  const [row] = await contracts.tables.loadRows<RailroaderSimpleAssets>(
    "accounts",
    {
      scope: contracts.currentUserName,
      lower_bound: simpleAssetId,
      upper_bound: simpleAssetId,
      limit: 1,
    },
    ContractName.SimpleAssets
  );

  if (!row) {
    return 0;
  }

  const [balanceAmount] = row.balance.split(" ");

  return Number(balanceAmount);
}
