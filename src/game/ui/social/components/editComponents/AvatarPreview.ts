import { GameSingletons } from "@game/app/GameSingletons";
import { AvatarBadge } from "@game/ui/social/avatar/AvatarBadge";
import { Container } from "@pixi/display";

export class AvatarPreview extends Container {
  private readonly factory = GameSingletons.getSimpleObjectFactory();

  public readonly avatar;

  constructor() {
    super();

    //// Add background
    const bg = this.factory.createSprite("ui-social/edit/preview-bg.png");
    bg.scale.set(0.7);
    this.addChild(bg);

    //// Add preview avatar
    this.avatar = new AvatarBadge();
    this.avatar.position.set(165, 60);
    this.avatar.scale.set(0.35);
    this.addChild(this.avatar);
  }

  setMedalArcHightlight(data: boolean, medalIndex: number) {
    this.avatar.railroaderArc.setHighlight(data, medalIndex);
  }
}
