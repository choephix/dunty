import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { digRewardAmmountFromTransactionResult } from "@game/asorted/digRewardAmmountFromTransactionResult";
import { formatCurrencyFromContractString } from "@game/asorted/formatCurrencyFromContractString";
import { PageObjectManager } from "@sdk-pixi/ui-helpers/PageObjectManager";
import { StakingAddonType } from "@game/asorted/StakingType";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { StationEntity } from "@game/data/entities/StationEntity";
import { StakingAddonStatusData } from "@game/data/staking/models";
import { getStakingAddonDataService } from "@game/data/staking/StakingAddonDataService";
import { NavigationTabs } from "@game/ui/windows/common/NavigationTabs";
import { Text } from "@pixi/text";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { makeCommonFontStyle } from "../../../util/makeCommonFontStyle";
import { StakingAddonManageCommissionsPage } from "../addon-subpages/StakingAddonManageCommissionsPage";
import {
  StakingAddonManageHomeButtonKey,
  StakingAddonManageHomePage,
} from "../addon-subpages/StakingAddonManageHomePage";
import { StakingAddonManageTierUpgradesPage } from "../addon-subpages/StakingAddonManageTierUpgradesPage";
import { StakingAddonManageVIPWhitelistPage } from "../addon-subpages/StakingAddonManageVIPWhitelistPage";
import { StakingAddonPublicListSubpage } from "../addon-subpages/StakingAddonPublicListSubpage";
import { StakingAddonVIPListSubpage } from "../addon-subpages/StakingAddonVIPListSubpage";
import { getStakingAddonDisplayProperties } from "../utils/getStakingAddonDisplayProperties";

enum StakingAddonSubpageKey {
  Manage_Home = "manage_Home",
  Manage_Commissions = "manage_Commissions",
  Manage_VIPWhitelist = "manage_VIPWhitelist",
  Manage_TierUpgrades = "manage_TierUpgrades",
  PublicStakedCardsList = "stakedCardsList_Public",
  VIPStakedCardsList = "stakedCardsList_VIP",
}

export class StakingAddonPage extends EnchantedContainer {
  private readonly context: GameContext = GameSingletons.getGameContext();

  public readonly addonDataService = getStakingAddonDataService(this.addonType);
  public addonData: StakingAddonStatusData | null = null;

  protected readonly tweeener = new TemporaryTweeener(this);
  protected readonly navigationTabs: NavigationTabs<{ pageKey: StakingAddonSubpageKey; label: string }>;
  protected readonly titleLabel: Text;
  protected readonly subtitleLabel: Text;

  private pageManager?: PageObjectManager;

  constructor(public readonly station: StationEntity, public readonly addonType: StakingAddonType) {
    super();

    this.navigationTabs = new NavigationTabs(
      [
        { pageKey: StakingAddonSubpageKey.Manage_Home, label: `Manage` },
        { pageKey: StakingAddonSubpageKey.PublicStakedCardsList, label: `Public` },
        { pageKey: StakingAddonSubpageKey.VIPStakedCardsList, label: `VIP` },
      ],
      { tabWidth: 200 }
    );
    this.navigationTabs.pivot.x = this.navigationTabs.width;
    this.navigationTabs.position.set(630, 60);
    this.navigationTabs.scale.set(0.35);
    this.addChild(this.navigationTabs);

    //// Add title
    const { addonDisplayName } = getStakingAddonDisplayProperties(this.addonType);
    const titleText = addonDisplayName;
    const title = new Text(titleText, makeCommonFontStyle(18));
    title.position.set(65, 85);
    this.addChild(title);
    this.titleLabel = title;

    //// Add title
    const subtitle = new Text(`--`, makeCommonFontStyle(12));
    subtitle.position.set(65, 90);
    this.addChild(subtitle);
    this.subtitleLabel = subtitle;
  }

  async load() {
    this.addonData = await this.addonDataService.getAddonStatusData(this.station.assetId);
  }

