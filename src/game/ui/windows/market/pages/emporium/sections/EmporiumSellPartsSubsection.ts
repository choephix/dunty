import { GameSingletons } from "@game/app/GameSingletons";
import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { SafeScrollbox } from "@sdk-pixi/display/SafeScrollbox";
import { SellCtPartItemPanel } from "../components/SellCtPartItemPanel";
import { EmporiumStoreItemData, EmporiumStoreItemData_CTPart } from "../data/EmporiumStoreItemData.model";
import { EmporiumDataService } from "../EmporiumDataService";

export class SellPartsSubsection extends SafeScrollbox {
  private readonly dataService: EmporiumDataService = new EmporiumDataService();

  public onItemSell?: (item: EmporiumStoreItemData) => void = () => {};

  constructor() {
    super({
      noTicker: true,
      boxWidth: 1950,
      boxHeight: 735,
      stopPropagation: true,
      divWheel: GameSingletons.getGameContext().app.view,
      overflowX: "none",
    });
    this.position.set(200, 355);
    this.loadAndInit();
  }

  async loadAndInit() {
    const data = await this.dataService.getMyInventoryParts();
    this.init(data);
  }

  async reloadList() {
    this.clear();
    this.loadAndInit();
  }

  // async load() {
  //   return await this.dataService.getMyInventoryParts();
  // }

  // async reloadList() {
  //   this.clear();
  //   this.init(await this.load());
  // }

  async init(data: Array<EmporiumStoreItemData_CTPart>) {
    let x: number = 125;
    let y: number = 25;
    for (const [index, element] of data.entries()) {
      if (element.type != "part") return;
      const panel = this.addCtParts(element);
      panel.position.set(x, y);
      this.content.addChild(panel);
      x += 350;
      if ((index + 1) % 5 == 0) {
        y += 500;
        x = 125;
      }
    }

    this.content.addChild(this.addInvisibleBox(736));
    this.update();
  }

  addCtParts(part: EmporiumStoreItemData_CTPart) {
    const ctPanel = new SellCtPartItemPanel();
    ctPanel.addBackground(part.ctPartData.rarity, part.inventoryCount);
    ctPanel.addNamePlaque(part.name, part.ctPartData.rarity);
    ctPanel.addSellPlaque(part.ctPartData.rarity, async () => {
      this.onItemSell?.(part);
    });
    ctPanel.setPartThumbnail(part.ctPartData.imgUrl);
    ctPanel.scale.set(0.75);
    return ctPanel;
  }

  addInvisibleBox(px: number) {
    const box = new Sprite(Texture.EMPTY);
    box.width = this.boxWidth + 1;
    box.height = px;
    return box;
  }

  clear() {
    const children = [...this.content.children];
    for (const child of children) {
      child.destroy({ children: true });
    }
    this.content.addChild(this.addInvisibleBox(426));
  }

  /*
  //// Add fuel tank
    const fuelTank = this.addCtParts(
      "uncommon",
      "FUEL TANK",
      "ui-market-window-ct-parts/part-icons/5-fuel-tank.png",
      "2"
    );
    fuelTank.position.set(250, 500);
    this.addChild(fuelTank);
    //// Add alternator
    const alternator = this.addCtParts(
      "rare",
      "ALTERNATOR",
      "ui-market-window-ct-parts/part-icons/9-main-alternator.png",
      "2"
    );
    alternator.position.set(636, 500);
    this.addChild(alternator);
    //// Add wheels
    const wheels = this.addCtParts("epic", "WHEELS", "ui-market-window-ct-parts/part-icons/10-wheels.png", "2");
    wheels.position.set(1022, 500);
    this.addChild(wheels);
    //// Add auxiliary alternator
    const auxAlternator = this.addCtParts(
      "legendary",
      "AUXILIARY ALTERNATOR",
      "ui-market-window-ct-parts/part-icons/14-auxiliary-alternator.png",
      "2"
    );
    auxAlternator.position.set(1408, 500);
    this.addChild(auxAlternator);
    //// Add rectifier
    const rectifier = this.addCtParts(
      "mythic",
      "RECTIFIER",
      "ui-market-window-ct-parts/part-icons/17-rectifiers.png",
      "2"
    );
    rectifier.position.set(1794, 500);
    this.addChild(rectifier);
  */
}
