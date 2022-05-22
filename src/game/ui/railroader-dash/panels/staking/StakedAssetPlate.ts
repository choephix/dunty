import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { digRewardAmmountFromTransactionResult } from "@game/asorted/digRewardAmmountFromTransactionResult";
import { formatCurrencyFromContractString } from "@game/asorted/formatCurrencyFromContractString";
import { formatDateTimeHumanReadable } from "@game/asorted/formatDateTimeHumanReadable";
import { FontFamily } from "@game/constants/FontFamily";
import { getRarityColors } from "@game/constants/RarityColors";
import { ThemeColors } from "@game/constants/ThemeColors";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { CardSprite } from "@game/ui/cards/CardSprite";
import { getStakingAddonDisplayProperties } from "@game/ui/popups/station-dashboard-components/stakes/utils/getStakingAddonDisplayProperties";
import { Text } from "@pixi/text";
import { OverrideWidthAndHeight } from "@sdk-pixi/decorators/OverrideWidthAndHeight";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { StakedAssetEntity } from "./StakedAssetsDataService";

@OverrideWidthAndHeight()
export class StakedAssetPlate extends EnchantedContainer {
  private readonly context: GameContext = GameSingletons.getGameContext();

  constructor(public refreshList: () => void) {
    super();
  }

