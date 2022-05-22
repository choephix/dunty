import { FontFamily } from "@game/constants/FontFamily";
import { Texture } from "@pixi/core";
import { Container, IDestroyOptions } from "@pixi/display";
import { Point } from "@pixi/math";
import { NineSlicePlane } from "@pixi/mesh-extras";
import { Text } from "@pixi/text";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";

export class DashboardButton extends Container {
  public readonly padding = new Point(20, 10);
  public readonly label: Text;

  constructor(
    padTexture: string | Texture,
    labelText: string,
    width?: number,
    height?: number,
    public onClick?: () => unknown
  ) {
    super();

    if (typeof padTexture === "string") {
      padTexture = Texture.from(padTexture);
    }

    const pad = new NineSlicePlane(padTexture, 15, 15, 15, 15);

    this.label = new Text(labelText, {
      fill: 0xffffff,
      fontSize: 12,
      fontFamily: FontFamily.Default,
    });
    this.label.updateText(false);

    width ??= this.label.width + this.padding.x * 2;
    height ??= this.label.height + this.padding.y * 2;

    pad.scale.set(0.5, 0.5);
    pad.width = 2 * width;
    pad.height = 2 * height;

    buttonizeDisplayObject(pad, () => this.onClick?.());

    this.label.anchor.set(0.5, 0.5);
    this.label.position.set(pad.width / 4, pad.height / 4);

    this.addChild(pad, this.label);
  }

  setLabelText(text: string): void {
    this.label.text = text;
    this.label.updateText(false);
  }

  destroy(options?: boolean | IDestroyOptions): void {
    delete this.onClick;
    super.destroy(options);
  }
}
