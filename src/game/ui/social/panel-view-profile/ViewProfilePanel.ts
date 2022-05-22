import { makeDraggable } from "@debug/utils/makeDraggable";
import { GameSingletons } from "@game/app/GameSingletons";
import { createComingSoonMessage } from "@game/asorted/createComingSoonMessage";
import { FontFamily } from "@game/constants/FontFamily";
import { BevelFilter } from "@pixi/filter-bevel";
import { createXButton } from "../../components/createXButton";
import { RailroaderDashPanelBase } from "../../railroader-dash/panels/RailroaderDashPanelBase";
import { ViewAvatarSection } from "../components/viewComponents/ViewAvatarSection";
import { ViewInfoSection } from "../components/viewComponents/ViewInfoSection";
import { SocialProfileDataService } from "../SocialProfileDataService";

export class ViewProfilePanel extends RailroaderDashPanelBase {
  dataService: SocialProfileDataService = new SocialProfileDataService();

  async init(
    username: string = GameSingletons.getGameContext().userData.name,
    withBase: boolean = true
  ): Promise<void> {
    if (withBase) {
      this.pad.texture = this.assets.getTexture("ui-social/center-panel.png");
      const textureId = "ui-railroader-dashboard/inventory/inv-infopanel-redeemable.png";
      const message =
        "Featuring achievements can be a fun flex. Don't be afraid to show them off in your Railroader Profile!";
      const plaque = this.addGreenPlaque({ textureId, message });
      this.addChild(plaque);
    } else {
      this.pad.texture = this.assets.getTexture("ui-social/panel-pad.png");
      this.shelf.renderable = false;
    }

    const textFilter = new BevelFilter({
      lightColor: 0x4d4d4c,
    });
    //// Top section
    const topSection = new ViewAvatarSection(username);
    const data = await this.dataService.getHighlightedMedals(username);
    for (let [index, element] of data.entries()) {
      topSection.setIconHighlight(element, index);
      topSection.setMedalArcHightlight(element, index);
    }
    topSection.position.set(175, 65);
    this.addChild(topSection);

    const { tagline } = await this.dataService.getMiscProfilePreferences(username);
    if (tagline) {
      topSection.setRailroaderTagline(tagline);
    }

    // Mid section
    const titleMid = this.factory.createText(
      "ACHIEVEMENTS",
      { fontSize: 36, fontFamily: FontFamily.Croogla, fill: 0x363634 },
      { x: 485, y: 335 }
    );
    titleMid.anchor.set(0.5);
    titleMid.filters = [textFilter];
    this.addChild(titleMid);

    // const midSection = new ViewAchievementsSection();
    // midSection.position.set(185, 360);
    // midSection.addAchievements(await this.dataService.getAchievementsInfoData(user));
    // this.addChild(midSection);
    const tempPage = createComingSoonMessage();
    tempPage.position.set(485, 450);
    this.addChild(tempPage);

    //// Lower section
    const titleLow = this.factory.createText(
      "INFORMATION",
      { fontSize: 36, fontFamily: FontFamily.Croogla, fill: 0x363634 },
      { x: 485, y: 585 }
    );
    titleLow.anchor.set(0.5);
    titleLow.filters = [textFilter];
    this.addChild(titleLow);

    const centralInfoSection = new ViewInfoSection();
    centralInfoSection.position.set(185, 620);
    centralInfoSection.addInfoTitle();

    const test = await this.dataService.getProfileInfoData(username);
    centralInfoSection.fillInfo(test);
    this.addChild(centralInfoSection);
  }

  addCloseButton(trigger: () => void): void {
    const button = createXButton();
    button.position.set(140, 60);
    button.scale.set(0.6);
    button.behavior.on({ trigger });
    this.addChild(button);
  }
}
