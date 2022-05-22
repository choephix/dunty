import { RailroaderDashComponentFactory } from "../RailroaderDashComponentFactory";
import { ClaimCenterPanel } from "./claim-center/ClaimCenterPanel";
import { GoldenRunsPanel } from "./goldenRuns/GoldenRunsPanel";
import { InventoryPanel } from "./inventory/InventoryPanel";
import { LeaderboardCenterPanel } from "./leaderboard/LeaderboardPanel";
import { RailroaderDashPanel, RailroaderDashPanelType } from "./models";
import { SettingsCenterPanel } from "./settings/SettingsPanel";
import { StakingCenterPanel } from "./staking/StakingPanel";
import { StoryCentralPanel } from "./story/StoryCentralPanel";

export class RailroaderDashPanelFactory {
  private readonly componentFactory = new RailroaderDashComponentFactory();

  createFromType(panelType: RailroaderDashPanelType | null) {
    if (panelType == null) return null;

    // TODO: Build singletons and cache when built
    const panels = {
      1: () => new SettingsCenterPanel(this.componentFactory),
      2: () => new LeaderboardCenterPanel(this.componentFactory),
      3: () => new ClaimCenterPanel(this.componentFactory),
      4: () => new StakingCenterPanel(this.componentFactory),
      5: () => console.log("TODO: Tab 4"),
      6: () => new StoryCentralPanel(this.componentFactory),
      7: () => console.log("TODO: Tab 6"),
      8: () => new InventoryPanel(this.componentFactory),
      9: () => new GoldenRunsPanel(this.componentFactory),
    };

    const key = +panelType as keyof typeof panels;
    return (panels[key]?.() as RailroaderDashPanel) || null;
  }

  getFactory() {
    return this.componentFactory;
  }
}
