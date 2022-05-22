import { GameSingletons } from "@game/app/GameSingletons";
import { StakingAddonType } from "@game/asorted/StakingType";
import { FontIcon } from "@game/constants/FontIcon";
import { CardEntity } from "@game/data/entities/CardEntity";
import { StakingAddonDataService } from "@game/data/staking/StakingAddonDataService";
import { AssetRarity, CardAssetId, CenturyName, ContractName, StationAssetId } from "@sdk-integration/contracts";

export class StakedAssetsDataService {
  private readonly railYardDataService = new StakingAddonDataService(StakingAddonType.RailYard);
  private readonly conductorLoungeDataService = new StakingAddonDataService(StakingAddonType.ConductorLounge);

  async getStakedAssets() {
    const { contracts, gameConfigData, mapData } = GameSingletons.getGameContext();

    const rows = await contracts.tables.loadRows<{
      asset_id: CardAssetId;
      station_asset_id: StationAssetId;
      schema: string;
      century: CenturyName;
    }>(
      "rrassets",
      {
        scope: contracts.currentUserName,
        limit: 1000,
      },
      ContractName.S
    );

    const promises = rows.map(async row => {
      const { asset_id: card_asset_id, station_asset_id, schema, century } = row;
      const dataService = schema === "locomotive" ? this.railYardDataService : this.conductorLoungeDataService;

      const station = mapData.stations.get(station_asset_id);
      if (!station) {
        throw new Error(`Station not found for asset_id: ${card_asset_id}`);
      }

      const cardEntity = await CardEntity.fromAssetId(card_asset_id);

      const addonType = schema === "locomotive" ? StakingAddonType.RailYard : StakingAddonType.ConductorLounge;

      return {
        addonType,

        cardId: card_asset_id,
        stationId: station_asset_id,

        card: cardEntity,
        station: station,

        cardSchema: schema,
        century,

        claimable: true,

        loadDetails: async () => {
          const allAssets = await dataService.getContractData_StakedAssetsInfo(station_asset_id);
          const asset = allAssets.find(a => a.asset_id === card_asset_id);
          if (!asset) {
            throw new Error(`Could not find asset ${card_asset_id} in ${station_asset_id}`);
          }
          const isVip = !asset.expire_time;
          const accumulatedTocium = NaN;

          const rarity = cardEntity.rarityString as AssetRarity;
          const hourlyRate = gameConfigData.getStakedAssetEaringnRateByRarity(addonType, rarity);
          return {
            isVip: isVip,
            startDate: new Date(asset.staked_time * 1000),
            endDate: isVip ? null : new Date(asset.expire_time * 1000),
            rate: hourlyRate ? `${FontIcon.Tocium}${hourlyRate} PER HOUR` : null,
            claimable: accumulatedTocium ? `${FontIcon.Tocium}${accumulatedTocium}` : null,
          };
        },
        unstake: async () => {
          return await dataService.unstakeCard(card_asset_id);
        },
        claimEarns: async () => {
          return await dataService.claimStakerTociumEarns(station_asset_id);
        },
      };
    });

    return Promise.all(promises);
  }
}

export type StakedAssetEntity = Awaited<ReturnType<StakedAssetsDataService["getStakedAssets"]>>[number];
