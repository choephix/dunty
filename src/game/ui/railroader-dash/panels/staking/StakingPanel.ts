import { PageObjectManager } from "@sdk-pixi/ui-helpers/PageObjectManager";
import { RailroaderDashPanelBase } from "../RailroaderDashPanelBase";
import { StakingSubTab } from "./StakingSubTab";

enum StakingSubTabKey {
  Staked = "staked",
  Requests = "requests",
}

export class StakingCenterPanel extends RailroaderDashPanelBase {
  urlPrefix = "ui-railroader-dashboard/page-golden-runs";
  init(): void {
    //// Logo image
    this.addTitleImage("ui-railroader-dashboard/page-staking/label-staking.png");

    //// Add list background
    this.addListPad();

    //// Navigation tabs
    this.addTabs(250, 225);

    const textureId = `ui-railroader-dashboard/page-staking/plaque.png`;
    const message =
      "Station Owners have complete control over their VIP spots.\nAny booted Locomotives will be returned to your wallet.";
    this.addGreenPlaque({ textureId, message }, 20);
  }

  addTabs(x: number, y: number) {
    //// //// //// //// //// //// //// //// ////
    //// Navigation Tabs
    //// //// //// //// //// //// //// //// ////

    const tabs = this.componentFactory.createNavigationTabs(
      [
        { id: StakingSubTabKey.Staked, label: `staked` },
        { id: StakingSubTabKey.Requests, label: `requests` },
      ],
      24,
      160,
      160
    );
    this.addChild(tabs);
    tabs.position.set(x, y);

    tabs.events.on({
      tabSelected: ({ id }) => {
        pageManager.setCurrentPage(id);
      },
    });

    //// //// //// //// //// //// //// //// ////
    //// Pages
    //// //// //// //// //// //// //// //// ////

    const pageManager = new PageObjectManager(
      {
        [StakingSubTabKey.Staked]: () => {
          const container = new StakingSubTab("staked");
          return container;
        },
        [StakingSubTabKey.Requests]: () => {
          const container = new StakingSubTab("requests");
          return container;
        },
      },
      this
    );

    tabs.setSelectedTabIndex(0);
  }
}
