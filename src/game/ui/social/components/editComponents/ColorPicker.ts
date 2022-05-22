import { SimpleObjectsFactory } from "@game/app/components/SimpleObjectsFactory";
import { GameSingletons } from "@game/app/GameSingletons";
import { Container } from "@pixi/display";
import { InteractionEvent } from "@pixi/interaction";
import { AvatarBadgeElements } from "@game/ui/social/avatar/AvatarBadgeElements";

const colors = AvatarBadgeElements.Colors;

export class ColorPicker extends Container {
  onColorSelected?: (color: number) => void;
  private readonly factory: SimpleObjectsFactory = GameSingletons.getSimpleObjectFactory();
  constructor() {
    super();

    //// Add colors
    const colorSprite = this.factory.createSprite("assets/images/ui-social/color-select.png");
    this.addChild(colorSprite);
    //// Color selection event
    colorSprite.interactive = true;
    colorSprite.buttonMode = true;
    colorSprite.on("pointerdown", (evt: InteractionEvent) => {
      const colorIndex = Math.floor(evt.data.getLocalPosition(this).y / 28);
      const colorCol = evt.data.getLocalPosition(this).x <= colorSprite.width / 2 ? 1 : 0;
      this.onColorSelected?.(colors[colorCol][colorIndex]);
    });
  }
}
