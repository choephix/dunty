import { StationEntity } from "@game/data/entities/StationEntity";
import { downloadDataAsCSV } from "@sdk/data/downloadDataAsCSV";

export function downloadChartDataAsCSV(
  station: StationEntity,
  shortDescription: string,
  data: { x: any; y: any }[],
  round: number = NaN
) {
  function processValue(v: any) {
    if (typeof v === "number") {
      if (isNaN(round)) {
        return v.toFixed(round);
      }
    }

    if (v instanceof Date) {
      return v.toISOString();
    }

    return "" + v;
  }

  return downloadDataAsCSV({
    filename: `${station.assetId}_station_${shortDescription}.csv`,
    rows: data.map(d => [processValue(d.x), processValue(d.y)]),
  });
}
