import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { CardEntity } from "@game/data/entities/CardEntity";
import { CardGlowInstanceManager } from "@game/fx/glow-overlay/CardGlowInstanceManager";
import { CardSprite } from "@game/ui/cards/CardSprite";
import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { IRect } from "@sdk/core/common.types";
import { EventBus } from "@sdk/core/EventBus";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { lerp, unlerpClamped } from "@sdk/utils/math";
import { playCardSwapSound } from "../cards/playCardSwapSound";

/**
 * Odd numbers from 3 to 15
 */
type MaxCardsCountType = 3 | 5 | 7 | 9 | 11 | 13 | 15;

export class SimpleCardsCarousel extends EnchantedContainer {
  private readonly context = GameSingletons.getGameContext();

  public readonly events = new EventBus<{
    scrollIndexChange: (cardIndex: number) => void;
  }>();

  /**
   * Controls what card is currently selected and should be at the center of our carousel
   */
  protected scrollIndex: number = 0;

  /**
   * Controls what cards is actaully at the center of our carousel, at this moment in time.
   * That is to say, changes you see to this value will be the changes to sprite positions you see on the screen.
   * When scrollIndex changes, the class will make sure animatedScrollIndex slowly tweens to that new value.
   */
  protected animatedScrollIndex: number = 0;

  public readonly sprites: CardSprite[];
  public readonly spritesCount: number;

  /**
   * The maximum offset of the sprites from the center of the carousel.
   */
  protected readonly spritesMaxOffset: number;

  /**
   * The scale a card needs to be at, to fit snugly into the area.
   * In reality, any cards that are not the currently selected one, will
   */
  protected readonly spriteScaleToFit: number;

  protected readonly centerX: number;
  protected readonly centerY: number;

  private readonly glows = new CardGlowInstanceManager();

  private hitAreaLeft?: Sprite;
  private hitAreaRight?: Sprite;

  public readonly tweeener = new TemporaryTweeener(this);
  public cardSpreadMultiplier = 1.0;
  public cardScaleMultiplier = 1.0;

  public readonly options = {
    verticalAlignment: 0.5,
    scaleMin: 0.7,
    scaleEase: (linear: number) => Math.cos(1.0 - linear),
    spreadEase: (offsetNormalized: number) => Math.sin(0.5 * Math.PI * offsetNormalized),
  };

  constructor(
    public readonly cards: CardEntity[],
    public readonly areaWidth: number,
    public readonly areaHeight: number,
    public readonly maxCardsCount: MaxCardsCountType = 5
  ) {
    super();

    this.centerX = this.areaWidth / 2;
    this.centerY = this.areaHeight / 2;

    this.sprites = this.cards.map(card => new CardSprite(card, true));
    this.spritesCount = this.sprites.length;

    const sampleCard = this.sprites[0] as CardSprite | undefined;

    /**
     * There is always the possibility that the class is created with an empty array of cards.
     * We don't really want to do much with that, so just make sure we assign something to instance's members,
     * to keep Typescript happy, and return early.
     */
    if (!sampleCard) {
      this.spritesMaxOffset = 0;
      this.spriteScaleToFit = 1;
      return;
    }

    this.addChild(...this.sprites);

    this.spriteScaleToFit = Math.min(this.areaWidth / sampleCard.width, this.areaHeight / sampleCard.height);
    for (const sprite of this.sprites) {
      sprite.scale.set(this.spriteScaleToFit);
      sprite.setPivotFraction();
    }

    /**
     * Doing this after properly scaling the sprites, so that we get the correct result.
     */
    const availableWidth = this.areaWidth - sampleCard.width * 0.5;
    this.spritesMaxOffset = availableWidth / 2;

    this.enableNavigationViaLeftOrRightClick();
    this.enableNavigationViaMouseWheel();
    this.enableSoundOnIndexChange();

    this.enchantments.onDestroy(() => this.events.clear());
    this.enchantments.watch(
      () => this.animatedScrollIndex,
      () => this.updateCardPositions(),
      true
    );

    /**
     * By default, scroll to the center of the carousel.
     */
    this.setScrollIndex(Math.floor(this.cards.length / 2), false);
  }

