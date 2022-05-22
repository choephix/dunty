import { __DEBUG__ } from "@debug/__DEBUG__";
import { GameSingletons } from "@game/app/GameSingletons";

export function getRailroaderDashTabsConfiguration() {
  const { gameConfigData } = GameSingletons.getGameContext();
  const cfg = gameConfigData.features.railroaderDash.tabs;
  return {
    [1]: {
      name: "Settings",
      disabled: !cfg.settings,
      smallMenuTexture: "ui-railroader-dashboard/sidebar-buttons-collapsed/tab-1.png",
      largeMenuTexture: "ui-railroader-dashboard/sidebar-buttons-expanded/tab-1.png",
    },
    [2]: {
      name: "Leaderboards",
      disabled: !cfg.leaderboards,
      smallMenuTexture: "ui-railroader-dashboard/sidebar-buttons-collapsed/tab-2.png",
      largeMenuTexture: "ui-railroader-dashboard/sidebar-buttons-expanded/tab-2.png",
    },
    [3]: {
      name: "Claim Center",
      disabled: !cfg.claimCenter,
      smallMenuTexture: "ui-railroader-dashboard/sidebar-buttons-collapsed/tab-3.png",
      largeMenuTexture: "ui-railroader-dashboard/sidebar-buttons-expanded/tab-3.png",
    },
    [4]: {
      name: "Staking",
      disabled: !cfg.staking,
      smallMenuTexture: "ui-railroader-dashboard/sidebar-buttons-collapsed/tab-4.png",
      largeMenuTexture: "ui-railroader-dashboard/sidebar-buttons-expanded/tab-4.png",
    },
    [5]: {
      name: "Events",
      disabled: !cfg.events,
      smallMenuTexture: "ui-railroader-dashboard/sidebar-buttons-collapsed/tab-5.png",
      largeMenuTexture: "ui-railroader-dashboard/sidebar-buttons-expanded/tab-5.png",
    },
    [6]: {
      name: "Story",
      disabled: !cfg.story,
      smallMenuTexture: "ui-railroader-dashboard/sidebar-buttons-collapsed/tab-6.png",
      largeMenuTexture: "ui-railroader-dashboard/sidebar-buttons-expanded/tab-6.png",
    },
    [7]: {
      name: "Achievements",
      disabled: !cfg.achievements,
      smallMenuTexture: "ui-railroader-dashboard/sidebar-buttons-collapsed/tab-7.png",
      largeMenuTexture: "ui-railroader-dashboard/sidebar-buttons-expanded/tab-7.png",
    },
    [8]: {
      name: "Inventory",
      disabled: !cfg.inventory && !__DEBUG__,
      smallMenuTexture: "ui-railroader-dashboard/sidebar-buttons-collapsed/tab-8.png",
      largeMenuTexture: "ui-railroader-dashboard/sidebar-buttons-expanded/tab-8.png",
    },
    [9]: {
      name: "Golden Runs",
      disabled: !cfg.goldenRuns,
      smallMenuTexture: "ui-railroader-dashboard/sidebar-buttons-collapsed/tab-9.png",
      largeMenuTexture: "ui-railroader-dashboard/sidebar-buttons-expanded/tab-9.png",
    },
  };
}
