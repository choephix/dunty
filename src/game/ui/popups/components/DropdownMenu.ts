import { Container, IDestroyOptions } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { DropdownStyleOptions, DropdownMenuButton, defaultButtonStyles } from "./DropdownMenuButton";
import { Text } from "@pixi/text";
import { EventBus } from "@sdk/core/EventBus";

export interface DropdownMenuButtonOptions {
  text: string;
  disabled: boolean;
  onClick: () => unknown;
  style?: Partial<DropdownStyleOptions>;
}

export class DropdownMenu extends Container {
  events = new EventBus<{
    onItemClick: (buttonIndex: number) => unknown;
  }>();

  //add prop "style" as a button style options object, we will use it as "this.style" in the constructor
  style: DropdownStyleOptions;

  containerWidth: number;
  containerHeight: number;

  constructor(buttonOptions: DropdownMenuButtonOptions[], globalButtonStyle?: Partial<DropdownStyleOptions>) {
    super();

    //merge the default button style values with the "style" object passed in to the class inside the buttonObjects array,
    //we only need the first one in the array because a context menu needs AT LEAST one button but could have many more.
    //The styles on any buttons beyond buttonObject[0] should be the same so we just take the first styles object and assign
    //the resulting DropdownButtonStyleOptions to this.style
    this.style = { ...defaultButtonStyles, ...globalButtonStyle };
    let text = [];

    const menuContainer = new Container();
    //Get the text from each button and make it a Text instance to read the dimensions later
    for (let i = 0; i < buttonOptions.length; i++) {
      text[i] = new Text(buttonOptions[i].text);
    }
    //MAKE a button for each object in the buttonOptions array and place each subsequent button exactly one button height lower
    let buttons = [];

    const onMenuItemClick = (buttonIndex: number) => {
      buttonOptions[buttonIndex].onClick();
      this.events.dispatch("onItemClick", buttonIndex);
    };

    for (let i = 0; i < buttonOptions.length; i++) {
      this.style = { ...this.style, ...buttonOptions[i].style };
      buttons[i] = new DropdownMenuButton(
        text[i],
        buttonOptions[i].disabled,
        () => onMenuItemClick(i),
        this.style.boxWidth,
        this.style.boxHeight,
        this.style
      );
      buttons[i].y = this.style.boxHeight * i;
      menuContainer.addChild(buttons[i]);
    }

    let widths = [];
    const boxHeight = buttons[0].boxHeight;

    //Check each of the Text objects we made and return their width
    for (let i = 0; i < buttons.length; i++) {
      widths[i] = buttons[i].getTextWidth(text[i]);
    }
    //find which object has the largest width and return that width
    let newBoxWidth = widths.reduce(function (a, b) {
      return a > b ? a : b;
    });
    //if we have not passed in a hard width value, resize the buttons to be as wide as the longest Text plus left and right padding

    if (this.style.boxWidth === 100) {
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].setBoxSize(newBoxWidth + this.style.rightPadding + this.style.leftPadding, boxHeight);
      }
    }
    //SET CONTAINER SIZE FROM BUTTON DIMENSIONS
    const containerWidth = newBoxWidth + this.style.rightPadding + this.style.leftPadding;
    const containerHeight = buttonOptions.length * boxHeight;
    const menuBox = this.makeContextMenuBox(
      10,
      containerHeight,
      containerWidth,
      globalButtonStyle?.buttonBGColor ?? 0x000000
    );

    this.addChild(menuBox);
    menuBox.addChild(menuContainer);

    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
  }

  makeContextMenuBox(radius: number = 10, height: number, width: number, color: number = 0x000000): Graphics {
    const bg = new Graphics();
    bg.beginFill(color);
    bg.drawRoundedRect(0, 0, width, height, radius);
    return bg;
  }

  destroy(options?: boolean | IDestroyOptions): void {
    this.events.clear();
    super.destroy(options);
  }
}
