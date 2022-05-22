import { SimpleObjectsFactory } from "@game/app/components/SimpleObjectsFactory";
import { GameSingletons } from "@game/app/GameSingletons";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";

export class UnderlinedTabButton extends Container {
  private readonly factory: SimpleObjectsFactory = GameSingletons.getSimpleObjectFactory();
  private activeUnderline: Graphics;
  private inactiveUnderline: Graphics;
  constructor(label: string, extraWidth: number = 10) {
    super();
    const name = this.factory.createText(label.toUpperCase(), { fontSize: 24 });
    this.addChild(name);
    this.inactiveUnderline = this.createUnderline(0x505050, name.width + extraWidth, name.height + 2, extraWidth);
    this.addChild(this.inactiveUnderline);
    this.activeUnderline = this.createUnderline(0x00ffff, name.width + extraWidth, name.height + 2, extraWidth);
    this.activeUnderline.visible = false;
    this.addChild(this.activeUnderline);
  }

  createUnderline(color: number, width: number, y: number, offset: number) {
    const underline = new Graphics();
    underline.lineStyle(8, color);
    underline.moveTo(-offset, y);
    underline.lineTo(width, y);
    return underline;
  }

  setHighlighted(highlight: boolean) {
    this.inactiveUnderline.visible = !highlight;
    this.activeUnderline.visible = highlight;
  }
}
