import { GameSingletons } from "@game/app/GameSingletons";
export function calculateCommodityRateHighlightLevel(rateMultiplierPercent: number) {
  const bestRateMultiplierPercent = GameSingletons.getGameContext().mapData.miscInfo.bestCommodityRateMultiplierEver;
  const highlightLevel = Math.pow(rateMultiplierPercent / bestRateMultiplierPercent, 1.6);
  return highlightLevel;
}