  init(stakedAsset: StakedAssetEntity) {
    //// Add background
    const bg = this.context.simpleFactory.createSprite("ui-railroader-dashboard/page-staking/module-staked-asset.png");
    this.addChild(bg);

    this._width = bg.width;
    this._height = bg.height;

    //// Add station
    const rarityColors = getRarityColors(stakedAsset.station.rarity);
    const stationSprite = this.context.simpleFactory.createSprite(
      `ui-railroader-dashboard/staking/station-art/` + stakedAsset.station.rarity + `.png`,
      { x: this.width }
    );
    stationSprite.anchor.x = 1;
    this.addChild(stationSprite);

    //// Add station name badge
    const badge = this.context.simpleFactory.createSprite(
      "ui-railroader-dashboard/page-staking/badge-station-name.png"
    );
    badge.tint = rarityColors.main.toInt();
    badge.anchor.set(0.5, 0.5);
    badge.position.set(this.width + 2 - badge.width / 2, this.height + 2 - badge.height / 2);
    this.addChild(badge);

    //// Add station name text
    const stationName = this.context.simpleFactory.createText(stakedAsset.station.name, {
      fill: 0xffffff,
      fontSize: 22,
    });
    stationName.anchor.set(0.5, 0.5);
    stationName.position.set(badge.x, badge.y - 12);
    this.addChild(stationName);

    //// Add card sprite
    const cardSprite = new CardSprite(stakedAsset.card, true);
    cardSprite.overlay?.destroy();
    cardSprite.scale.set(0.25);
    cardSprite.position.set(35, 25);
    this.addChild(cardSprite);

    //// Add Locomotive/Conductor info
    const name = this.context.simpleFactory.createText(
      stakedAsset.card.data.name,
      {
        fontFamily: FontFamily.Croogla,
        fill: 0xffffff,
        fontSize: 34,
      },
      {
        x: cardSprite.x + cardSprite.width + 35,
        y: cardSprite.y + 10,
      }
    );
    this.addChild(this.resizeText(name, 289));

    //// Add Unstake button
    const unstakeButton = this.context.simpleFactory.createSprite(
      "ui-railroader-dashboard/page-staking/btn-unstake.png",
      { x: cardSprite.x + cardSprite.width / 2, y: cardSprite.y + cardSprite.height + 30 }
    );
    unstakeButton.anchor.set(0.5);
    this.addChild(unstakeButton);
    const unstakeText = this.context.simpleFactory.createText(
      "UNSTAKE",
      {
        fill: 0xffffff,
        fontSize: 20,
      },
      { x: unstakeButton.x, y: unstakeButton.y + 7 }
    );
    unstakeText.anchor.set(0.5);
    this.addChild(unstakeText);

    //// Add Claim button
    const claimButton = this.context.simpleFactory.createSprite("ui-railroader-dashboard/page-staking/btn-claim.png");
    claimButton.position.set(unstakeButton.x + unstakeButton.width / 2 + claimButton.width / 2, unstakeButton.y);
    claimButton.anchor.set(0.5);
    this.addChild(claimButton);
    const claimText = this.context.simpleFactory.createText(
      "CLAIM",
      {
        fill: 0xffffff,
        fontSize: 20,
      },
      {
        x: claimButton.x,
        y: claimButton.y + 7,
      }
    );
    claimText.anchor.set(0.5);
    this.addChild(claimText);

    //// Add events
    buttonizeDisplayObject(unstakeButton, async () => {
      const choice = await this.context.modals.unstakeAsset(stakedAsset, {
        title: "Unstake Asset",
        content: `You will not be able to unstake ${stakedAsset.card.data.name.toUpperCase()}\nif there are any unclaimed earnings.\nMake sure to claim that Tocium!`,
        acceptButtonText: "Unstake",
        cancelButtonText: "Cancel",
      });
      if (choice) {
        const result = await stakedAsset.unstake();
        this.refreshList();
      }
    });

    buttonizeDisplayObject(claimButton, async () => {
      const { addonDisplayName, cardSchemaDisplayName } = getStakingAddonDisplayProperties(stakedAsset.addonType);
      await this.context.modals.alert({
        title: "Claim Staking Rewards",
        content: `This will claim Tocium for all your ${cardSchemaDisplayName.toUpperCase()}S\nin this Station's ${addonDisplayName}`,
      });
      const result = await stakedAsset.claimEarns();
      const reward = digRewardAmmountFromTransactionResult(result);
      const rewardFormatted = reward && formatCurrencyFromContractString(reward);
      await this.context.modals.successfulClaim(rewardFormatted);
      this.refreshList();
    });

    const initWithDetails = async () => {
      await this.enchantments.waitUntil(() => this.parent && this.visible && this.renderable);
      console.log("Parent is ready", stakedAsset.cardId);

      const details = await stakedAsset.loadDetails();

      //// Is vip
      if (details.isVip) {
        //// Add VIP text
        const vipText = this.context.simpleFactory.createText("VIP SPOT", {
          fontFamily: FontFamily.DefaultThin,
          fill: 0xffffff,
          fontSize: 20,
        });
        vipText.anchor.set(0.5, 0.5);
        vipText.position.set(badge.x, badge.y + 15);
        this.addChild(vipText);
        const vipSprite = this.context.simpleFactory.createSprite(
          "ui-railroader-dashboard/page-staking/vip-badge.png",
          {
            alpha: 0.75,
            x: stationSprite.x - 25,
            y: stationSprite.y + 25,
          }
        );
        vipSprite.anchor.set(1, 0);
        this.addChild(vipSprite);
      } else {
        //// Add Public text
        const publicText = this.context.simpleFactory.createText("PUBLIC SPOT", {
          fontFamily: FontFamily.DefaultThin,
          fill: 0xffffff,
          fontSize: 20,
        });
        publicText.anchor.set(0.5, 0.5);
        publicText.position.set(badge.x, badge.y + 15);
        this.addChild(publicText);
      }

      //// Check if object has start date info
      if (details.startDate) {
        const startText = this.createInfoText(
          name.x,
          name.y + 50,
          stationSprite.x - stationSprite.width - 25,
          "START:",
          formatDateTimeHumanReadable(details.startDate)
        );
        this.addChild(startText[0]);
        this.addChild(startText[1]);
      }

      //// Check if object has end date info
      if (details.endDate) {
        const endText = this.createInfoText(
          name.x,
          111,
          stationSprite.x - stationSprite.width - 25,
          "END:",
          formatDateTimeHumanReadable(details.endDate)
        );
        this.addChild(endText[0]);
        this.addChild(endText[1]);
      }

      //// Check if object has rate info
      if (details.rate) {
        const rateText = this.createInfoText(
          name.x,
          137,
          stationSprite.x - stationSprite.width - 25,
          "RATE:",
          "" + details.rate
        );
        this.addChild(rateText[0]);
        this.addChild(rateText[1]);
      }

      //// Check if object has claimable info
      if (details.claimable) {
        const claimableText = this.createInfoText(
          name.x,
          162,
          stationSprite.x - stationSprite.width - 25,
          "CLAIMABLE:",
          details.claimable,
          ThemeColors.HIGHLIGHT_COLOR_LIGHT.toInt()
        );
        this.addChild(claimableText[0]);
        this.addChild(claimableText[1]);
      }
    };

    initWithDetails();
  }

  createInfoText(startX: number, y: number, endX: number, text1: string, text2: string, color: number = 0xffffff) {
    const text = this.context.simpleFactory.createText(
      text1,
      {
        fill: color,
        fontSize: 20,
      },
      {
        x: startX,
        y: y,
      }
    );
    const textDate = this.context.simpleFactory.createText(
      text2,
      {
        fill: color,
        fontSize: 20,
      },
      {
        x: endX,
        y: y,
      }
    );
    textDate.anchor.set(1, 0);

    return [text, textDate];
  }

  resizeText(text: Text, maxWidth: number) {
    if (text.width > maxWidth) {
      text.scale.x -= 0.1;
      text.scale.y -= 0.1;
      this.resizeText(text, maxWidth);
    }
    return text;
  }
}
