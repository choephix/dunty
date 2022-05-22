import { __window__ } from "@debug/__";
import { GameSingletons } from "@game/app/GameSingletons";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { StationEntity } from "@game/data/entities/StationEntity";
import { Texture } from "@pixi/core";
import { Container, DisplayObject } from "@pixi/display";
import { ObservablePoint, Point } from "@pixi/math";
import { EventBus } from "@sdk/core/EventBus";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { StationPopupComponentFactory } from "../components/factory/StationPopupComponentFactory";
import { StationPopupBackground } from "../components/StationPopupBackground";
import { StationPopupBackgroundMods, StationPopupBackgroundType } from "../components/StationPopupBackgroundType";
import { PopupPlacementFunction } from "../util/PopupPlacementFunction";

export abstract class StationPopup extends EnchantedContainer {
  public readonly context = GameSingletons.getGameContext();
  public readonly tweeener = new TemporaryTweeener(this);

  public static get SCALE() {
    return 1.0;
  }

  public readonly placementFunc: PopupPlacementFunction = PopupPlacementFunction.sideways;

  public readonly anchor: Point = new ObservablePoint(this.updateSizeToPadTexture, this, 0.5, 0.5);

  public readonly events = new EventBus<{
    onClick_Close: () => void;
  }>();

  protected readonly componentFactory = new StationPopupComponentFactory(this);

  public readonly pad = new StationPopupBackground();

  /**
   * A list of objects we don't want to clear when we
   * call `clearContent()`.
   */
  protected readonly persistentElements = new Set<DisplayObject>();

  interactive = true;
  interactiveChildren = true;

  protected unfoldOnShowAnimation = true;

  public fullyShownAndUnfolded = false;

  public station: StationEntity | null = null;
  public constructor() {
    super();

    this.addChild(this.pad);
    this.pad.scale.set(0.5);
    this.persistentElements.add(this.pad);

    const updateSizeToPadTexture = this.updateSizeToPadTexture.bind(this);
    this.onEnterFrame.add(updateSizeToPadTexture);

    this.onDestroy(() => this.events.clear());
    this.onDestroy(() => this.context.animator.tween.killTweensOf(this));

    __window__.popup = this;
  }

  public async fillContent_Default() {}

  protected async setPadBackground(bgType: StationPopupBackgroundType) {
    const { station } = this;

    if (!station) {
      throw new Error("StationPopup.station is not set");
    }
    const stationRarity = station.rarityLevel;
    const textureSuffix = rarityLevelToSuffix(stationRarity);
    const texturePath = `assets/images/station-popups/${textureSuffix}.basis-${bgType}`;
    const bgMods = StationPopupBackgroundMods[bgType];

    return await this.setPadBackgroundTexturePath(texturePath, bgMods);
  }

  protected async setPadBackgroundTexturePath(texturePath: string, bgMods: Partial<StationPopupBackground>) {
    if (this.pad.hasBeenSetAtLeastOnce) {
      await this.pad.animateBackgroundChange(texturePath, bgMods);
    } else {
      this.pad.setTexture(texturePath, bgMods);
      this.updateSizeToPadTexture();
    }

    return this.pad;
  }

  protected updateSizeToPadTexture(pad: Container & { texture: Texture } = this.pad) {
    if (!pad?.texture) {
      return console.error("StationPopup.updateSizeToPadTexture: no pad texture");
    }

    this.padWidth = pad.texture.width * pad.scale.x;
    this.padHeight = pad.texture.height * pad.scale.y;

    const { width, height } = this;
    this.pivot.set(this.anchor.x * width, this.anchor.y * height);
  }

  public padWidth: number = 0;
  public padHeight: number = 0;
  get width() {
    return 0.5 * this.pad.width * this.scale.x;
    return this.padWidth * this.scale.x;
  }
  get height() {
    return 0.5 * this.pad.height * this.scale.y;
    return this.padHeight * this.scale.y;
  }

  get centerX() {
    return 0.5 * this.pad.texture.width * this.pad.scale.x;
  }

  async show() {
    if (!this.parent) {
      console.warn("StationPopup.show: no parent");
      return Promise.reject();
    }

    if (this.unfoldOnShowAnimation) this.pad.setBackgroundFolded();

    this.visible = true;
    const scaleTween = this.tweeener.fromTo(
      this,
      {
        pixi: {
          scale: 0.1,
          alpha: 0.0,
        },
      },
      {
        pixi: {
          scale: StationPopup.SCALE,
          alpha: 1,
        },
        duration: 0.275,
        ease: "power3.out",
      }
    );
    const unfoldTween = this.unfoldOnShowAnimation ? this.pad.animateBackgroundUnfold() : null;

    await Promise.all([scaleTween, unfoldTween]);

    this.fullyShownAndUnfolded = true;
  }

  async hide() {
    if (!this.parent) {
      return console.warn("StationPopup.hide: no parent");
    }

    await this.tweeener.to(this, {
      pixi: {
        scale: 0.5,
        alpha: 0.1,
      },
      duration: 0.1,
      ease: "power.in",
      overwrite: true,
    });
  }

  async fadeChildrenIn(stagger: number = 0.07, children = [...this.children]) {
    const { ticker } = this.context;
    const persistentChildren = [...this.persistentElements];
    const nonPersistentChildren = children.filter(child => persistentChildren.indexOf(child) === -1);

    const showChild = async (child: DisplayObject & { playShowAnimation?: () => any }, delay: number) => {
      child.visible = false;
      await this.enchantments.waitUntil(() => this.fullyShownAndUnfolded);
      await ticker.delay(delay);
      child.visible = true;

      if (child.playShowAnimation) {
        const tween = child.playShowAnimation();
        if (tween && "kill" in tween && typeof tween.kill === "function") {
          this.tweeener.registerForDestruction(tween);
        }
        await tween;
      } else {
        await this.tweeener.fromTo(
          child,
          {
            alpha: 0,
          },
          {
            alpha: 1,
            duration: 0.24,
            ease: "power.out",
          }
        );
      }
    };

    await Promise.all(nonPersistentChildren.map((child, i) => showChild(child, i * stagger)));
  }

  clearContent() {
    /**
     * We don't want to loop through the children array
     * while also at the same time modifying it, so we're
     * making a copy here, and we'll loop over that.
     *
     * Additionally, we're filtering out any children that
     * should be persistent between clear calls.
     */
    const children = [...this.children];
    const persistentChildren = [...this.persistentElements];
    const nonPersistentChildren = children.filter(child => persistentChildren.indexOf(child) === -1);
    for (const child of nonPersistentChildren) {
      /**
       * The only exception is the background, which we
       * don't want to destroy. A popup can change its
       * background texture but can never exist without
       * a background.
       */
      child.destroy({ children: true });
    }
  }

  onDestroy = this.enchantments.onDestroy.bind(this.enchantments);
}

export function rarityLevelToSuffix(rarity: number) {
  return [`common`, `uncommon`, `rare`, `epic`, `legendary`, `mythic`][rarity - 1];
}
