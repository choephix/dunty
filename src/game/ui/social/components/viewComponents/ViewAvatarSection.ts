import { SimpleObjectsFactory } from "@game/app/components/SimpleObjectsFactory";
import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { Container } from "@pixi/display";
import { AvatarBadge } from "../../avatar/AvatarBadge";
import { RailroaderMedal } from "../../avatar/components/RailroaderMedal";
import { Text } from "@pixi/text";
import { fitObjectInRectangle } from "@sdk-pixi/layout/fitObjectInRectangle";
import { SocialProfileDataService } from "../../SocialProfileDataService";

export class ViewAvatarSection extends Container {
  private avatar: AvatarBadge;
  private factory: SimpleObjectsFactory = GameSingletons.getSimpleObjectFactory();
  private medals: Array<RailroaderMedal> = [];
  private texts: Array<Text> = [];
  private railroaderTag: Text = this.factory.createText("", {
    fontFamily: FontFamily.DanielBlack,
    fontSize: 28,
  });
  private readonly spinner = GameSingletons.getSpinner();
  private readonly dataService: SocialProfileDataService = new SocialProfileDataService();

  constructor(user: string) {
    super();
    this.avatar = new AvatarBadge();
    this.avatar.scale.set(0.25);
    this.addChild(this.avatar);
    this.initAvatar(user);
    //// Add side medals
    this.addIcons([
      {
        textureId: "ui-social/achievements/icons/loco.png",
        position: { x: 350, y: 50 },
        isHighlight: false,
        name: "Loco Lover",
      },
      {
        textureId: "ui-social/achievements/icons/conductor.png",
        position: { x: 350, y: 90 },
        isHighlight: false,
        name: "Conductor Connoisseur",
      },
      {
        textureId: "ui-social/achievements/icons/rc.png",
        position: { x: 350, y: 130 },
        isHighlight: false,
        name: "Rail Car Rocker",
      },
      {
        textureId: "ui-social/achievements/icons/comms.png",
        position: { x: 350, y: 170 },
        isHighlight: false,
        name: "Commodity Beast",
      },
      {
        textureId: "ui-social/achievements/icons/pass.png",
        position: { x: 350, y: 210 },
        isHighlight: false,
        name: "Passenger Prophet",
      },
    ]);
    //// Add railroader tag
    this.addRailroaderTag();
  }

  addIcons(
    data: Array<{ textureId: string; position: { x: number; y: number }; isHighlight: boolean; name?: string }>
  ) {
    for (let icon of data) {
      const medal = new RailroaderMedal();
      medal.setIcon(icon.textureId);
      medal.setHighlighted(icon.isHighlight);
      medal.position.set(icon.position.x, icon.position.y);
      medal.scale.set(0.25);
      this.addChild(medal);
      if (icon.name) {
        const text = this.factory.createText(
          icon.name.toUpperCase(),
          { fontSize: 18 },
          { x: icon.position.x + 25, y: icon.position.y + 8 }
        );
        text.anchor.y = 0.5;
        this.texts.push(text);
        this.addChild(text);
      }
      this.medals.push(medal);
    }
  }

  setMedalArcHightlight(data: boolean, medalIndex: number) {
    this.avatar.railroaderArc.setHighlight(data, medalIndex);
  }

  setIconHighlight(data: boolean, medalIndex: number) {
    this.medals[medalIndex].setHighlighted(data);
    this.texts[medalIndex].style.fill = data ? 0xffffff : 0x303030;
  }

  addRailroaderTag() {
    const tagBg = this.factory.createSprite("ui-social/badge-tag.png", { x: 195, y: -10 });
    tagBg.scale.set(0.7);
    this.addChild(tagBg);

    fitObjectInRectangle(this.railroaderTag, {
      x: 250,
      y: -40,
      width: 150,
      height: 100,
    });
    this.addChild(this.railroaderTag);
  }

  setRailroaderTagline(label: string) {
    this.railroaderTag.text = label;
    fitObjectInRectangle(this.railroaderTag, {
      x: 60,
      y: 5,
      width: 200,
      height: 40,
    });
  }

  async initAvatar(user: string) {
    AvatarBadge.applyUserData(this.avatar, user);
    const preferences = await this.spinner.showDuring(this.dataService.getAvatarBadgePreferences(user));
    AvatarBadge.applyPreferences(this.avatar, preferences);
    AvatarBadge.showWhenFullyLoaded(this.avatar, false);
  }
}
