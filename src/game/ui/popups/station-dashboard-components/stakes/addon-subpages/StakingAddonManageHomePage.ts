import { FontFamily } from "@game/constants/FontFamily";
import { getRarityColors } from "@game/constants/RarityColors";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { EventBus } from "@sdk/core/EventBus";
import { BaseStakingAddonPage } from "./BaseStakingAddonPage";

export enum StakingAddonManageHomeButtonKey {
  CommissionRates = "commissionRates",
  UpgradeTier = "upgradeTier",
  VIPWhitelist = "vipWhitelist",
  ClaimTocium = "claimTocium",
}

type ButtonConfiguration = {
  texture: string;
  labelText: string;
  disabled: boolean;
};

const buttonConfigurations: Record<StakingAddonManageHomeButtonKey, ButtonConfiguration> = {
  [StakingAddonManageHomeButtonKey.CommissionRates]: {
    texture: "ui-station-dashboard/staking/manage-tab/manage-home/icon-commissions.png",
    labelText: "COMMISSIONS",
    disabled: false,
  },
  [StakingAddonManageHomeButtonKey.UpgradeTier]: {
    texture: "ui-station-dashboard/staking/manage-tab/manage-home/icon-upgrade.png",
    labelText: "UPGRADE TIER",
    disabled: false,
  },
  [StakingAddonManageHomeButtonKey.VIPWhitelist]: {
    texture: "ui-station-dashboard/staking/manage-tab/manage-home/icon-mng-vips.png",
    labelText: "MANAGE VIPS",
    disabled: false,
  },
  [StakingAddonManageHomeButtonKey.ClaimTocium]: {
    texture: "ui-station-dashboard/staking/manage-tab/manage-home/icon-tocium.png",
    labelText: "CLAIM TOCIUM",
    disabled: false,
  },
};

export class StakingAddonManageHomePage extends BaseStakingAddonPage {
  public subpageTitle = "";

  events = new EventBus<{
    addonButtonClick: (key: StakingAddonManageHomeButtonKey) => void;
  }>();

  async initialize() {
    await super.initialize();

    this.subpageTitle = "Tier " + this.addonData.tier;

    //// Add buttons
    this.addNavigationButtons();
  }

  addNavigationButtons() {
    const rarityColors = getRarityColors(this.station.rarity);
    let startX = 75;
    let startY = 150;
    let index = 0;

    //// Create buttons
    for (const key in buttonConfigurations) {
      const buttonKey = key as StakingAddonManageHomeButtonKey;
      const { texture, labelText, disabled } = buttonConfigurations[buttonKey];
      const rarityColor = rarityColors.main.toInt();

      const button = this.createNavigationButton(this.assets.getTexture(texture), labelText, rarityColor, buttonKey);

      button.position.set(startX, startY);
      startX += button.width + 25;
      if (index % 2 == 1) {
        startX = 75;
        startY += button.height + 25;
      }

      if (disabled) {
        button.alpha = 0.55;
        button.interactive = false;
      }

      this.addChild(button);

      index++;
    }
  }

  createNavigationButton(
    iconTexture: Texture,
    label: string,
    tint: number,
    buttonKey: StakingAddonManageHomeButtonKey
  ) {
    const container = new Container();

    //// Add Button
    const buttonSprite = new Sprite(
      this.assets.getTexture("ui-station-dashboard/staking/manage-tab/manage-home/btn-manage-home.png")
    );
    buttonSprite.tint = tint;
    container.addChild(buttonSprite);

    //// Add Icon
    const iconSprite = new Sprite(iconTexture);
    iconSprite.anchor.set(0.5);
    iconSprite.position.set(buttonSprite.x + buttonSprite.width / 2, buttonSprite.y + buttonSprite.height / 2 - 25);
    container.addChild(iconSprite);

    //// Add label text
    const labelText = new Text(label, {
      fontFamily: FontFamily.Default,
      fontSize: 26,
      fill: 0xffffff,
    });
    labelText.anchor.set(0.5);
    labelText.position.set(iconSprite.x, iconSprite.y + 45);
    container.addChild(labelText);

    container.scale.set(0.5);
    buttonizeDisplayObject(container, () => {
      this.events.dispatch("addonButtonClick", buttonKey);
    });
    return container;
  }
}
