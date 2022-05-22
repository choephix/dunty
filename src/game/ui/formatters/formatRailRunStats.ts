import { FontIcon } from "@game/constants/FontIcon";
import { formatToMaxDecimals } from "@sdk-ui/utils/formatToMaxDecimals";

import prettyMilliseconds from "pretty-ms";

interface PotentialRunStats {
  distance: number;
  fuelCost: number;
  duration: number;
}

function formatTimestamp(time: number) {
  try {
    return new Date(time * 1000).toISOString().substr(11, 8);
  } catch (e) {
    return "--:--:--";
  }
}

export function toPotentialRunStatsString(potentialRunStats: PotentialRunStats) {
  const { distance, fuelCost, duration } = formatPotentialRunStats(potentialRunStats);
  return `${FontIcon.Distance} Distance ${distance} ${FontIcon.Fuel} ${fuelCost} ${FontIcon.Duration} ${duration}`;
}

export function formatPotentialRunStats(potentialRunStats: PotentialRunStats) {
  const distFormatted = potentialRunStats.distance.toString();
  const fuelFormatted = formatToMaxDecimals(potentialRunStats.fuelCost, 2);
  const timeFormatted = formatTimestamp(potentialRunStats.duration);
  return {
    distance: distFormatted,
    fuelCost: fuelFormatted,
    duration: timeFormatted,
  };
}
