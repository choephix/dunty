import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { Dropdown, DropdownOptionParams } from "@game/ui/components/Dropdown";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { PageObjectManager } from "@sdk-pixi/ui-helpers/PageObjectManager";
import { EmporiumStoreItemData } from "./data/EmporiumStoreItemData.model";
import { EmporiumBuySection } from "./sections/EmporiumBuySection";
import { EmporiumMyListingItemSection } from "./sections/EmporiumMyListingItemSection";
import { EmporiumMyListingSection } from "./sections/EmporiumMyListingSection";
import { EmporiumSellSection } from "./sections/EmporiumSellSection";
import { EmporiumToolbar } from "./toolbar/EmporiumToolbar";

export enum EmporiumSectionKey {
  Buy = "buy",
  Sell = "sell",
  MyListing = "myListing",
  MyListingItem = "myListingItem",
}

export class EmporiumPage extends EnchantedContainer {
  private readonly assets = GameSingletons.getResources();
  private readonly simpleFactory = GameSingletons.getSimpleObjectFactory();

  public readonly titleString = "Railroader Emporium";

  private readonly betaText = new Text("(Beta)", { fontFamily: FontFamily.Default, fill: 0x15f4ee });

  private readonly sectionBackground = this.addSubpageBackground();
  private readonly sectionSelectionDropdown = this.addSubpageSelectionDropdown();
  private toolbar: EmporiumToolbar | null = null;

  private lastPage?: EmporiumSectionKey;
  private selectedItem: EmporiumStoreItemData | null = null;
  private modifyExistingItem: boolean = false;

  private readonly pageManager = new PageObjectManager(
    {
      [EmporiumSectionKey.Buy]: () => {
        this.lastPage = EmporiumSectionKey.Buy;

        const section = new EmporiumBuySection();
        return section;
      },
      [EmporiumSectionKey.Sell]: () => {
        this.lastPage = EmporiumSectionKey.Sell;

        const section = new EmporiumSellSection();
        section.onItemSell = (item: EmporiumStoreItemData) => {
          this.selectedItem = item;
          this.modifyExistingItem = false;
          this.pageManager.setCurrentPage(EmporiumSectionKey.MyListingItem);
        };
        return section;
      },
      [EmporiumSectionKey.MyListing]: () => {
        this.lastPage = EmporiumSectionKey.MyListing;

        const section = new EmporiumMyListingSection();
        section.onItemSelected = (item: EmporiumStoreItemData) => {
          this.selectedItem = item;
          this.modifyExistingItem = true;
          this.pageManager.setCurrentPage(EmporiumSectionKey.MyListingItem);
        };
        return section;
      },
      [EmporiumSectionKey.MyListingItem]: () => {
        if (this.selectedItem == null) throw new Error("No selected item");
        const goBack = this.goBack.bind(this);

        const section = new EmporiumMyListingItemSection(this.selectedItem, this.modifyExistingItem);
        const backButton = this.__createBackArrow();
        section.addChild(backButton);

        section.goBack = goBack;
        buttonizeDisplayObject(backButton, goBack);

        return section;
      },
    },
    this
  );

  goBack() {
    if (!this.lastPage) return;
    this.pageManager.setCurrentPage(this.lastPage);
  }

  async loadAndInitialize(initialSubpage: EmporiumSectionKey = EmporiumSectionKey.Buy) {
    const betaText = new Text("(Beta)", { fontFamily: FontFamily.Default, fill: 0x15f4ee });
    betaText.position.set(840, 130);
    this.addChild(betaText);

    this.sectionSelectionDropdown.setCurrentSelection(initialSubpage);

    this.pageManager.events.on({
      beforeChange: subpageKey => {
        if (this.toolbar != null) {
          this.removeFilterBar();
        }

        if (subpageKey == EmporiumSectionKey.MyListing) {
          // this.toolbar = new EmporiumToolbar("listing");
        } else if (subpageKey == EmporiumSectionKey.Sell) {
          // this.toolbar = new EmporiumToolbar("sell");
        } else if (subpageKey == EmporiumSectionKey.Buy) {
          this.toolbar = new EmporiumToolbar("buy");

          this.toolbar.onItemTypeFilterSelected = type => {
            const page = this.pageManager.currentPage as EmporiumBuySection | null;
            if (page) {
              page.dataFilters.itemType = type === "all" ? null : type;
              page.reloadList();
            }
          };

          this.toolbar.onSortSelect = order => {
            const page = this.pageManager.currentPage as EmporiumBuySection | null;
            if (page) {
              page.dataFilters.order = order;
              page.reloadList();
            }
          };

          this.toolbar.itemTypeFilterTabs?.manager.setSelectedValue("all");
        }

        if (this.toolbar != null) {
          this.addChild(this.toolbar);
          this.toolbar.zIndex = 10;
        }

        this.sortChildren();
      },
      afterChange: () => {
        this.sortChildren();
      },
    });
    this.pageManager.setCurrentPage(initialSubpage);
  }

  addSubpageBackground() {
    const background = this.simpleFactory.createSprite("ui-market-window-ct-parts/list-background.png");
    background.position.set(200, 350);
    background.scale.set(2.68, 2);
    return this.addChild(background);
  }

  addSubpageSelectionDropdown(initialSelection: EmporiumSectionKey = EmporiumSectionKey.Buy) {
    const dropdownOptions: DropdownOptionParams<EmporiumSectionKey>[] = [
      { text: "Buy", value: EmporiumSectionKey.Buy },
      { text: "Sell", value: EmporiumSectionKey.Sell },
      { text: "My Listings", value: EmporiumSectionKey.MyListing },
    ];
    const dropdown = new Dropdown(
      dropdownOptions,
      { ...EmporiumToolbar.defaultDropdownStyleOptions },
      initialSelection
    );

    dropdown.position.set(200, 240);
    dropdown.zIndex = 99;
    dropdown.onOptionSelected = (subpageKey: EmporiumSectionKey) => {
      this.pageManager.setCurrentPage(subpageKey);
    };
    return this.addChild(dropdown);
  }

  removeFilterBar() {
    this.toolbar?.destroy();
    this.toolbar = null;
  }

  protected __createBackArrow() {
    const textureId = "ui-station-dashboard/staking/manage-tab/manage-home/btn-back.png";
    const texture = this.assets.getTexture(textureId);
    const sprite = new Sprite(texture);
    sprite.addChild(sprite);
    sprite.position.set(250, 725);
    sprite.interactive = true;
    sprite.buttonMode = true;
    return sprite;
  }
}
