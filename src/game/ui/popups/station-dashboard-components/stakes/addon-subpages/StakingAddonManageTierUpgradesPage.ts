import { formatCurrencyFromContractString } from "@game/asorted/formatCurrencyFromContractString";
import { FontFamily } from "@game/constants/FontFamily";
import { FontIcon } from "@game/constants/FontIcon";
import { Rarity } from "@game/constants/Rarity";
import { getRarityColors } from "@game/constants/RarityColors";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { EnchantmentGlobals } from "@sdk/pixi/enchant/EnchantmentGlobals";
import { BottomBar } from "./components/BottomBar";
import { getStakingAddonDisplayProperties } from "../utils/getStakingAddonDisplayProperties";
import { BaseStakingAddonPage } from "./BaseStakingAddonPage";

type TierBoxData = {
  tier: string;
  vipCurrent: number;
  vipMax: number;
  publicCurrent: number;
  publicMax: number;
  color: number;
};

const cogConfig = {
  boxTextureId: "ui-station-dashboard/staking/manage-tab/tier-upgrade/bg-spots.png",
  nameplateTextureId: "ui-station-dashboard/staking/manage-tab/tier-upgrade/sm-box.png",
  cogTextureId: "ui-station-dashboard/staking/manage-tab/tier-upgrade/behind-gear.png",
  fallbackColor: 0x313131,
};

export class StakingAddonManageTierUpgradesPage extends BaseStakingAddonPage {
  public subpageTitle = "Upgrade Tier";

  public get currentTier(): number {
    return this.addonData.tier;
  }

  public get nextTier(): number {
    return this.currentTier + 1;
  }

  async initialize() {
    await super.initialize();

    //// BOTTOM BAR

    const performUpgrade = async () => {
      const nextTier = this.nextTier;

      const actionPromise = this.addonDataService.upgradeStakingAddon(this.station.assetId);
      await this.spinner.showDuring(actionPromise);

      const { addonDisplayName: displayName } = getStakingAddonDisplayProperties(this.addonType);

      await this.modals.alert({
        title: `Success`,
        content: `You've unlocked tier ${nextTier} of your station's ${displayName.toUpperCase()}.\nRailroaders can begin staking in your public spots immediately.\nBe on the lookout for the VIP requests!`,
      });

      await updateTiers();
    };

    function getTierColor(tier: number) {
      try {
        return getRarityColors(tier).main.toInt();
      } catch (e) {
        return cogConfig.fallbackColor;
      }
    }

    //// TIER BOXES

    const currentRarityColor = getTierColor(this.currentTier);
    const nextRarityColor = getTierColor(this.nextTier);

    //// Add current tier box
    const currentTierBox = this.createTierBox("Current Spots", currentRarityColor);
    currentTierBox.scale.set(0.5);
    currentTierBox.position.set(90, 165);
    currentTierBox.visible = false;
    this.addChild(currentTierBox);

    //// Add next tier box
    const nextTierBox = this.createTierBox("Potential Spots", nextRarityColor);
    nextTierBox.scale.set(0.5);
    nextTierBox.position.set(currentTierBox.x + currentTierBox.width + 100, 165);
    nextTierBox.visible = false;
    this.addChild(nextTierBox);

    //// Add bottom bits
    const bottomBar = new BottomBar();
    bottomBar.addButton(`Confirm`, performUpgrade);
    bottomBar.visible = false;
    this.addChild(bottomBar);

    const updateTiers = async () => {
      currentTierBox.visible = false;
      nextTierBox.visible = false;

      await this.refreshAddonData();

      const currentPublicSpotsUsed = this.addonData.publicSpotsUsed;
      const currentVipSpotsUsed = this.addonData.vipSpotsUsed;

      const tiersInfo = await this.addonDataService.getContractData_TiersInfo();
      const tierInfoCurrent = tiersInfo[this.currentTier - 1];
      const tierInfoNext = tiersInfo[this.nextTier - 1];

      const currentRarityColor = getTierColor(this.currentTier);
      const nextRarityColor = getTierColor(this.nextTier);

      if (tierInfoCurrent) {
        currentTierBox.visible = true;
        currentTierBox.fillData({
          tier: "Tier " + this.currentTier,
          color: currentRarityColor,
          publicCurrent: currentPublicSpotsUsed,
          publicMax: tierInfoCurrent.public_spots,
          vipCurrent: currentVipSpotsUsed,
          vipMax: tierInfoCurrent.vip_spots,
        });
        currentTierBox.playShowAnimation();
      }

      await this.ticker.delay(0.13);

      const myRarity = this.station.rarity.toLowerCase();
      const canUpgrade = tierInfoNext && tierInfoNext.rarities.includes(myRarity);

      if (!canUpgrade) {
        console.log(
          `Cannot upgrade to tier ${this.nextTier}.
          Current rarity: ${myRarity}
          Next tier allowed rarity: ${tierInfoNext ? tierInfoNext.rarities.join(", ") : "none"}`
        );
      }

      if (canUpgrade) {
        nextTierBox.visible = true;
        nextTierBox.fillData({
          tier: "Tier " + this.nextTier,
          color: nextRarityColor,
          publicCurrent: currentPublicSpotsUsed,
          publicMax: tierInfoNext.public_spots,
          vipCurrent: currentVipSpotsUsed,
          vipMax: tierInfoNext.vip_spots,
        });
        nextTierBox.playShowAnimation();
      }

      if (canUpgrade) {
        const nextTierPrice = formatCurrencyFromContractString(tierInfoNext.costs[0]);
        const bottomBarMessage = `Upgrade to tier ${this.nextTier} for  ${nextTierPrice}?`;
        bottomBar.setText(bottomBarMessage.toUpperCase());
      } else {
        const bottomBarMessage = `You've reached the maximum tier for this station.  🚂`;
        bottomBar.setText(bottomBarMessage.toUpperCase());
        bottomBar.removeButton();
      }
    };

    await updateTiers();

    bottomBar.visible = true;
  }

