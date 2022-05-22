import { GameSingletons } from "@game/app/GameSingletons";
import { Texture } from "@pixi/core";
import { DisplayObject } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { Sprite } from "@pixi/sprite";
import { SafeScrollbox } from "@sdk-pixi/display/SafeScrollbox";
import { CenturyTrainPartEntity } from "../data/CenturyTrainPartEntity";
import { CTPartThumbnail } from "./CTPartThumbnail";

export class CTPartsListSection extends SafeScrollbox {
  onPartSelected?: (partData: CenturyTrainPartEntity) => void;

  constructor(public readonly discoveredParts: CenturyTrainPartEntity[]) {
    super({
      noTicker: true,
      boxWidth: 1450,
      boxHeight: 720,
      stopPropagation: true,
      divWheel: GameSingletons.getGameContext().app.view,
    });

    this.name = "DiscoveredPartsSection";
    this.position.set(193, 331);

    const jankyScrollBoxFix = new Sprite(Texture.WHITE);
    jankyScrollBoxFix.width = this.boxWidth;
    jankyScrollBoxFix.renderable = false;
    this.content.addChild(jankyScrollBoxFix);

    this.addDiscoveredParts(discoveredParts);

    this.addInvisibleBox(this.boxWidth, 2);
  }

  private addDiscoveredParts(discoveredParts: CenturyTrainPartEntity[]): void {
    const partXDiff = 350;
    const partYDiff = 320;
    const partStart = 70;

    for (let i = 0; i < discoveredParts.length; i++) {
      const row = ~~(i / 4);
      const col = i % 4;

      const x = partXDiff * col + partStart;
      const y = partYDiff * row + partStart;

      const data = discoveredParts[i];
      const showSaleTag = data.shouldDiscount() && data.canPurchase();
      const partThumbnail = new CTPartThumbnail(data, showSaleTag);
      partThumbnail.position.set(x, y);
      partThumbnail.name = `part-${i + 1}`;
      partThumbnail.scale.set(0.9);
      partThumbnail.zIndex = 3;
      partThumbnail.onClick = () => {
        if (data.isInactive()) return;
        this.onPartSelected?.(data);
      };
      this.content.addChild(partThumbnail);
    }

    // This is to allow the scroll to go past the last items so they are visible
    const lastRowFill = new Graphics();
    lastRowFill.drawRect(0, 0, partXDiff, partYDiff);
    lastRowFill.position.x = partStart;
    lastRowFill.position.y = partYDiff * Math.ceil(discoveredParts.length / 4) + partStart;
    this.content.addChild(lastRowFill);
  }

  addInvisibleBox(width: number, height: number) {
    const box = new Sprite(Texture.EMPTY);
    box.width = width;
    box.height = height;
    return this.content.addChild(box);
  }

  playShowAnimation() {
    const items = this.content.children as (DisplayObject & { playShowAnimation?: (delay: number) => any })[];
    return Promise.all(items.map((child, index) => child.playShowAnimation?.(index * 0.07)));
  }

  playHideAnimation() {
    const items = this.content.children as (DisplayObject & { playHideAnimation?: (delay: number) => any })[];
    return Promise.all(items.map((child, index) => child.playHideAnimation?.(index * 0.018)));
  }
}
