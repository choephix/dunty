import { Card } from "@client/game/game";
import { __window__ } from "@debug/__window__";
import { createEnchantedFrameLoop } from "@game/asorted/createEnchangedFrameLoop";
import { Container } from "@pixi/display";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { VCard } from "../entities/VCard";
import { VCardAnimations } from "../entities/VCard.animations";

export class VHand extends Container {
  public areaWidth: number = 1024;

  public cardList: Card[] = [];

  private readonly cardSprites = new Map<Card, VCard>();

  public onCardClick?: (card: Card) => void;

  constructor() {
    super();

    __window__.foo = 0;

    this.onEnterFrame.watch.array(
      () => this.cardList,
      cards => {
        this.cardSprites.forEach((sprite, card) => {
          if (cards.includes(card)) return;
          this.cardSprites.delete(card);
          this.removeChild(sprite);
        });

        cards.forEach(card => {
          if (this.cardSprites.has(card)) return;
          const sprite = new VCard(card);
          buttonizeDisplayObject(sprite, () => this.onCardClick?.(card));
          this.cardSprites.set(card, sprite);
          this.addChild(sprite);
          VCardAnimations.playShowAnimation(sprite);
        });

        const sprites = Array.from(this.cardSprites.values());
        for (const [index, vcard] of sprites.entries()) {
          const xmul = index - (sprites.length - 1) / 2;
          const delta = Math.min(200, (0.9 * this.areaWidth) / sprites.length);
          vcard.position.set(delta * xmul, -100);
          vcard.scale.set(0.4);
        }
      },
      true
    );
  }

  private readonly onEnterFrame = createEnchantedFrameLoop(this);
}