  //// Create tier boxes
  createTierBox(title: string, color: number) {
    const boxTexture: Texture = this.assets.getTexture(cogConfig.boxTextureId);
    const nameplateTexture: Texture = this.assets.getTexture(cogConfig.nameplateTextureId);
    const cogTexture: Texture = this.assets.getTexture(cogConfig.cogTextureId);

    const container = new Container();

    //// Add background
    const bg = new Sprite(boxTexture);

    //// Add title
    const titleText = this.createText(title, bg.x + bg.width / 2, bg.y - 30, 42, FontFamily.Croogla);

    //// Add VIP text
    const vipSpotsLabel = this.createText("", titleText.x, bg.y + bg.height / 2 - 75, 36, FontFamily.Default);

    //// Add Public text
    const publicSpotsLabel = this.createText("", titleText.x, bg.y + bg.height / 2 - 25, 36, FontFamily.Default);

    //// Add total text
    const totalSpotsLabel = this.createText("", titleText.x, bg.y + bg.height / 2 + 50, 48, FontFamily.Croogla);

    //// Add nameplate
    const tierPlateSprite = new Sprite(nameplateTexture);
    tierPlateSprite.anchor.set(0.5);
    tierPlateSprite.position.set(bg.x + bg.width / 2, bg.y + bg.height - tierPlateSprite.height / 2);
    tierPlateSprite.tint = color;

    //// Add nameplate text
    const tierLabel = this.createText("", tierPlateSprite.x, tierPlateSprite.y, 24, FontFamily.Default);

    //// Add cog sprite
    const cogSprite = new Sprite(cogTexture);
    cogSprite.anchor.set(0.5);
    cogSprite.position.set(bg.x + bg.width / 2, bg.y + bg.height * 0.85);
    cogSprite.tint = color;

    function onEnterFrame() {
      cogSprite.rotation += 0.1 * EnchantmentGlobals.timeDelta;
    }

    container.addChild(cogSprite);
    container.addChild(bg);
    container.addChild(titleText);
    container.addChild(vipSpotsLabel);
    container.addChild(publicSpotsLabel);
    container.addChild(totalSpotsLabel);
    container.addChild(tierPlateSprite);
    container.addChild(tierLabel);

    function fillData(data: TierBoxData) {
      console.log({
        fillData: data,
      });

      tierLabel.text = data.tier.toUpperCase();
      vipSpotsLabel.text = "VIP: " + data.vipCurrent + "/" + data.vipMax;
      publicSpotsLabel.text = "PUBLIC: " + data.publicCurrent + "/" + data.publicMax;
      totalSpotsLabel.text = "TOTAL: " + (data.vipCurrent + data.publicCurrent) + "/" + (data.vipMax + data.publicMax);
      tierPlateSprite.tint = data.color;
      cogSprite.tint = data.color;
    }

    const tweeener = new TemporaryTweeener(container);
    function playShowAnimation() {
      return tweeener.fromTo(
        container,
        {
          pixi: { pivotY: 50 },
          alpha: 0,
        },
        {
          pixi: { pivotY: 0 },
          alpha: 1,
          duration: 0.3,
          ease: "back(3).out",
        }
      );
    }
    function playHideAnimation() {
      return tweeener.to(container, {
        pixi: { pivotY: 100 },
        alpha: 0,
        duration: 0.2,
        ease: "back.in",
      });
    }

    return Object.assign(container, {
      fillData,
      onEnterFrame,
      playShowAnimation,
      playHideAnimation,
    });
  }

  //// Create text
  createText(label: string, x: number, y: number, fontSize: number, fontFamily: FontFamily) {
    const text = new Text(label, {
      fontFamily: fontFamily,
      fontSize: fontSize,
      fill: 0xffffff,
    });
    text.anchor.set(0.5);
    text.position.set(x, y);
    return text;
  }

  clearContainer() {
    const children = [...this.children];
    for (const child in children) {
      if (parseInt(child) > 0) children[child].destroy({ children: true });
    }
  }
}
