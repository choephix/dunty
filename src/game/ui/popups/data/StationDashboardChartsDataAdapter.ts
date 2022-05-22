import * as WAX from "@sdk-integration/contracts";

import { GameContext } from "@game/app/app";
import { BarChartDataItem } from "@game/ui/svg-charts/drawBarChartSVG";
import { LineChartItem } from "@game/ui/svg-charts/drawLineChartSVG";

import { HistoryDataController } from "@sdk-integration/historyapi/HistoryDataController";
import { GameSingletons } from "@game/app/GameSingletons";

export enum ChartsDataTimeframe {
  $24Hours = 24,
  $7Days = 7 * 24,
  $30Days = 30 * 24,
  $All = 0,
}

type StationRailRunsStats = Awaited<ReturnType<HistoryDataController["getStationRailRunsStats"]>>;

export class StationDashboardChartsDataAdapter {
  private readonly context = GameSingletons.getGameContext();
  readonly ctrl = this.context.historyDataCtrl;

  readonly #cache: Record<`${WAX.StationAssetId}-${ChartsDataTimeframe}`, StationRailRunsStats> = {};

  constructor() {}

  private async getStationRailRunsStats(station: WAX.StationAssetId, timeframe: ChartsDataTimeframe) {
    const key = `${station}-${timeframe}`;

    if (this.#cache[key] == undefined) {
      this.#cache[key] = await this.ctrl.getStationRailRunsStats(station, timeframe);
    }

    return this.#cache[key];
  }

  async getTociumCommissionsTotal(station: WAX.StationAssetId, timeframe: ChartsDataTimeframe): Promise<number> {
    const data = await this.getStationRailRunsStats(station, timeframe);
    return data.commissionsTotal;
  }

  async getVisitorsVisitsTotal(station: WAX.StationAssetId, timeframe: ChartsDataTimeframe): Promise<number> {
    const data = await this.getStationRailRunsStats(station, timeframe);
    return data.visitsTotal;
  }

  async getTociumTopVisitorCommissions(
    station: WAX.StationAssetId,
    timeframe: ChartsDataTimeframe
  ): Promise<BarChartDataItem[]> {
    const data = await this.getStationRailRunsStats(station, timeframe);
    const dataPoints = data.commissionsPerUser;

    const result = dataPoints.map(([railroader, commission]) => {
      return {
        y: railroader,
        x: commission,
      };
    });

    console.log({ getTociumTopVisitorCommissions: result });

    return result;
  }

  async getTociumStationEarningsTimeline(
    station: WAX.StationAssetId,
    timeframe: ChartsDataTimeframe
  ): Promise<LineChartItem[]> {
    const data = await this.getStationRailRunsStats(station, timeframe);
    const dataPoints = timeframe <= ChartsDataTimeframe.$24Hours ? data.commissionsPerHour : data.commissionsPerDay;

    const result = dataPoints.map(([time, commission]) => {
      return {
        x: time,
        y: commission,
      };
    });

    console.log({ getTociumStationEarningsTimeline: result });

    return result;
  }

  async getVisitorsTopVisitors(
    station: WAX.StationAssetId,
    timeframe: ChartsDataTimeframe
  ): Promise<BarChartDataItem[]> {
    const data = await this.getStationRailRunsStats(station, timeframe);
    const dataPoints = data.visitsPerUser;

    const result = dataPoints.map(([railroader, visits]) => {
      return {
        y: railroader,
        x: visits,
      };
    });

    console.log({ getVisitorsTopVisitors: result });

    return result;
  }

  async getVisitorsAllVisitsTimeline(
    station: WAX.StationAssetId,
    timeframe: ChartsDataTimeframe
  ): Promise<LineChartItem[]> {
    const data = await this.getStationRailRunsStats(station, timeframe);
    const dataPoints = timeframe <= ChartsDataTimeframe.$24Hours ? data.visitsPerHour : data.visitsPerDay;

    const result = dataPoints.map(([time, commission]) => {
      return {
        x: time,
        y: commission,
      };
    });

    console.log({ getVisitorsAllVisitsTimeline: result });

    return result;
  }

  // async getVisitorsUniqueVisitorsTimeline(
  //   station: WAX.StationAssetId,
  //   timeframe: ChartsDataTimeframe
  // ): Promise<LineChartItem[]> {
  //   const data = await this.getStationRailRunsStats(station, timeframe);
  //   const dataPoints = timeframe <= ChartsDataTimeframe.$24Hours ? data.visitsPerHour : data.visitsPerDay;

  //   const result = dataPoints.map(([time, commission]) => {
  //     return {
  //       x: time,
  //       y: commission,
  //     };
  //   });

  //   console.log({ getVisitorsUniqueVisitorsTimeline: result });

  //   return result;
  // }
}
