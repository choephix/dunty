import { __window__ } from "@debug";
import { drawRect } from "@debug/utils/drawRect";
import { makeDraggable } from "@debug/utils/makeDraggable";
import { GameSingletons } from "@game/app/GameSingletons";
import { Dropdown, DropdownStyle } from "@game/ui/components/Dropdown";
import { Container } from "@pixi/display";
import { arrangeInStraightLine } from "@sdk-pixi/layout/arrangeInStraightLine";
import { NavigationTabsManager } from "@sdk-pixi/ui-helpers/NavigationTabsManager";
import { iterateObjectProperties } from "@sdk/helpers/objects";
import { ItemTypeFilterButton } from "./ItemTypeFilterButton";

export type ItemTypeFilterKey = "all" | "amp" | "part";
export type ItemOrderKey = "amount" | "price" | "newest";

/**
 * EmporiumToolbar takes in a string of: "buy", "sell", "listing" to determine what set of toolbar buttons to create and add
 */
export class EmporiumToolbar extends Container {
  private readonly context = GameSingletons.getGameContext();

  public boxWidth = 1975;
  public boxHeight = 85;

  public itemTypeFilterTabs;

  //////////// CALLBACK REFS /////////////

  onItemTypeFilterSelected?: (itemType: ItemTypeFilterKey) => unknown;

  onRaritySelect?: (rarity: string) => unknown;

  onSortSelect?: (sortType: ItemOrderKey) => unknown;

  ////////////////////////////////////////

  constructor(buttonOptions: string) {
    super();

    if (buttonOptions == "buy" || buttonOptions == "listing") {
      this.itemTypeFilterTabs = this.createItemFilterButtons(true);
      this.addChild(this.itemTypeFilterTabs);

      // const rarityDropdown = this.createRarityDropdown({
      //   ...EmporiumToolbar.defaultDropdownStyleOptions,
      //   boxTextureId: "ui-market-window-emporium/item-filter-btn-sm.png",
      //   width: 240,
      // });
      // this.addChild(rarityDropdown);

      const sortDropdown = this.createSortDropdown({
        ...EmporiumToolbar.defaultDropdownStyleOptions,
        width: 300,
      });
      this.addChild(sortDropdown);
    } else if (buttonOptions == "sell") {
      this.itemTypeFilterTabs = this.createItemFilterButtons(false);
      this.addChild(this.itemTypeFilterTabs);
    }

    // drawRect(this, { width: this.boxWidth, height: this.boxHeight });

    this.position.set(200, 240);
  }

  createItemFilterButtons(includeAllButton: boolean) {
    const filterButtonContainer = new Container();

    function createAllButton() {
      const button = new ItemTypeFilterButton();
      button.setInnerContentAsText(`ALL`);
      return button;
    }

    function createCenturyVialsButton() {
      const button = new ItemTypeFilterButton();
      button.setInnerContentAsSprite("ui-market-window-emporium/buy/filter-assets/cv-light.png");
      return button;
    }

    function createCenturyTrainPartsButton() {
      const button = new ItemTypeFilterButton();
      button.setInnerContentAsSprite("ui-market-window-emporium/buy/filter-assets/ct-light.png");
      return button;
    }

    const buttonsMap = {
      all: includeAllButton ? createAllButton() : null,
      amp: createCenturyVialsButton(),
      part: createCenturyTrainPartsButton(),
    };

    //// Object.values(object) returns an iterable (something that can be looped over, but not necessarily an array) of the values of the object.
    //// [...iterable] or Array.from(iterable) turns an iterable into an array.
    //// array.filter(item => item != null) removes null values from the array.
    ////
    //// The whole line below is equivalent to:
    ////
    //// const buttons = new Array<ItemFilterButton>();
    //// for (const key in buttonsMap) {
    ////   if (buttonsMap[key]) buttons.push(buttonsMap[key]);
    //// }
    const buttons = Array.from(Object.values(buttonsMap)).filter(button => button != null) as ItemTypeFilterButton[];

    filterButtonContainer.addChild(...buttons);
    arrangeInStraightLine(buttons, { spacing: 6 });

    //// The line below is the same as writing `= "all" | "vials" | "parts"`
    //// but this way the possible values are taken dynamically from the keys of the buttonsMap object.
    type TabKey = keyof typeof buttonsMap;
    const tabConfigs = new Array<{ displayObject: ItemTypeFilterButton; value: TabKey }>();
    for (const [key, button] of Object.entries(buttonsMap)) {
      if (button == null) continue;
      tabConfigs.push({ displayObject: button, value: key as TabKey });
    }

    const tabsManager = new NavigationTabsManager(tabConfigs, {
      setSelected(tab, selected) {
        tab.setHighlighted(selected);
      },
      setHovered(tab, hovered) {
        tab.setHovered(hovered);
      },
      setPressed(tab, pressed) {
        tab.setPressed(pressed);
      },
    });
    tabsManager.onSelectionChange = key => {
      this.onItemTypeFilterSelected?.(key);
    };

    filterButtonContainer.position.x = 800;

    return Object.assign(filterButtonContainer, { manager: tabsManager });
  }

  createRarityDropdown(dropdownStyleOptions: Partial<DropdownStyle>) {
    const rarityOptions = [
      { text: "All", value: "all" },
      { text: "Common", value: "common" },
      { text: "Uncommon", value: "uncommon" },
      { text: "Rare", value: "rare" },
      { text: "Epic", value: "epic" },
      { text: "Legendary", value: "legendary" },
      { text: "Mythic", value: "mythic" },
    ];

    const rarityDropdown = new Dropdown(rarityOptions, dropdownStyleOptions);
    rarityDropdown.position.x = 1425;
    rarityDropdown.onOptionSelected = value => {
      this.onRaritySelect?.(value);
    };

    return rarityDropdown;
  }

  createSortDropdown(dropdownStyleOptions: Partial<DropdownStyle>) {
    const sortOptions = [
      { text: "Newest", value: "newest" },
      { text: "Price", value: "price" },
      { text: "Amount", value: "amount" },
    ];

    const sortDropdown = new Dropdown(sortOptions, dropdownStyleOptions);
    sortDropdown.position.x = 1675;
    sortDropdown.onOptionSelected = value => {
      this.onSortSelect?.(value);
    };

    return sortDropdown;
  }
}

export module EmporiumToolbar {
  export const defaultDropdownStyleOptions: Partial<DropdownStyle> = {
    boxTextureId: "ui-market-window-emporium/buy/filter-assets/lg-filterbg.png",
    boxTextureNineSlicing: 21,
    boxPadding: 21,
    labelPadding: [5, 5, 5, 15],
    horizontalAlignment: 0.5,
    height: 85,
    labelTint: 0x00ffff,
    labelHoverTint: 0xffffff,
    labelStyle: { fontSize: 30 },
    optionsOffset: [0, 2],
    optionsStyle: {
      boxTextureId: "ui-market-window-emporium/buy/filter-assets/lg-filterbg.png",
      boxTextureNineSlicing: 21,
      boxPadding: 21,
      horizontalAlignment: 0.5,
      labelPadding: [5, 15],
      labelTint: 0x00ffff,
      labelHoverTint: 0xffffff,
      labelStyle: {
        fontSize: 30,
      },
    },
  };
}
