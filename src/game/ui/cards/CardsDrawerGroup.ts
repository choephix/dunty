import type { GameContext } from "@game/app/app";
import type { Ticker } from "@game/app/ticker";
import type { CardEntity } from "@game/data/entities/CardEntity";
import type { ReadonlyDeep } from "type-fest";
import type { CardsDrawerGroupData } from "./CardDrawerGroupData";

import { FontFamily } from "@game/constants/FontFamily";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { Buttonized, buttonizeInstance } from "@sdk-ui/buttonize";
import { Color, lerpColor } from "@sdk/utils/color/Color";
import { clamp, lerp } from "@sdk/utils/math";
import { createValueAnimator_Counter } from "../common/createValueAnimator_Counter";
import { createMeshyLabel, MeshyLabel } from "../components/createMeshyLabel";
import { CardSprite, CARD_SPRITE_CENTER, CARD_SPRITE_DIMENSIONS } from "./CardSprite";

import { GameSingletons } from "@game/app/GameSingletons";
import { BLEND_MODES } from "@pixi/constants";
import { Texture } from "@pixi/core";
import { DisplayObject } from "@pixi/display";
import { markCardSpriteIfEquippedOnTrain } from "./markCardSpriteIfEquippedOnTrain";
import { playCardSwapSound } from "./playCardSwapSound";

export class Area {
  constructor(public x: number, public y: number, public width: number, public height: number) {}
  get vmin() {
    return Math.min(this.height, this.width);
  }
  get vmax() {
    return Math.max(this.height, this.width);
  }
  get ratio() {
    return this.width / this.height;
  }
  get center() {
    return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
  }
}

function createCardFocusManager(group: CardsDrawerGroup) {
  const { initialFocusIndex } = group.data;

  const cards = group.cardSprites.map(cardSprite => ("entity" in cardSprite ? cardSprite.entity : null));

  const initialRealCardsCount = cards?.length ?? 0;
  let cardIndex = clamp(initialFocusIndex ?? ~~(0.5 * initialRealCardsCount), 0, initialRealCardsCount - 1);

  const animator = createValueAnimator_Counter(() => cardIndex);
  animator.animationDuration = 0.2;

  const maxIndex = cards.length - 1;

  const manager = {
    animator,
    maxIndex,
    get cardIndex() {
      return cardIndex;
    },
    get animatedCardIndex() {
      return animator.valueOnScreen;
    },
    get card() {
      return cards?.[cardIndex] || null;
    },
    next() {
      if (cards == null) return cardIndex;
      if (cardIndex >= maxIndex) return cardIndex;
      return ++cardIndex;
    },
    prev() {
      if (cards == null) return cardIndex;
      if (cardIndex - 1 < 0) return cardIndex;
      return --cardIndex;
    },
    set(index: number) {
      if (index > maxIndex) index = maxIndex;
      if (index < 0) index = 0;
      cardIndex = index;
    },
    updateInstantly() {
      animator.set(cardIndex);
    },
  };

  return manager;
}

export class CardsDrawerGroup {
  private readonly context: GameContext = GameSingletons.getGameContext();

  readonly cardSprites = new Array<CardSprite | Sprite>();
  readonly titleLabel?: MeshyLabel;
  readonly hintLabel?: Text;
  readonly additionalDisplayObject?: DisplayObject;
  plusButton?: Sprite;

  readonly hitQuad?: Buttonized<Sprite>;
  readonly hitQuadLeft?: Buttonized<Sprite>;
  readonly hitQuadRight?: Buttonized<Sprite>;

  readonly zone = new Area(0, 0, 100, 100);

  readonly onDestroy = new Array<{ destroyed?: boolean; destroy: () => void } | (() => void)>();

  readonly hoverFactorAnimated = createValueAnimator_Counter(() => +this.isHoveredOver);
  
  readonly cardGlows = new GlowManager();
  
  focus = createCardFocusManager(this);

  destroyed: boolean = false;

