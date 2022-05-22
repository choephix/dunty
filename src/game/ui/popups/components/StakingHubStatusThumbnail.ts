import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { ThemeColors } from "@game/constants/ThemeColors";
import { StakingAddonStatusData } from "@game/data/staking/models";
import { StakingAddonDataHelper } from "@game/data/staking/StakingAddonDataHelper";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { getStakingAddonDisplayProperties } from "../station-dashboard-components/stakes/utils/getStakingAddonDisplayProperties";

export class StakingHubStatusThumbnail extends Container {
  private readonly assets = GameSingletons.getResources();

  public interactive = true;
  public buttonMode = true;

  fillContent(addonData: StakingAddonStatusData): void {
    const { addonDisplayName: title } = getStakingAddonDisplayProperties(addonData.type);

    //// Add background based on type and unlocked status
    const bg = this.createBackground(addonData);
    this.addChild(bg);

    if (!addonData.unlocked) {
      //// Add title
      const titleLabel = new Text(title + " - NOT ENABLED", {
        fontFamily: FontFamily.Default,
        fontSize: 18,
        fill: 0xffffff,
      });
      titleLabel.position.set(25, -titleLabel.height - 2);
      this.addChild(titleLabel);
    } else {
      const { tier, openSpots, vipSpotsUsed, vipSpotsMax, publicSpotsUsed, publicSpotsMax } = addonData;

      //// Add title
      const titleLabel = new Text(title + " - TIER " + tier.toString(), {
        fontFamily: FontFamily.Default,
        fontSize: 18,
        fill: 0xffffff,
      });
      titleLabel.position.set(25, -titleLabel.height - 2);
      this.addChild(titleLabel);

      //// Add open spots
      const openSpotsLabel = new Text(openSpots + " OPEN SPOTS", {
        fontFamily: FontFamily.Default,
        fontSize: 14,
        fill: this.getColorFromRange(0, openSpots),
      });
      openSpotsLabel.position.set(bg.width - openSpotsLabel.width * 1.1, -openSpotsLabel.height - 2);
      this.addChild(openSpotsLabel);

      //// Add VIP text
      const vipLabel = new Text("VIP", {
        fontFamily: FontFamily.Default,
        fontSize: 18,
        fill: 0xffffff,
      });
      vipLabel.position.set(435, 35);
      vipLabel.anchor.x = 1;
      this.addChild(vipLabel);

      //// Add VIP spots max
      const vipSpotsMaxLabel = new Text(vipSpotsMax.toString(), {
        fontFamily: FontFamily.Default,
        fontSize: 18,
        fill: this.getColorFromRange(vipSpotsUsed, vipSpotsMax),
      });
      vipSpotsMaxLabel.position.set(435, 60);
      vipSpotsMaxLabel.anchor.x = 1;
      this.addChild(vipSpotsMaxLabel);

      //// Add VIP spots used
      const vipSpotsUsedLabel = new Text(vipSpotsUsed.toString() + "/", {
        fontFamily: FontFamily.Default,
        fontSize: 18,
        fill: this.getColorFromRange(vipSpotsUsed, vipSpotsMax),
      });
      vipSpotsUsedLabel.position.set(vipSpotsMaxLabel.x - vipSpotsMaxLabel.width, 60);
      vipSpotsUsedLabel.anchor.x = 1;
      this.addChild(vipSpotsUsedLabel);

      //// Add PUBLIC text
      const publicTextLabel = new Text("PUBLIC", {
        fontFamily: FontFamily.Default,
        fontSize: 18,
        fill: 0xffffff,
      });
      publicTextLabel.position.set(435, 95);
      publicTextLabel.anchor.x = 1;
      this.addChild(publicTextLabel);

      //// Add PUBLIC spots max
      const publicSpotsMaxLabel = new Text(publicSpotsMax.toString(), {
        fontFamily: FontFamily.Default,
        fontSize: 18,
        fill: this.getColorFromRange(publicSpotsUsed, publicSpotsMax),
      });
      publicSpotsMaxLabel.position.set(435, 120);
      publicSpotsMaxLabel.anchor.x = 1;
      this.addChild(publicSpotsMaxLabel);

      //// Add PUBLIC spots used
      const publicSpotsUsedLabel = new Text(publicSpotsUsed + "/", {
        fontFamily: FontFamily.Default,
        fontSize: 18,
        fill: this.getColorFromRange(publicSpotsUsed, publicSpotsMax),
      });
      publicSpotsUsedLabel.position.set(publicSpotsMaxLabel.x - publicSpotsMaxLabel.width, 120);
      publicSpotsUsedLabel.anchor.x = 1;
      this.addChild(publicSpotsUsedLabel);
    }
  }

  private getColorFromRange(current: number, max: number): number {
    if (current >= max) {
      return ThemeColors.DANGER_COLOR.toInt();
    } else if (max - current <= 2) {
      return ThemeColors.WARNING_COLOR.toInt();
    } else {
      return ThemeColors.HIGHLIGHT_COLOR.toInt();
    }
  }

  private createBackground(addonData: StakingAddonStatusData): Sprite {
    const { type, unlocked } = addonData;
    const prefix: string = type == "railYard" ? "yard-bg" : "lounge-bg";
    const suffix: string = unlocked ? "" : "-bw";
    const texture = this.assets.getTexture(`ui-popups/staking/${prefix}${suffix}.png`);
    const background = new Sprite(texture);

    const userIsVIP = StakingAddonDataHelper.isUserOnVIPWhitelist(addonData);
    if (userIsVIP) {
      const vipTexture = this.assets.getTexture(`assets/images/ui-staking/vip-indicator.png`);
      const vipSprite = new Sprite(vipTexture);
      vipSprite.name = `vipSprite`;
      vipSprite.scale.set(1.05);
      vipSprite.position.set(-24, 87);
      background.addChild(vipSprite);
    }

    return background;
  }
}
