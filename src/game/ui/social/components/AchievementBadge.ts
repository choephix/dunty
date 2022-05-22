import { SimpleObjectsFactory } from "@game/app/components/SimpleObjectsFactory";
import { GameSingletons } from "@game/app/GameSingletons";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";

export class AchievementBadge extends Container {
  badge: Sprite;
  private readonly factory: SimpleObjectsFactory = GameSingletons.getSimpleObjectFactory();
  constructor() {
    super();
    this.badge = this.factory.createSprite("ui-social/empty.png");
    this.badge.anchor.set(0.5);
    this.addChild(this.badge);
  }

  setColor(color: number) {
    this.badge.tint = color;
  }
}
