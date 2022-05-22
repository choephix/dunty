import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { AvatarBadgeElements } from "@game/ui/social/avatar/AvatarBadgeElements";

export class InnerNameplate extends Container {
  plate?: Sprite;
  constructor() {
    super();
  }

  async addPlate(plateID: string) {
    const nameHolder = new Sprite(Texture.from(AvatarBadgeElements.nameplateHolder));
    nameHolder.anchor.set(0.5);
    this.addChild(nameHolder);
    //// Add plate
    this.plate = new Sprite(Texture.from(AvatarBadgeElements.getNameplateTextureId(plateID)));
    this.plate.anchor.set(0.5);
    this.addChild(this.plate);
  }

  setTintColor(color: number) {
    if (this.plate) this.plate.tint = color;
  }
}