  constructor(
    public readonly data: ReadonlyDeep<CardsDrawerGroupData>,
    private readonly cardSpritesPool: Map<CardEntity.AssetId, CardSprite>
  ) {
    const { title, hint, onClick, onFocusedCardOrHoverStateChange, createAdditionalDisplayObject } = data;

    this.onDestroy.push(this.cardGlows.clear.bind(this.cardGlows));

    this.hoverFactorAnimated.animationDuration = 0.2;

    this.updateCardSprites();
    this.onDestroy.push(() => (this.cardSprites.length = 0));

    if (title) {
      const titleLabel = createMeshyLabel(title.toUpperCase(), 640);
      titleLabel.scale.set(0.6);
      titleLabel.zIndex = 999;

      this.titleLabel = titleLabel;
      this.onDestroy.push(titleLabel);
    }

    if (hint) {
      this.hintLabel = new Text(hint.toUpperCase(), {
        fontSize: 20,
        fill: 0xffffff,
        fontFamily: FontFamily.Default,
      });
      this.hintLabel.anchor.set(0.5);
      this.hintLabel.alpha = 0.7;
      this.hintLabel.zIndex = 999;
      this.onDestroy.push(this.hintLabel);
    }

    if (createAdditionalDisplayObject) {
      this.additionalDisplayObject = createAdditionalDisplayObject();
      this.onDestroy.push(this.additionalDisplayObject);
    }

    //// Add hit area quads

    if (!data.noHitAreaQuads) {
      this.hitQuad = buttonizeInstance(new Sprite(Texture.WHITE));
      this.hitQuad.alpha = 0.1;
      this.hitQuad.zIndex = 99_999;
      this.hitQuad.renderable = false;
      this.onDestroy.push(this.hitQuad);
      if (onClick != undefined) {
        this.hitQuad.behavior.on({ trigger: () => onClick(this.focus.card || null) });
      }

      const onWheel = (e: WheelEvent) => {
        if (this.destroyed) {
          return console.warn("CardsDrawerGroup destroyed, but still getting wheel events");
        }
        if (this.isHoveredOver) {
          e.stopPropagation();
          if ((e.deltaX || e.deltaY) > 0) {
            this.focus.next();
          } else {
            this.focus.prev();
          }
        }
      };
      const wheelDiv = this.context.viewport.options.divWheel;
      wheelDiv.addEventListener("wheel", onWheel, { passive: true, capture: true });
      this.onDestroy.push(() => wheelDiv.removeEventListener("wheel", onWheel, true));

      this.hitQuadLeft = buttonizeInstance(new Sprite(Texture.WHITE));
      this.hitQuadLeft.alpha = 0.1;
      this.hitQuadLeft.zIndex = 999_999;
      this.hitQuadLeft.tint = Color.MAGENTA.toInt();
      this.hitQuadLeft.renderable = false;
      this.hitQuadLeft.behavior.on({ trigger: () => this.focus.prev() });
      this.onDestroy.push(this.hitQuadLeft);

      this.hitQuadRight = buttonizeInstance(new Sprite(Texture.WHITE));
      this.hitQuadRight.alpha = 0.1;
      this.hitQuadRight.zIndex = 999_999;
      this.hitQuadRight.tint = Color.CYAN.toInt();
      this.hitQuadRight.renderable = false;
      this.hitQuadRight.behavior.on({ trigger: () => this.focus.next() });
      this.onDestroy.push(this.hitQuadRight);
    }

    if (onFocusedCardOrHoverStateChange != undefined) {
      const stopObservingFocus = this.context.stage.enchantments.watch(
        () => (this.isHoveredOver ? this.focus.cardIndex : null),
        () => onFocusedCardOrHoverStateChange(this.focus.card || null, this.isHoveredOver)
      );
      this.onDestroy.push(stopObservingFocus);
    }

    this.onDestroy.push(() => (this.destroyed = true));

    //// SFX on scroll

    const stopSfxWather = this.context.stage.enchantments.watch(
      () => this.focus.card,
      () => playCardSwapSound(),
      false
    );
    this.onDestroy.push(stopSfxWather);

    //// SFX on costruct / destroy

    const playSoundAfterRandomizedDelay = () =>
      this.context.ticker.delay(Math.random() * 0.067).then(() => playCardSwapSound());

    playSoundAfterRandomizedDelay();
    this.onDestroy.push(playSoundAfterRandomizedDelay);
  }