  private ensureLeftAndRightHitAreasAdded() {
    const createHitArea = (rect: IRect) => {
      const hitArea = new Sprite(Texture.WHITE);
      hitArea.interactive = true;
      hitArea.buttonMode = true;
      hitArea.width = rect.width;
      hitArea.height = rect.height;
      hitArea.x = rect.x;
      hitArea.y = rect.y;

      // Just set a random color for eventual debugging
      hitArea.tint = ~~(Math.random() * 0xffffff);
      hitArea.alpha = 0.4;

      hitArea.renderable = false;

      this.enchantments.onDestroy(() => this.hitAreaLeft?.removeAllListeners());

      return hitArea;
    };

    if (!this.hitAreaLeft) {
      this.hitAreaLeft = createHitArea({
        x: 0,
        y: 0,
        width: this.centerX,
        height: this.areaHeight,
      });
      this.addChild(this.hitAreaLeft);
    }

    if (!this.hitAreaRight) {
      this.hitAreaRight = createHitArea({
        x: this.centerX,
        y: 0,
        width: this.centerX,
        height: this.areaHeight,
      });
      this.addChild(this.hitAreaRight);
    }

    return [this.hitAreaLeft, this.hitAreaRight];
  }

  enableNavigationViaLeftOrRightClick() {
    const [hitAreaLeft, hitAreaRight] = this.ensureLeftAndRightHitAreasAdded();

    buttonizeDisplayObject(hitAreaLeft, () => this.setScrollIndex(this.scrollIndex - 1, true));
    buttonizeDisplayObject(hitAreaRight, () => this.setScrollIndex(this.scrollIndex + 1, true));
  }

  enableNavigationViaMouseWheel() {
    const [hitAreaLeft, hitAreaRight] = this.ensureLeftAndRightHitAreasAdded();

    let pointerIsOver = false;

    hitAreaLeft.on("pointerover", () => (pointerIsOver = true));
    hitAreaLeft.on("pointerout", () => (pointerIsOver = false));
    hitAreaRight.on("pointerover", () => (pointerIsOver = true));
    hitAreaRight.on("pointerout", () => (pointerIsOver = false));

    const stopWatcher = this.enchantments.watch.andCleanup(
      () => pointerIsOver,
      () => {
        const onWheel = (e: WheelEvent) => {
          if (this.destroyed) {
            return console.warn("CardsDrawerGroup destroyed, but still getting wheel events");
          }
          e.stopPropagation(); // FIXME:
          if ((e.deltaX || e.deltaY) > 0) {
            this.setScrollIndex(this.scrollIndex + 1, true);
          } else {
            this.setScrollIndex(this.scrollIndex - 1, true);
          }
        };
        const wheelDiv = this.context.app.view;
        wheelDiv.addEventListener("wheel", onWheel, { passive: true, capture: true });

        return () => wheelDiv.removeEventListener("wheel", onWheel, true);
      }
    );

    this.enchantments.onDestroy(stopWatcher);
  }

  enableSoundOnIndexChange() {
    this.enchantments.watch(
      () => Math.round(this.animatedScrollIndex),
      () => () => playCardSwapSound(),
      false
    );
  }

  setHighlightedCards(cardAssetIds: CardEntity.AssetId[]) {
    const cardSprites = this.sprites.filter(sprite => cardAssetIds.includes(sprite.assetData?.asset_id as any));
    this.glows.setParents(cardSprites);

    cardSprites.forEach(sprite => (sprite.interactive = sprite.interactiveChildren = false));
  }

  setScrollIndex(value: number, animate: boolean = true) {
    if (value < 0) value = 0;
    if (value > this.cards.length - 1) value = this.cards.length - 1;

    /** Just making absolutely sure this scroll index here is going to be an integer */
    value = Math.round(value);

    if (value === this.scrollIndex) return;

    this.scrollIndex = value;
    this.events.dispatch("scrollIndexChange", this.scrollIndex);

    if (animate) {
      this.tweeener.to(this, {
        animatedScrollIndex: value,
        duration: 0.8,
        ease: "elastic(0.6).out",
        overwrite: true,
      });
    } else {
      this.animatedScrollIndex = value;
    }
  }

