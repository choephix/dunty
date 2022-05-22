import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { Point } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";

const onHoverTint = 0x00ffff;

export class StationPopupDropdownComponent extends Container {
  private readonly assets = GameSingletons.getResources();

  dropDownBar: Sprite;
  items: {
    label: string;
    value: number;
  }[];
  selectionContainer: Container = new Container();
  currentSelected: Container = new Container();
  arrow: Container;
  selectionIsOpen: boolean = false;

  constructor(
    dropdownData: { text: string }[],
    onChoose: (selectedIndex: number) => void,
    initialSelectedValueW: number = 0,
    textureId: string = "ui-station-dashboard/chart-elements/Dropdown-bg.png"
  ) {
    super();

    this.interactive = true;
    this.buttonMode = true;

    //button background
    this.dropDownBar = new Sprite(this.assets.getTexture(textureId));
    this.addChild(this.dropDownBar);
    //arrow
    this.arrow = this.makeToolTipArrow();
    this.arrow.position.set(0, this.y + (this.dropDownBar.height / 2) * 1.25);
    this.addChild(this.arrow);

    this.items = dropdownData.map((obj, index) => {
      return {
        label: obj.text,
        value: index,
      };
    });

    this.setFirstSelection(initialSelectedValueW, onChoose);
  }

  setFirstSelection(initValue: number, onSelectionChange: (selectedIndex: number) => void) {
    this.interactive = true;
    //set initial text
    this.setCurrentSelectedOption(this.items[initValue], this.onChildrenChange);
    this.addChild(this.currentSelected);
    buttonizeDisplayObject(this, () => {
      if (this.selectionIsOpen) {
        this.selectionIsOpen = false;
      } else {
        this.selectionIsOpen = true;
        this.createNewSelection(this.items, initValue, onSelectionChange);
      }
    });
  }

  createTextBox(label: string, value: number, onSelectionChange?: (selectedIndex: number) => void) {
    const container = new Container();
    container.interactive = true;
    const text = new Text(label, {
      fontFamily: FontFamily.Default,
      fill: 0xffffff,
      fontSize: 20,
    });

    container.addChild(text);
    if (onSelectionChange == undefined) {
      throw new Error("No onSelection function found");
    }

    buttonizeDisplayObject(container, () => {
      this.arrow.visible = true;
      if (container == this.currentSelected) {
        this.deselectDropdown();
      } else {
        onSelectionChange(value);
      }
    });

    return container;
  }

  createNewSelection(
    items: {
      label: string;
      value: number;
    }[],
    skipIndex: number,
    onSelectionChange?: (selectedIndex: number) => void
  ) {
    if (this.selectionContainer) {
      this.selectionContainer.destroy();
    }
    this.selectionContainer = new Container();
    //selection bg
    const selectionBG = new Graphics();
    selectionBG.beginFill(0x000000);
    this.selectionContainer.addChild(selectionBG);

    this.arrow.visible = false;
    let startX = this.dropDownBar.x + this.dropDownBar.width / 2;
    let startY = this.dropDownBar.y + (this.children[1] as Text).height * 1.5;
    //add all items except the current selected one
    for (let i = 0; i < items.length; i++) {
      const text = this.createTextBox(this.items[i].label, this.items[i].value, onSelectionChange);
      (text.children[0] as Text).anchor.set(0.5, 0);
      text.scale.set(1.9);
      text.position.set(startX, startY + (text as Text).height * 1.5);
      this.selectionContainer.addChild(text);
      startY += (text as Text).height * 1.35;
      //add tint on hover
      text.on("mouseover", () => {
        (text.children[0] as Text).tint = onHoverTint;
      });

      text.on("mouseout", () => {
        (text.children[0] as Text).tint = 0xffffff;
      });

      if (i == skipIndex) {
        this.setCurrentSelectedOption(this.items[i], onSelectionChange);
      }
    }
    //draw bg
    selectionBG.drawRect(
      this.dropDownBar.x,
      this.dropDownBar.y + this.dropDownBar.height,
      this.dropDownBar.x + this.dropDownBar.width,
      startY
    );
    selectionBG.endFill();

    this.addChild(this.selectionContainer);
  }

  setCurrentSelectedOption(
    item: {
      label: string;
      value: number;
    },
    onSelectionChange?: (selectedIndex: number) => void
  ) {
    this.currentSelected.destroy();
    this.currentSelected = this.createTextBox(item.label, item.value, onSelectionChange);
    (this.currentSelected.children[0] as Text).anchor.set(0.5, 0);
    this.currentSelected.scale.set(1.9);
    this.currentSelected.position.set(
      this.dropDownBar.x + this.dropDownBar.width / 2,
      this.dropDownBar.y + (this.currentSelected.children[0] as Text).height * 0.65
    );
    this.addChild(this.currentSelected);
    this.arrow.position.x =
      (this.currentSelected.children[0] as Text).position.x +
      (this.currentSelected.children[0] as Text).width +
      this.arrow.width * 1.1;
  }

  deselectDropdown() {
    /**
     * We don't want to loop through the children array
     * while also at the same time modifying it, so we're
     * making a copy here, and we'll loop over that.
     *
     * Additionally, we're filtering out any children that
     * should be persistent between clear calls.
     */
    const children = [...this.selectionContainer.children];
    for (const child of children) {
      /**
       * The only exception is the background, which we
       * don't want to destroy. A popup can change its
       * background texture but can never exist without
       * a background.
       */
      child.destroy({ children: true });
    }
  }

  makeToolTipArrow(color: number = 0xffffff): Container {
    const arrowContainer = new Container();
    const arr = new Graphics();
    arr.beginFill(color);
    arr.drawPolygon([
      new Point(this.width / 2, 0),
      new Point(this.width / 2 - 20, -20),
      new Point(this.width / 2 + 20, -20),
    ]);
    arrowContainer.addChild(arr);
    return arrowContainer;
  }
}