  updateCardSprites() {
    for (const cardSprite of this.cardSprites) {
      cardSprite.parent?.removeChild(cardSprite);
      if ("entity" in cardSprite && cardSprite.entity) {
        this.cardSpritesPool.set(cardSprite.entity.assetId, cardSprite);
      } else {
        cardSprite.destroy();
      }
    }

    const { filter, onClick, shouldHighlightCard, shouldShowPlusButton } = this.data;
    const cards = filter ? this.data.cards?.filter(filter) : this.data.cards;

    const greateCardSprite = (cardData: CardEntity) => {
      if (this.cardSpritesPool.has(cardData.assetId)) {
        return this.cardSpritesPool.get(cardData.assetId)!;
      } else {
        const cardSprite = new CardSprite(cardData, true);
        if (this.data.markEquippedCards) {
          markCardSpriteIfEquippedOnTrain(cardSprite, true);
        }
        this.cardSpritesPool.set(cardData.assetId, cardSprite);
        return cardSprite;
      }
    };

    this.cardSprites.length = 0;
    if (cards && cards.length) {
      const { shouldShowPlusCard } = this.data;

      for (const cardData of cards) {
        const card = greateCardSprite(cardData);
        card.setPivotFraction();
        if (shouldHighlightCard?.(cardData)) {
          this.cardGlows.addTo(card, 0x00ffff);
        }
        this.cardSprites.push(card);
        // this.onDestroy.push(card);
      }

      if (shouldShowPlusCard) {
        const plusCardTexture = this.context.assets.getTexture("ui-cards-drawer/add-card-card.png");
        const plusCard = Object.assign(new Sprite(plusCardTexture), { data: null as CardEntity | null });
        plusCard.anchor.set(0.5);
        this.cardSprites.push(plusCard);
        this.onDestroy.push(plusCard);
      }
    } else if (shouldShowPlusButton && onClick) {
      const plusButtonTexture = this.context.assets.getTexture("ui-cards-drawer/add-card-btn.png");
      const plusButton = buttonizeInstance(new Sprite(plusButtonTexture));
      plusButton.anchor.set(0.5, 0.5);
      plusButton.zIndex = 999;
      plusButton.behavior.on({ trigger: () => onClick(null) });

      this.plusButton = plusButton as Sprite;
      this.onDestroy.push(plusButton);
    }

    this.focus = createCardFocusManager(this);
  }

  public get isHoveredOver(): boolean {
    return (
      this.hitQuad?.behavior.isHover.value ||
      this.hitQuadLeft?.behavior.isHover.value ||
      this.hitQuadRight?.behavior.isHover.value ||
      false
    );
  }

  public get widthWeight() {
    return this.data.widthWeight ?? 1;

    const HOVER_MUL = 1.5;
    return lerp(
      this.data.widthWeight ?? 1,
      HOVER_MUL * (this.data.widthWeight ?? 1),
      this.hoverFactorAnimated.valueOnScreen
    );
  }

