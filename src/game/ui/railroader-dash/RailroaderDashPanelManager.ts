import { PageObjectManager } from "@sdk-pixi/ui-helpers/PageObjectManager";
import { Container } from "@pixi/display";
import { EventBus } from "@sdk/core/EventBus";
import { ClaimCenterPanel } from "./panels/claim-center/ClaimCenterPanel";
import { GoldenRunsPanel } from "./panels/goldenRuns/GoldenRunsPanel";
import { InventoryPanel } from "./panels/inventory/InventoryPanel";
import { LeaderboardCenterPanel } from "./panels/leaderboard/LeaderboardPanel";
import { RailroaderDashPanelType } from "./panels/models";
import { SettingsCenterPanel } from "./panels/settings/SettingsPanel";
import { StakingCenterPanel } from "./panels/staking/StakingPanel";
import { StoryCentralPanel } from "./panels/story/StoryCentralPanel";
import { RailroaderDashComponentFactory } from "./RailroaderDashComponentFactory";

// 0: () => new SettingsCenterPanel(this.context, this.eventManager, this),
// 1: () => new LeaderboardCenterPanel(this.context, this.eventManager, this),
// 2: () => new ClaimCenterPanel(this.context, this.eventManager, this),
// 3: () => new StakingCenterPanel(this.context, this.eventManager, this),
// 4: () => console.log("TODO: Tab 4"),
// 5: () => console.log("TODO: Tab 5"),
// 6: () => console.log("TODO: Tab 6"),
// 7: () => console.log("TODO: Tab 7"),
// 8: () => new GoldenRunsPanel(this.context, this.eventManager, this),

export class RailroaderDashPanelManager {
  // public readonly eventManager!: EventBus;
  // public readonly componentFactory!: RailroaderDashComponentFactory;

  constructor(
    public readonly eventManager: EventBus,
    public readonly componentFactory: RailroaderDashComponentFactory,
    private readonly pageContainer: Container
  ) {}

  private readonly pageManager = new PageObjectManager(
    {
      [RailroaderDashPanelType.Settings]: () => new SettingsCenterPanel(this.componentFactory),

      [RailroaderDashPanelType.Leaderboards]: () => new LeaderboardCenterPanel(this.componentFactory),

      [RailroaderDashPanelType.ClaimCenter]: () => new ClaimCenterPanel(this.componentFactory),

      [RailroaderDashPanelType.Staking]: () => new StakingCenterPanel(this.componentFactory),

      [RailroaderDashPanelType.Events]: () => null,

      [RailroaderDashPanelType.Story]: () => new StoryCentralPanel(this.componentFactory),

      [RailroaderDashPanelType.Achievements]: () => null,

      [RailroaderDashPanelType.Inventory]: () => new InventoryPanel(this.componentFactory),

      [RailroaderDashPanelType.GoldenRuns]: () => new GoldenRunsPanel(this.componentFactory),
    },
    this.pageContainer
  );
}
