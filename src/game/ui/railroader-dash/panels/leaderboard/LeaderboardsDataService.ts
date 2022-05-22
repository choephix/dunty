import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { StationAssetId } from "@sdk-integration/contracts";

export enum DataTimeframe {
  $24Hours = 24,
  $7Days = 7 * 24,
  $30Days = 30 * 24,
  $All = 0,
}

function getISOTimeFromHoursAgo(hoursAgo: number | undefined) {
  if (hoursAgo == undefined) {
    return undefined;
  }

  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
}

export class LeaderboardsDataService {
  private readonly context: GameContext = GameSingletons.getGameContext();

  readonly api = this.context.historyDataCtrl.api;

  readonly #cache = {
    railroaders: {} as Record<
      DataTimeframe,
      {
        name: string;
        total_transports: number;
        total_distance: number;
        total_reward: number;
        avg_reward: number;
        total_weight: number;
        avg_weight: number;
        total_coal: number;
        avg_coal: number;
        total_diesel: number;
        avg_diesel: number;
        visited_stations: { [station: string]: number };
      }[]
    >,
    stations: {} as Record<
      DataTimeframe,
      {
        station: string;
        owner: string;
        total_transports: number;
        total_comission: number;
        avg_comission: number;
        total_weight: number;
        avg_weight: number;
        visitors: { [key: string]: number };
      }[]
    >,
  };

  constructor() {}

  private async getRawRailRoadersData(timeframe: DataTimeframe, limit: number, compare: (a: any, b: any) => number) {
    let data = this.#cache.railroaders[timeframe];
    if (!data) {
      const after: string | undefined = getISOTimeFromHoursAgo(timeframe);
      data = this.#cache.railroaders[timeframe] = await this.api.getRailroaders({ after, limit: 200 });
    }

    data.sort(compare);

    return data.slice(0, limit);
  }

  private async getRawStationsData(timeframe: DataTimeframe, limit: number, compare: (a: any, b: any) => number) {
    let data = this.#cache.stations[timeframe];
    if (!data) {
      // const after: string | undefined = getISOTimeFromHoursAgo(timeframe);
      // data = this.#cache.stations[timeframe] = await this.api.getStations({ after, limit });
      data = this.#cache.stations[timeframe] = await this.api.getStations({ timeframe, limit: 200 });
    }

    data.sort(compare);

    return data.slice(0, limit);
  }

  async getRailRoadersByTociumEarnings(timeframe: DataTimeframe, limit: number) {
    console.log(`🌍 request: getRailRoadersByTociumEarnings `, { timeframe, limit });

    const data = await this.getRawRailRoadersData(timeframe, limit, (a, b) => b.total_reward - a.total_reward);

    return data.map((user, index) => {
      return {
        placement: index + 1,
        name: user.name,
        tocium: user.total_reward,
        socialLink: user.name,
      };
    });
  }

  async getRailRoadersByTotalRailruns(timeframe: DataTimeframe, limit: number) {
    console.log(`🌍 request: getRailRoadersByTotalRailruns`, { timeframe, limit });

    const data = await this.getRawRailRoadersData(timeframe, limit, (a, b) => b.total_transports - a.total_transports);

    return data.map((user, index) => {
      return {
        placement: index + 1,
        name: user.name,
        runs: user.total_transports,
        socialLink: user.name,
      };
    });
  }

  async getStationsByTociumEarnings(timeframe: DataTimeframe, limit: number) {
    console.log(`🌍 request: getStationsByTociumEarnings`, { timeframe, limit });

    const data = await this.getRawStationsData(timeframe, limit, (a, b) => b.total_comission - a.total_comission);

    return data.map((info, index) => {
      const stationId = String(info.station) as StationAssetId;
      const station = this.context.mapData.stations.get(stationId);
      return {
        placement: index + 1,
        id: stationId,
        name: station?.name ?? stationId,
        tocium: info.total_comission,
        socialLink: station?.ownerName ?? "",
      };
    });
  }

  async getStationsByTotalRailruns(timeframe: DataTimeframe, limit: number) {
    console.log(`🌍 request: getStationsByTotalRailruns`, { timeframe, limit });

    const data = await this.getRawStationsData(timeframe, limit, (a, b) => b.total_transports - a.total_transports);

    return data.map((info, index) => {
      const stationId = String(info.station) as StationAssetId;
      const station = this.context.mapData.stations.get(stationId);
      return {
        placement: index + 1,
        id: stationId,
        name: station?.name ?? stationId,
        runs: info.total_transports,
        socialLink: station?.ownerName ?? "",
      };
    });
  }
}
