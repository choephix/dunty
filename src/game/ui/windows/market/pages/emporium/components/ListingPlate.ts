import { GameSingletons } from "@game/app/GameSingletons";
import { FontIcon } from "@game/constants/FontIcon";
import { getRarityColors } from "@game/constants/RarityColors";
import { ThemeColors } from "@game/constants/ThemeColors";
import { Container } from "@pixi/display";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { formatToMaxDecimals } from "@sdk-ui/utils/formatToMaxDecimals";
import { EmporiumStoreItemData } from "../data/EmporiumStoreItemData.model";
import { ListingPlateContent } from "./ListingPlateContent";

export class ListingPlate extends Container {
  private readonly assets = GameSingletons.getResources();
  private readonly simpleFactory = GameSingletons.getSimpleObjectFactory();

  private infoPanel: ListingPlateContent = new ListingPlateContent();
  private clicked: boolean = false;
  private info: Record<string, string> = {};

  public onPurchaseClick: () => void = () => {};

  constructor() {
    super();

    this.infoPanel.scale.set(0.5);
    this.infoPanel.position.set(25, 25);
    this.addChild(this.infoPanel);
  }

  private onInfoClick() {
    if (!this.clicked) {
      this.infoPanel.showLastChild(false);
      this.infoPanel.setInfo(this.info);
    } else {
      this.infoPanel.clearLastChild();
      this.infoPanel.showLastChild(true);
    }
  }

  addBackground(tint: number) {
    //// Add background
    const bg = this.simpleFactory.createSprite("ui-market-window-emporium/buy/item-assets/base.png");
    this.addChild(bg);
    this.setChildIndex(bg, 0);

    const outlineTextureId = "ui-market-window-emporium/buy/item-assets/item-outline.png";
    const outline = this.simpleFactory.createSprite(outlineTextureId);
    outline.tint = tint;
    outline.scale.set(0.99);
    this.addChild(outline);
    this.setChildIndex(outline, 1);
  }

  addCostPlaque(cost: string) {
    //// Add plaque
    const plaque = this.simpleFactory.createSprite("ui-market-window-emporium/buy/item-assets/tocium-cost.png", {
      x: 174.735,
      y: 375,
    });
    plaque.anchor.set(0.5);
    this.addChild(plaque);

    //// Add price
    const price = this.simpleFactory.createText(`${FontIcon.Tocium} ` + cost, {}, { x: 0, y: 0 });
    price.anchor.set(0.5);
    plaque.addChild(price);
  }

  private addButton(
    btnTexture: string,
    btnX: number,
    btnY: number,
    calledFunction: () => void,
    labelName: string,
    clickedTexture: string,
    clickedLabelColor: number = 0xffffff,
    isToggle: boolean = false
  ) {
    //// Create button
    const button = this.simpleFactory.createSprite(btnTexture, { x: btnX, y: btnY });
    this.addChild(button);
    button.interactive = true;
    button.buttonMode = true;

    //// Create label
    const label = this.simpleFactory.createText(labelName.toUpperCase(), { fontSize: 24 }, { x: 78.5, y: 40 });
    label.anchor.set(0.5);
    button.addChild(label);
    this.addChild(button);

    //// Add button events and texture switch
    buttonizeDisplayObject(button, () => {
      calledFunction();

      if (!isToggle) return;

      if (this.clicked) {
        button.texture = this.assets.getTexture(btnTexture);
        label.tint = 0xffffff;
      } else {
        button.texture = this.assets.getTexture(clickedTexture);
        label.tint = clickedLabelColor;
      }
      this.clicked = !this.clicked;
    });
    return button;
  }

  addInfoButton(infoData: Record<string, string>) {
    this.info = infoData;
    this.addButton(
      "ui-market-window-emporium/buy/item-assets/btn-l.png",
      17.5,
      265,
      () => this.onInfoClick(),
      "info",
      "ui-market-window-emporium/buy/item-assets/btn-clicked.png",
      ThemeColors.HIGHLIGHT_COLOR.toInt(),
      true
    );
  }

  addBuyButton(onClick: () => void) {
    this.addButton(
      "ui-market-window-emporium/buy/item-assets/btn-r.png",
      175,
      265,
      onClick,
      "buy",
      "ui-market-window-emporium/buy/item-assets/btn-r.png"
    );
  }

  addPartThumbnail(imgUrl: string, rarity: string, partName: string) {
    this.infoPanel.setPartThumbnail(imgUrl, rarity, partName);
  }

  addVialThumbnail(level: number) {
    this.infoPanel.setVialThumbnail(level);
  }

  addModifyButton(onClick: () => void) {
    const btn = this.addButton(
      "ui-market-window-emporium/buy/item-assets/btn-l.png",
      17.5,
      265,
      onClick,
      "modify",
      "ui-market-window-emporium/buy/item-assets/btn-l.png"
    );
    btn.tint = ThemeColors.WARNING_COLOR.toInt();
  }

  addCancelButton(onClick: () => void) {
    const btn = this.addButton(
      "ui-market-window-emporium/buy/item-assets/btn-r.png",
      175,
      265,
      onClick,
      "cancel",
      "ui-market-window-emporium/buy/item-assets/btn-r.png"
    );
    btn.tint = ThemeColors.DANGER_COLOR.toInt();
  }
}

export module ListingPlate {
  function getRarityFromItemData(itemData: EmporiumStoreItemData) {
    if (itemData.type == "part") return itemData.ctPartData.rarity;
    if (itemData.type == "amp") return itemData.centuryVialData.rarity;
    throw new Error("Unknown item type");
  }

  export function createMyListedItem(
    itemData: EmporiumStoreItemData,
    onClickModify: () => unknown,
    onClickCancel: () => unknown
  ) {
    const itemPanel: ListingPlate = new ListingPlate();

    const rarity = getRarityFromItemData(itemData);
    const tint = getRarityColors(rarity).main.toInt();
    itemPanel.addBackground(tint);

    if (itemData.type == "part") {
      itemPanel.addPartThumbnail(itemData.ctPartData.imgUrl, itemData.ctPartData.rarity, itemData.ctPartData.part);
    } else if (itemData.type == "amp") {
      itemPanel.addVialThumbnail(itemData.centuryVialData.level);
    }

    itemPanel.addCostPlaque(formatToMaxDecimals(itemData.price, 4, true).toUpperCase());

    itemPanel.addModifyButton(onClickModify);
    itemPanel.addCancelButton(onClickCancel);

    return itemPanel;
  }

  export function createPurchaseableItem(itemData: EmporiumStoreItemData, onPurchaseClick: () => unknown) {
    const itemPanel: ListingPlate = new ListingPlate();

    const rarity = getRarityFromItemData(itemData);
    const tint = getRarityColors(rarity).main.toInt();
    itemPanel.addBackground(tint);

    if (itemData.type == "part") {
      itemPanel.addPartThumbnail(itemData.ctPartData.imgUrl, itemData.ctPartData.rarity, itemData.ctPartData.part);
    }
    if (itemData.type == "amp") {
      itemPanel.addVialThumbnail(itemData.centuryVialData.level);
    }
    itemPanel.addCostPlaque(formatToMaxDecimals(itemData.price, 4, true).toUpperCase());

    itemPanel.addInfoButton({ name: itemData.name, type: itemData.type, railroader: itemData.railroader });
    itemPanel.addBuyButton(onPurchaseClick);

    return itemPanel;
  }
}