  async initialize() {
    const addonData = this.addonData;

    if (!addonData) {
      throw new Error("Addon data is not assigned");
    }

    if (!addonData.unlocked) {
      throw new Error("Addon data is not unlocked");
    }

    const performAction_ClaimStakeRewards = async () => {
      const { modals, spinner } = this.context;
      const claimPromise = this.addonDataService.claimStationOwnerTociumEarns(this.station.assetId);
      const result = await this.context.spinner.showDuring(claimPromise);
      const reward = digRewardAmmountFromTransactionResult(result);
      const rewardFormatted = reward && formatCurrencyFromContractString(reward);
      await modals.successfulClaim(rewardFormatted);
      await spinner.showDuring(this.context.userDataCtrl.updateAll());
    };

    const pages = new PageObjectManager(
      {
        [StakingAddonSubpageKey.Manage_Home]: {
          construct: () => {
            const container = new StakingAddonManageHomePage(this.station, this.addonType);
            container.addonData = addonData;
            container.events.on({
              addonButtonClick: async key => {
                switch (key) {
                  case StakingAddonManageHomeButtonKey.CommissionRates:
                    await gotoPage(StakingAddonSubpageKey.Manage_Commissions);
                    break;
                  case StakingAddonManageHomeButtonKey.UpgradeTier:
                    await gotoPage(StakingAddonSubpageKey.Manage_TierUpgrades);
                    break;
                  case StakingAddonManageHomeButtonKey.VIPWhitelist:
                    await gotoPage(StakingAddonSubpageKey.Manage_VIPWhitelist);
                    break;
                  case StakingAddonManageHomeButtonKey.ClaimTocium:
                    await performAction_ClaimStakeRewards();
                    break;
                }
              },
            });
            return container;
          },
        },
        [StakingAddonSubpageKey.Manage_Commissions]: {
          construct: () => {
            const container = new StakingAddonManageCommissionsPage(this.station, this.addonType);
            container.addonData = addonData;
            return container;
          },
        },
        [StakingAddonSubpageKey.Manage_VIPWhitelist]: {
          construct: () => {
            const container = new StakingAddonManageVIPWhitelistPage(this.station, this.addonType);
            container.addonData = addonData;
            return container;
          },
        },
        [StakingAddonSubpageKey.Manage_TierUpgrades]: {
          construct: () => {
            const container = new StakingAddonManageTierUpgradesPage(this.station, this.addonType);
            container.addonData = addonData;
            return container;
          },
        },
        [StakingAddonSubpageKey.PublicStakedCardsList]: {
          construct: () => {
            const container = new StakingAddonPublicListSubpage(this.station, this.addonType);
            container.addonData = addonData;
            return container;
          },
        },
        [StakingAddonSubpageKey.VIPStakedCardsList]: {
          construct: () => {
            const container = new StakingAddonVIPListSubpage(this.station, this.addonType);
            container.addonData = addonData;
            return container;
          },
        },
      },
      this
    );
    this.pageManager = pages as any; //TODO: figure out what's breaking the generic types

    const gotoPage = async (pageKey: StakingAddonSubpageKey) => {
      pages.setCurrentPage(pageKey);
    };

    const getCurrentPage = () => {
      return pages.currentPage as
        | null
        | (typeof pages.currentPage & {
            subpageTitle?: string;
          });
    };

    this.navigationTabs.events.on({
      tabSelected: async ({ pageKey }) => gotoPage(pageKey),
    });

    // // // //

    this.enchantments.watch(
      () => getCurrentPage()?.subpageTitle,
      subtitle => {
        this.subtitleLabel.text = (subtitle || "").toUpperCase();
        this.subtitleLabel.x = this.titleLabel.x + this.titleLabel.width + 10;
      },
      true
    );
  }

  async playShowAnimation() {
    const promises = [
      this.navigationTabs.playShowAnimation(),
      this.tweeener.delay(0.25).then(() => this.navigationTabs.setSelectedTabIndex(0)),
    ];
    await Promise.all(promises);
  }

  async playHideAnimation() {
    await Promise.all([this.navigationTabs.playHideAnimation(), this.pageManager?.setCurrentPage(null)]);
  }
}
