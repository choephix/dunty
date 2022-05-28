import { FontFamily } from "@client/display/constants/FontFamily";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { Point } from "@pixi/math";
import { Text } from "@pixi/text";
import { LiteralUnion } from "type-fest";

export type ToolTipComponentHorizontalAlignment = LiteralUnion<-1 | 0 | 1, number>;
export type ToolTipComponentVerticalAlignment = 1 | 0 | -1;

const paddingX = 30;
const paddingY = 10;

const arrowWidth = 50;
const arrowHeight = 20;

const boxRadius = 0;
const boxColor = 0xf9f9f9;
const textColor = 0x203040;
const textStrokeColor = 0xFfFfFf;

export class ToolTipComponent extends Container {
  private readonly text: Text;
  private readonly box: Graphics;
  private readonly arrow?: Graphics;

  constructor(
    content: string,
    horizontalAlignment: ToolTipComponentHorizontalAlignment,
    verticalAlignment: ToolTipComponentVerticalAlignment,
    wordWrapWidth?: number
  ) {
    super();

    this.text = new Text(content, {
      fontFamily: FontFamily.Tooltips,
      fontWeight: "bold",
      fontSize: 32,
      fill: textColor,
      wordWrapWidth,
      wordWrap: wordWrapWidth !== undefined,
      // stroke: textStrokeColor,
      // strokeThickness: 2,
    });
    this.text.anchor.set(0.5, 0.5);

    const boxWidth = this.text.width + paddingX + paddingX;
    const boxHeight = this.text.height + paddingY + paddingY;

    this.box = this.drawBox(boxWidth, boxHeight);

    const PIVOT_X = 0.5 * boxWidth * horizontalAlignment;
    const PIVOT_Y = -0.5 * boxHeight * verticalAlignment - verticalAlignment * arrowHeight;

    if (verticalAlignment) {
      this.arrow = this.drawArrow(horizontalAlignment, verticalAlignment > 0);
      this.arrow.position.set(PIVOT_X, PIVOT_Y);
      this.addChild(this.arrow);
    }

    this.addChild(this.box, this.text);

    this.pivot.set(PIVOT_X, PIVOT_Y);
  }

  drawBox(width: number, height: number): Graphics {
    const bg = new Graphics();
    bg.beginFill(boxColor);
    bg.drawRoundedRect(-width / 2, -height / 2, width, height, boxRadius);
    return bg;
  }

  /**
   * Draws an arrow pointing out of the bubble.
   *
   * @param pointAlignment -1 to 1.
   * @param pointingUp true or false
   */
  drawArrow(pointAlignment: number, pointingUp: boolean): Graphics {
    const x1 = -pointAlignment * 0.5 - 0.5;
    const x2 = -pointAlignment * 0.5 + 0.5;
    const v = pointingUp ? -1 : 1;
    const w = (arrowWidth * (arrowHeight + boxRadius)) / arrowHeight;

    const arr = new Graphics();
    arr.beginFill(boxColor);
    arr.drawPolygon([
      new Point(0.0, 0.0),
      new Point(x1 * w, -(arrowHeight + boxRadius) * v),
      new Point(x2 * w, -(arrowHeight + boxRadius) * v),
    ]);
    return arr;
  }
}
