import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { CardSprite } from "@game/ui/cards/CardSprite";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";

const compositionAttributeToTextureSlugMap: Record<string, string> = {
  ["Carbon Weave"]: "carbon",
  ["Iron"]: "iron",
  ["Steel"]: "steel",
  ["Tungsten"]: "tungsten",
};

const textureIdRoot = "ui-market-window-compositions";

export class CardUpgradeSlot extends Container {
  private readonly assets = GameSingletons.getResources();

  private readonly background: Sprite;
  private card: CardSprite | null = null;

  constructor(public readonly side: "left" | "right") {
    super();

    const backgroundTextureId = `${textureIdRoot}/${this.side}-bg.png`;
    const backgroundTexture = this.assets.getTexture(backgroundTextureId);
    this.background = new Sprite(backgroundTexture);
    this.addChild(this.background);
  }

  public setCard(card: CardSprite | null) {
    if (this.card) {
      this.removeChild(this.card);
    }

    if (card) {
      this.addChild(card);
      card.setPivotFraction();
      card.scale.set(0.5);
      card.position.set(190, 239);

      const compositionAttributeString = card.assetData!.asset_template!.composition;
      const composition = compositionAttributeToTextureSlugMap[compositionAttributeString]?.toLowerCase();

      if (composition) {
        const compositionPlateTextureId = `${textureIdRoot}/${this.side}-${composition}-ribbon.png`;
        const compositionPlate = new Sprite(this.assets.getTexture(compositionPlateTextureId));
        compositionPlate.position.set(-12, 418);
        this.addChild(compositionPlate);
      } else {
        console.warn(`No texture slug found for composition attribute: ${compositionAttributeString}`);
      }
    }

    this.card = card;
  }
}