  arrangeCardSprites(expansionProgress: number) {
    for (const card of this.cardSprites) {
      card.visible = false;
    }

    const { zone } = this;

    const cardSprites = this.cardSprites;
    const cardSpritesCount = cardSprites.length;
    const cardSpritesMaxWidth = zone.width * 0.8;
    const cardSpritesMaxHeight = zone.height * 0.8;

    if (cardSpritesCount < this.focus.cardIndex) {
      this.focus.set(cardSpritesCount - 1);
      this.focus.updateInstantly();
    }

    const focusedCardIndexAnimated = this.focus.animatedCardIndex;
    const hoverFactor = this.hoverFactorAnimated.valueOnScreen;

    const hidingSpotX = this.context.viewSize.width + 200;

    const sampleCard = CARD_SPRITE_DIMENSIONS;
    const cardUnscaledWidth = sampleCard.width;
    const cardUnscaledHeight = sampleCard.height;
    const cardScaleBase =
      Math.min(cardSpritesMaxWidth / cardUnscaledWidth, cardSpritesMaxHeight / cardUnscaledHeight) || 1;
    const cardWidth = cardUnscaledWidth * cardScaleBase;
    const cardHeight = cardUnscaledHeight * cardScaleBase;

    const maxSpreadWidth = Math.max(
      96,
      0.5 * Math.min(zone.width - cardWidth, zone.height * 1.65 - cardWidth, cardWidth * 1.2)
    );
    const maxSpreadWidthOnHover = 0.5 * Math.min(zone.width, zone.height * 1.67);
    const wiggleRoom = lerp(maxSpreadWidth, maxSpreadWidthOnHover, hoverFactor);

    const MAX_VISIBLE_CARDS_ON_EACH_SIDE = 6;

    if (cardSpritesCount > 0) {
      for (const [cardIndex, card] of cardSprites.entries()) {
        const focusedCardIndexDelta = cardIndex - focusedCardIndexAnimated;
        const focusedCardIndexDeltaUnsigned = Math.abs(focusedCardIndexDelta);

        card.visible = focusedCardIndexDeltaUnsigned < MAX_VISIBLE_CARDS_ON_EACH_SIDE;

        // if (!card.visible) continue;

        const focusedCardIndexDeltaNormalized = focusedCardIndexDelta / MAX_VISIBLE_CARDS_ON_EACH_SIDE;

        const xOffsetSign = cardIndex < focusedCardIndexAnimated ? -1 : 1;
        const zNormalized = Math.pow(Math.abs(focusedCardIndexDeltaNormalized), 0.7);

        const xOffsetFactorOnHover = 1.0 - Math.pow(0.5, Math.abs(focusedCardIndexDeltaUnsigned));
        const xOffsetFactor = lerp(zNormalized, xOffsetFactorOnHover, hoverFactor);
        const xOffset = wiggleRoom * xOffsetFactor * xOffsetSign;
        const x = zone.center.x + xOffset;

        const yOffset = zNormalized * -50;
        const y = zone.y + zone.height - 68 - card.height * 0.5 + yOffset;

        card.position.set(lerp(hidingSpotX, x, expansionProgress), y);

        card.scale.set(
          cardScaleBase * lerp(1, 1.015, hoverFactor) * Math.pow(0.9, Math.abs(focusedCardIndexDeltaUnsigned))
        );

        if ("image" in card) {
          card.image.tint = lerpColor(0x404040, 0xffffff, Math.pow(1 - zNormalized, 3)).toInt();
        }

        card.rotation = lerp(0.0, focusedCardIndexDelta * 0.025, hoverFactor);

        card.zIndex = cardSpritesCount - (focusedCardIndexDeltaUnsigned ?? cardIndex);
      }
    }

    if (this.hintLabel) {
      const visibilityFactor = hoverFactor * expansionProgress * expansionProgress;
      const hintLabel = this.hintLabel;
      const x = lerp(hidingSpotX, zone.center.x, expansionProgress);
      const y = zone.y + zone.height - (cardHeight || 100) - hintLabel.height * 0.5 + lerp(0, -100, visibilityFactor);
      hintLabel.position.set(x, y);
      hintLabel.alpha = visibilityFactor * visibilityFactor;
    }

    if (this.additionalDisplayObject) {
      const x = lerp(hidingSpotX, zone.center.x, expansionProgress);
      const y = zone.y + zone.height - 40;
      this.additionalDisplayObject.position.set(x, y);
      this.additionalDisplayObject.scale.set(2.0 * cardScaleBase);
    }

    if (this.hitQuad) {
      this.hitQuad.position.set(zone.x, zone.y);
      this.hitQuad.width = zone.width;
      this.hitQuad.height = zone.height;
    }

    const centerZone = this.data.onClick === undefined ? 0 : cardWidth;
    const sideZonesWidth = 0.5 * (zone.width - centerZone);

    if (this.hitQuadLeft) {
      this.hitQuadLeft.position.set(zone.x, zone.y);
      this.hitQuadLeft.width = sideZonesWidth;
      this.hitQuadLeft.height = zone.height;
    }

    if (this.hitQuadRight) {
      this.hitQuadRight.position.set(zone.x + sideZonesWidth + centerZone, zone.y);
      this.hitQuadRight.width = sideZonesWidth;
      this.hitQuadRight.height = zone.height;
    }

    this.cardGlows.onEnterFrame(this.context.ticker);
  }

  *iterateDisplayObjects() {
    if (this.titleLabel) {
      yield this.titleLabel;
    }
    if (this.hintLabel) {
      yield this.hintLabel;
    }
    if (this.plusButton) {
      yield this.plusButton;
    }
    for (const cardSprite of this.cardSprites) {
      yield cardSprite;
    }
    if (this.additionalDisplayObject) {
      yield this.additionalDisplayObject;
    }
    if (this.hitQuad) {
      yield this.hitQuad;
    }
    if (this.hitQuadLeft) {
      yield this.hitQuadLeft;
    }
    if (this.hitQuadRight) {
      yield this.hitQuadRight;
    }
  }
}

class GlowManager {
  private glows = new Map<CardSprite, Sprite>();

  onEnterFrame(t: Ticker) {
    const tfa = 0.5 + 0.5 * Math.sin(t.lastTime * 0.005);
    const alpha = 0.7 + 0.15 * tfa;
    const scale = 1.0 + 0.02 * tfa;
    for (const [, glow] of this.glows) {
      glow.alpha = alpha;
      // glow.scale.set(scale);
    }
  }

  addTo(card: CardSprite, color: number = 0xffffff) {
    const glow = new Sprite(Texture.from(`cardGlow`));
    glow.anchor.set(0.5);
    glow.tint = color;
    glow.blendMode = BLEND_MODES.ADD;
    glow.position.copyFrom(CARD_SPRITE_CENTER);
    this.glows.set(card, glow);
    card.addChild(glow);
  }

  clear() {
    for (const glow of this.glows.values()) {
      glow.destroy();
    }
    this.glows.clear();
  }
}
