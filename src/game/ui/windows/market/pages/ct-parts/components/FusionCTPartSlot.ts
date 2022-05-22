import { GameSingletons } from "@game/app/GameSingletons";
import { getRarityColors } from "@game/constants/RarityColors";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { fitObjectInRectangle } from "@sdk-pixi/layout/fitObjectInRectangle";
import { CenturyTrainPartEntity } from "../data/CenturyTrainPartEntity";

export class FusionCTPartSlot extends Container {
  private readonly context = GameSingletons.getGameContext();

  private readonly pad: Sprite;

  constructor() {
    super();

    //// Add background
    const bg = this.context.simpleFactory.createSprite("ui-market-window-ct-parts/fusion/part-holder-together.png");
    this.addChild(bg);

    //// Pard pad
    this.pad = this.context.simpleFactory.createSprite("ui-market-window-ct-parts/part-thumbnail/pad.png");
    fitObjectInRectangle(this.pad, {
      x: 35,
      y: 0,
      width: 125,
      height: 183,
    });
    this.addChild(this.pad);
    const frame = this.context.simpleFactory.createSprite("ui-market-window-ct-parts/part-thumbnail/frame-stroked.png");
    fitObjectInRectangle(frame, {
      x: 35,
      y: 0,
      width: 125,
      height: 183,
    });
    this.addChild(frame);
  }

  setSelectedPartEntity(selectedPartEntity: CenturyTrainPartEntity) {
    //// Add part sprite
    const sprite = this.context.simpleFactory.createSprite(selectedPartEntity.imgUrl);

    //// Tint pad rarity
    this.pad.tint = getRarityColors(selectedPartEntity.rarity).main.toInt();
    fitObjectInRectangle(sprite, {
      x: 50,
      y: 0,
      width: 95,
      height: 183,
    });
    this.addChild(sprite);

    //// Add part name
    const text = this.context.simpleFactory.createText(selectedPartEntity.part, {
      fontSize: 24,
    });
    fitObjectInRectangle(text, {
      x: 70,
      y: 45,
      width: 50,
      height: 183,
    });
    this.addChild(text);
  }
}
