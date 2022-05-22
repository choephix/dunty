import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { Container } from "@pixi/display";
import { Text } from "@pixi/text";
import { BitmapText, IBitmapTextStyle } from "@pixi/text-bitmap";
import { fitObjectInRectangle } from "@sdk-pixi/layout/fitObjectInRectangle";
import { createXButton, XButton } from "../../components/createXButton";
import { AvatarBadge } from "../avatar/AvatarBadge";
import { FeaturedAchievements } from "../components/FeaturedAchievements";
import { SocialProfileDataService } from "../SocialProfileDataService";

const labelStyle = {
  fontName: "Celestial Typeface",
  align: "center",
} as IBitmapTextStyle;

export class SocialProfileQuickView extends Container {
  private readonly factory = GameSingletons.getSimpleObjectFactory();

  public readonly background;
  public readonly avatar: AvatarBadge;
  public readonly railroaderTag: Text;
  public closeButton?: XButton;

  private readonly dataService = new SocialProfileDataService();

  constructor(private viewProfileClick?: () => void) {
    super();

    //// Add background
    this.background = this.factory.createSprite("ui-social/right-panel/expanded/base.png");
    this.addChild(this.background);

    const box = this.factory.createSprite("ui-social/right-panel/expanded/achievement-base.png");
    box.position.set(55, 275);
    this.addChild(box);

    //// Add achivements
    const achievements = new FeaturedAchievements();
    achievements.position.set(120, 425);
    this.addChild(achievements);

    //// Add avatar
    this.avatar = new AvatarBadge();
    this.avatar.scale.set(0.35);
    this.avatar.position.set(105, 50);
    this.addChild(this.avatar);

    //// Add bottom label
    this.railroaderTag = this.factory.createText(
      "",
      { fontFamily: FontFamily.DanielBlack, fontSize: 28 },
      { x: 275, y: 580 }
    );
    this.railroaderTag.anchor.set(0.5);
    this.addChild(this.railroaderTag);

    //// Add view profile button
    const viewProfileButton = this.factory.createSprite("ui-social/right-panel/expanded/btn.png");
    viewProfileButton.tint = 0x023438;
    const viewBtnText = new BitmapText("view profile", labelStyle);
    viewBtnText.scale.set(0.75);
    viewBtnText.position.set(75, 0);
    viewProfileButton.addChild(viewBtnText);
    viewProfileButton.position.set(85, 625);
    viewProfileButton.interactive = true;
    viewProfileButton.buttonMode = true;
    viewProfileButton.on("pointerdown", () => this.viewProfileClick?.());
    this.addChild(viewProfileButton);
  }

  public addCloseButton(onClick: () => unknown) {
    const button = (this.closeButton = createXButton());
    button.scale.set(0.8);
    button.position.set(45, 22);
    button.behavior.on({
      trigger: () => {
        onClick();
        button?.destroy({ children: true });
      },
    });
    return this.addChild(button);
  }

  async applyUserData(username: string) {
    await AvatarBadge.applyUserData(this.avatar, username);

    AvatarBadge.showWhenFullyLoaded(this.avatar);

    const data = await this.dataService.getHighlightedMedals(username);
    for (let [index, element] of data.entries()) {
      this.avatar.railroaderArc.setHighlight(element, index);
    }

    const { tagline } = await this.dataService.getMiscProfilePreferences(username);
    if (tagline) {
      this.setRailroaderTagline(tagline);
    }
  }

  private setRailroaderTagline(text: string) {
    this.railroaderTag.text = text;
    fitObjectInRectangle(this.railroaderTag, { x: 137, y: 560, width: 256, height: 40 });
  }
}
