import { createComingSoonMessage } from "@game/asorted/createComingSoonMessage";
import { RailroaderDashPanelBase } from "../../railroader-dash/panels/RailroaderDashPanelBase";

export class FeaturedAchievementsPanel extends RailroaderDashPanelBase {
  init(): void {
    this.pad.texture = this.assets.getTexture("ui-social/center-panel.png");
    const tempPage = createComingSoonMessage();
    tempPage.position.set(475, 450);
    this.addChild(tempPage);
    const textureId = "ui-railroader-dashboard/inventory/inv-infopanel-redeemable.png";
    const message =
      "You must hold at least 1 of a character's NFTs in your wallet to display them in your badge. Staking will also invalidate them.";
    const plaque = this.addGreenPlaque({ textureId, message });
    this.addChild(plaque);
  }
}
