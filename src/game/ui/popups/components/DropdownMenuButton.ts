import { FontFamily } from "@game/constants/FontFamily";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { ITextStyle, Text } from "@pixi/text";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";

export interface DropdownStyleOptions {
  leftPadding: number; //inner distance from left side of menu container
  rightPadding: number; //inner distance from the right side of menu container
  boxWidth: number;
  boxHeight: number;
  buttonFontSize: number; //This determines text size and also affects button height dynamically
  buttonBGColor: number; //BG tint of buttons when enabled and not hovered over
  buttonHoverColor: number; //BG tint of button when cursor/pointer hovers over it
  buttonFontColor: number; //color of button font when not hovered over
  buttonDiabledColor: number; //BG of the button when it is not enabled/clickable
  buttonFontHover: number; //This is the color of the font when the cursor/pointer hovers over it
}

//Create default values for buttons
export const defaultButtonStyles: DropdownStyleOptions = {
  leftPadding: 10,
  rightPadding: 10,
  boxWidth: 100,
  boxHeight: 32,
  buttonFontSize: 24,
  buttonBGColor: 0x000454,
  buttonHoverColor: 0x0000f7,
  buttonFontColor: 0xffffff,
  buttonDiabledColor: 0x363868,
  buttonFontHover: 0x00ffff,
};

export class DropdownMenuButton extends Container {
  private _boxWidth: number;
  private _boxHeight: number;
  style: DropdownStyleOptions;
  box: Graphics;

  get boxWidth(): number {
    return this._boxWidth;
  }
  set boxWidth(value: number) {
    this._boxWidth = value;
  }
  get boxHeight(): number {
    return this._boxHeight;
  }
  set boxHeight(value: number) {
    this._boxHeight = value;
  }
  constructor(
    content: Text,
    disabled: boolean,
    onClick: () => unknown,
    width?: number,
    height?: number,
    style?: Partial<DropdownStyleOptions>
  ) {
    super();

    //merge the default button style values with the "style" object passed in to the class,
    //and assign the resulting ButtonStyleOptions to this.style
    this.style = { ...defaultButtonStyles, ...style };

    //override default Text values with our button style defaults
    const textStyle: Partial<ITextStyle> = {
      fontSize: this.style.buttonFontSize,
      fontFamily: FontFamily.Default,
      fill: this.style.buttonFontColor,
    };
    this._boxHeight = height!;
    this._boxWidth = width!;

    const buttonContainer = new Container();
    const text = content;
    text.style = textStyle;
    text.anchor.set(0, 0.5);
    this.box = this.makeContextMenuButton(text, disabled, 10, this.style, this.boxWidth, this.boxHeight);

    text.y += this.box.height / 2;
    text.x += this.style.leftPadding;

    this.box.interactive = true;

    if (disabled != true) {
      buttonizeDisplayObject(this.box, onClick);
      this.box
        .on("mouseover", () => {
          (text.style.fill = this.style.buttonFontHover), (this.box.tint = this.style.buttonHoverColor);
        })
        .on("mouseout", () => {
          (text.style.fill = this.style.buttonFontColor), (this.box.tint = this.style.buttonBGColor);
        });
    } else {
      text.alpha = 0.3;
    }

    buttonContainer.addChild(this.box);
    buttonContainer.addChild(text);

    this.addChild(buttonContainer);
  }

  makeContextMenuButton(
    text: Text,
    disabled: boolean,
    radius: number = 10,
    style: DropdownStyleOptions,
    width?: number,
    height?: number
  ): Graphics {
    const bg = new Graphics();
    if (disabled != true) {
      bg.beginFill(0xffffff);
      bg.tint = style.buttonBGColor;
      bg.drawRoundedRect(
        0,
        0,
        this.boxWidth != 100 ? this.boxWidth : text.width + this.style.rightPadding + this.style.leftPadding,
        this.boxHeight,
        radius
      );
    } else {
      bg.beginFill(style.buttonDiabledColor);
      bg.drawRoundedRect(
        0,
        0,
        this.boxWidth != 100 ? this.boxWidth : text.width + this.style.rightPadding + this.style.leftPadding,
        this.boxHeight,
        radius
      );
    }
    return bg;
  }

  setBoxSize(width: number, height: number) {
    this.box.width = width;
    this.box.height = height;
  }

  getTextWidth(text: Text) {
    return text.width;
  }
}
