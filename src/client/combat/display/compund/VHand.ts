import { Card } from "@client/combat/state/CombatState";
import { createEnchantedFrameLoop } from "@game/asorted/createEnchangedFrameLoop";
import { Container } from "@pixi/display";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { VCard } from "@client/combat/display/entities/VCard";
import { VCardAnimations } from "@client/combat/display/entities/VCard.animations";
import { Combat } from "@client/combat/logic/Combat";

const CARD_SCALE = 0.4;

export class VHand extends Container {
  public areaWidth: number = 1024;

  public cardList: Card[] = [];

  public readonly cardSprites = new Map<Card, VCard>();

  public onCardClick?: (card: Card) => void;

  constructor() {
    super();

    this.sortableChildren = true;

    this.onEnterFrame.watch.array(
      () => this.cardList,
      cards => {
        this.cardSprites.forEach((sprite, card) => {
          if (cards.includes(card)) return;
          this.cardSprites.delete(card);

          VCardAnimations.playHideAnimation(sprite).then(() => sprite.destroy());
        });

        cards.forEach(card => {
          if (this.cardSprites.has(card)) return;
          const sprite = new VCard(card);
          sprite.actor = Combat.current!.state.groupA.combatants[0];
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
          vcard.scale.set(CARD_SCALE);
        }
      },
      true
    );
  }

  private readonly onEnterFrame = createEnchantedFrameLoop(this);
}
