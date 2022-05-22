import { GameSingletons } from "@game/app/GameSingletons";
import { StakingAddonType } from "@game/asorted/StakingType";
import { FontFamily } from "@game/constants/FontFamily";
import { StakingAddonStatusData } from "@game/data/staking/models";
import { GlowFilterService } from "@game/ui/fx/GlowFilterService";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";

export class StakesAddonSelectionLargeButton extends Container {
  private readonly assets = GameSingletons.getResources();

  glowService = new GlowFilterService();
  type: StakingAddonType;
  defaultTexture?: Texture;

  onClick?: (data: StakingAddonStatusData) => void;

  constructor(public data: StakingAddonStatusData) {
    super();
    const title = {
      railYard: "RAIL YARD",
      conductorLounge: "LOUNGE",
    }[data.type];

    this.type = data.type;

    //// Add background
    this.addChild(this.createBackground(data));

    //// Add title
    const titleText = new Text(title, {
      fontFamily: FontFamily.Default,
      fontSize: 24,
      fill: 0xffffff,
    });
    titleText.anchor.set(0.5);
    titleText.position.set(this.width / 2, this.height + titleText.height);
    this.addChild(titleText);

    this.scale.set(0.5);
    buttonizeDisplayObject(this, () => this.onClick?.(this.data));
  }

  private createBackground(data: StakingAddonStatusData): Sprite {
    const { type, unlocked } = data;
    const prefix: string = type == "railYard" ? "railyard" : "lounge";
    const suffix: string = unlocked ? "-unlock" : "-bw";
    this.defaultTexture = this.assets.getTexture(`ui-station-dashboard/staking/unlock-hubs/${prefix}${suffix}.png`);
    return new Sprite(this.defaultTexture);
  }

  updateStatus(selected: boolean, data?: StakingAddonStatusData) {
    const prefix: string = this.type == "railYard" ? "railyard" : "lounge";
    //// Check if there is new data to update
    this.updateData(data);
    if (selected) {
      this.glowService.addFilter(this.children[0]);
      (this.children[0] as Sprite).texture = this.assets.getTexture(
        `ui-station-dashboard/staking/unlock-hubs/${prefix}-unlock.png`
      );
    } else {
      this.glowService.removeFrom(this.children[0]);
      if (!this.defaultTexture) throw Error("No texture set");
      (this.children[0] as Sprite).texture = this.defaultTexture;
    }
  }

  updateData(data?: StakingAddonStatusData) {
    if (!data) return;
    this.data = data;
    this.createBackground(data);
  }
}
