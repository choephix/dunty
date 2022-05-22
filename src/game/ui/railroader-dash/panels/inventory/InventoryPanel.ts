import { PageObjectManager } from "@sdk-pixi/ui-helpers/PageObjectManager";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { RailroaderDashPanelBase } from "../RailroaderDashPanelBase";
import { InventoryRedeemableItemsList } from "./InventoryRedeemableItemsList";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";

export enum InventorymSectionKey {
  Redeemables = "redeemables",
  Locomotives = "loco",
  Conductors = "conductor",
  RailCars = "lg-rc",
  Commodities = "commodities",
}

export class InventoryPanel extends RailroaderDashPanelBase {
  private title: Text = this.factory.createText("REDEEMABLES", { fontSize: 20 });
  private lastIcon?: Sprite;

  private readonly pageManager = new PageObjectManager(
    {
      [InventorymSectionKey.Redeemables]: () => {
        //// Add content
        const list = new InventoryRedeemableItemsList();
        list.position.set(210, 325);

        //// Set title
        this.title.text = "REDEEMABLES";
        return list;
      },
      [InventorymSectionKey.Locomotives]: () => {
        return new Container();
      },
      [InventorymSectionKey.Conductors]: () => {
        return new Container();
      },
      [InventorymSectionKey.RailCars]: () => {
        return new Container();
      },
      [InventorymSectionKey.Commodities]: () => {
        return new Container();
      },
    },
    this
  );

  async init(): Promise<void> {
    //// Add title
    this.addTitleImage("ui-railroader-dashboard/inventory/inventory-label.png");

    /// Tables background
    this.addListPad();

    //// Add tab icons
    const tabs = this.createTabs();
    tabs.position.set(210, 245);
    this.addChild(tabs);

    //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP ////
    //// Temporarily hiding the navigation tabs, until we have more than one page
    tabs.visible = false;
    //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP ////

    //// Add title
    this.title.anchor.set(0.5);
    this.title.position.set(485, 310);
    this.addChild(this.title);

    const textureId = "ui-railroader-dashboard/inventory/inv-infopanel-redeemable.png";
    const message =
      "The AMP contained within a Century Vial is used for CT Part Fusion and Composition boosts. You can also sell your AMP in the Railraoder Emporium.";
    this.addGreenPlaque({ textureId, message });

    this.pageManager.setCurrentPage(InventorymSectionKey.Redeemables);
  }

  createTabs() {
    const tabContainer = new Container();
    this.lastIcon = this.createTab("ui-railroader-dashboard/inventory/icons/redeemables.png", 0, 0, () => {
      this.pageManager.setCurrentPage(InventorymSectionKey.Redeemables);
    });
    tabContainer.addChild(this.lastIcon);
    tabContainer.addChild(
      this.createTab("ui-railroader-dashboard/inventory/icons/loco.png", 132.5, 0, () => {
        this.pageManager.setCurrentPage(InventorymSectionKey.Locomotives);
      })
    );
    tabContainer.addChild(
      this.createTab("ui-railroader-dashboard/inventory/icons/conductor.png", 265, 0, () => {
        this.pageManager.setCurrentPage(InventorymSectionKey.Conductors);
      })
    );
    tabContainer.addChild(
      this.createTab("ui-railroader-dashboard/inventory/icons/lg-rc.png", 400, 0, () => {
        this.pageManager.setCurrentPage(InventorymSectionKey.RailCars);
      })
    );
    tabContainer.addChild(
      this.createTab("ui-railroader-dashboard/inventory/icons/commodities.png", 535, 0, () => {
        this.pageManager.setCurrentPage(InventorymSectionKey.Commodities);
      })
    );
    this.lastIcon.alpha = 1;

    return tabContainer;
  }

  createTab(textureId: string, x: number, y: number, onClick: () => void) {
    const tabIcon = this.factory.createSprite(textureId, {
      x: x,
      y: y,
    });
    tabIcon.scale.set(0.65);
    buttonizeDisplayObject(tabIcon, () => {
      if (this.lastIcon) this.lastIcon.alpha = 0.5;
      tabIcon.alpha = 1;
      onClick();
      this.lastIcon = tabIcon;
    });
    tabIcon.alpha = 0.5;
    return tabIcon;
  }
}
