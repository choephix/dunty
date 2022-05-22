import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { Texture } from "@pixi/core";
import { Container, DisplayObject } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { OverrideWidthAndHeight } from "@sdk-pixi/decorators/OverrideWidthAndHeight";
import { SafeScrollbox } from "@sdk-pixi/display/SafeScrollbox";
import { StakedAssetPlate } from "./StakedAssetPlate";
import { StakedAssetEntity, StakedAssetsDataService } from "./StakedAssetsDataService";

export class StakedAssetPlatesList extends SafeScrollbox {
  private readonly context: GameContext = GameSingletons.getGameContext();

  private readonly dataService: StakedAssetsDataService = new StakedAssetsDataService();

  declare content: SafeScrollbox["content"] & { _width: number; _height: number };
  public cullingTolerance = 0;

  refreshList: () => void;

  constructor() {
    super({
      noTicker: true,
      boxWidth: 555,
      boxHeight: 425,
      stopPropagation: true,
      divWheel: GameSingletons.getGameContext().app.view,
      overflowX: "none",
    });

    //// Add refresh list event
    this.refreshList = async () => {
      this.clearData();

      const data = await this.dataService.getStakedAssets();
      this.fillList(data);
    };

    OverrideWidthAndHeight.modifyInstance(this.content, 555, 425);
  }

  isChildInView(child: (DisplayObject | Container) & { ignoreCulling?: boolean }) {
    if (child.ignoreCulling) return true;

    const scroll = -this.content.y;
    if (scroll + this.cullingTolerance < child.y - this.boxHeight) return false;

    const childHeight = "height" in child ? child.height : 0;
    if (scroll - this.cullingTolerance > child.y + childHeight) return false;

    return true;
  }

  onEnterFrame() {
    for (const child of this.content.children) {
      child.renderable = this.isChildInView(child);
    }
  }

  async init() {
    const data = await this.dataService.getStakedAssets();
    this.fillList(data);
  }

  async fillList(data: StakedAssetEntity[]) {
    this.content.addChild(this.addInvisibleBox(426));
    let startX = 25;
    let startY = 10;
    for (const datum of data) {
      const container = new StakedAssetPlate(this.refreshList);
      container.init(datum);
      container.scale.set(0.65);
      container.position.set(startX, startY);
      this.content.addChild(container);

      startY += container.height + 5;
      this.content._height = startY + 10;

      this.update();

      await this.context.ticker.nextFrame();
    }
  }

  addInvisibleBox(px: number) {
    const box = new Sprite(Texture.EMPTY);
    box.width = this.boxWidth + 1;
    box.height = px;
    return box;
  }

  clearData() {
    const children = [...this.content.children];
    for (const child of children) {
      child.destroy({ children: true });
    }
  }
}