  getCurrentCardSprite() {
    return this.sprites[this.scrollIndex];
  }

  getCurrentCardData() {
    return this.cards[this.scrollIndex];
  }

  updateCardPositions() {
    for (const sprite of this.sprites) {
      sprite.visible = false;
    }

    const maxCardsCountHalved = this.maxCardsCount / 2;
    for (let i = 0; i < this.spritesCount; i++) {
      const sprite = this.sprites[i];

      /**
       * The offset (in number of cards) from the center of the carousel.
       */
      const offset = i - this.animatedScrollIndex;
      sprite.visible = offset >= -maxCardsCountHalved && offset <= maxCardsCountHalved;

      if (!sprite.visible) continue;

      /**
       * The offset value, scaled to the range of [-1, 1]
       */
      const offsetNormalized = offset / maxCardsCountHalved;
      const offsetNormalizedAbsolute = Math.abs(offsetNormalized);
      const offsetDirection = offsetNormalized > 0 ? 1 : -1;

      /**
       * Similarly, we want a slight curve in the cards` sizes.
       */
      const scaleMultiplier = lerp(this.options.scaleMin, 1.0, this.options.scaleEase(1.0 - offsetNormalizedAbsolute));
      sprite.scale.set(this.spriteScaleToFit * scaleMultiplier * this.cardScaleMultiplier);

      /**
       * We want to keep the cards' distances from each other slightly curved in the carousel,
       * for a nice looking 3D-ish effect.
       */
      sprite.x =
        this.centerX +
        offsetDirection *
          lerp(0, this.spritesMaxOffset, this.options.spreadEase(offsetNormalizedAbsolute)) *
          this.cardSpreadMultiplier *
          this.cardSpreadMultiplier;

      const yAlignmentOffset = (this.areaHeight - sprite.height) * (this.options.verticalAlignment - 0.5);
      sprite.y = yAlignmentOffset + this.centerY + this.areaHeight * 0.25 * (1 - this.cardScaleMultiplier);

      /**
       * Fade out the card only when the offset is at 90+% of the max offset.
       */
      sprite.alpha = unlerpClamped(0, 0.1, 1 - offsetNormalizedAbsolute);

      /**
       * Dim any card other than the one currently selected one.
       * We won't be lerping this color nicely from dark to light, because we
       * want a harsh immediate difference between the center card and the ones around it,
       * so simple ternary will do here.
       */
      sprite.image.tint = Math.abs(offset) < 0.5 ? 0xffffff : 0x909090;

      /**
       * The larger the offset from the center, the farther back the card should be ordered.
       */
      sprite.zIndex = -Math.abs(offset);
    }

    this.sortChildren();
  }

  get width() {
    return this.areaWidth;
  }

  get height() {
    return this.areaHeight;
  }

  async playShowAnimation() {
    this.cardSpreadMultiplier = 0;

    const tl = this.tweeener.createTimeline();
    tl.fromTo(
      this,
      {
        cardScaleMultiplier: 0,
        // alpha: 0,
      },
      {
        cardScaleMultiplier: 1,
        alpha: 1,
        duration: 0.33,
        ease: "back.out",
        onUpdate: () => this.updateCardPositions(),
      }
    );
    tl.fromTo(
      this,
      {
        cardSpreadMultiplier: 0,
        // alpha: 0,
      },
      {
        cardSpreadMultiplier: 1,
        alpha: 1,
        duration: 0.33,
        ease: "power2.out",
        onUpdate: () => this.updateCardPositions(),
      },
      0.2
    );

    await tl.play();
  }

  playHideAnimation() {
    this.glows.setParents([]);

    return this.tweeener.to(this, {
      cardSpreadMultiplier: 0,
      alpha: 0,
      duration: 0.15,
      ease: "power.in",
      onUpdate: () => this.updateCardPositions(),
    });
  }
}
