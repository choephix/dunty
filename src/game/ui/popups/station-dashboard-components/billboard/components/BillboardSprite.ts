import { GameSingletons } from "@game/app/GameSingletons";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Rectangle } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { getSpriteFromIPFSHash } from "../utils/getSpriteFromIPFSHash";
import { LoadingSpinnerSprite } from "./LoadingSpinnerSprite";

const _spriteCache: Record<string, Sprite> = {};

const defaultImageArea = new Rectangle(29, 49, 662, 365);

export class BillboardSprite extends EnchantedContainer {
  private readonly context = GameSingletons.getGameContext();
  private readonly tweeener = new TemporaryTweeener(this);

  public readonly container: Container;
  public readonly billboardDimmer: Sprite;
  public readonly billboardFrame: Sprite;
  public readonly billboardImageContainer: Container;
  public readonly spinner: LoadingSpinnerSprite;

  private readonly imageArea = defaultImageArea;

  constructor() {
    super();
    /**
     * Adding another container within this container,
     * this container's scale can be freely set from outside,
     * while we animate the inner container's scale between 0 and 1.
     * without encountering issues from colliding scale setters.
     */
    this.container = new Container();
    this.addChild(this.container);

    this.billboardFrame = this.createFrame();
    this.billboardDimmer = this.createDimmer();
    this.billboardImageContainer = new Container();
    this.spinner = this.createSpinner();

    this.container.addChild(this.billboardFrame, this.billboardDimmer, this.billboardImageContainer, this.spinner);
    this.container.pivot.set(this.billboardFrame.width / 2, this.billboardFrame.height);

    this.setLoadingState(false);
  }

  private createSpinner() {
    const spinner = new LoadingSpinnerSprite();
    spinner.position.set(this.imageArea.x + this.imageArea.width / 2, this.imageArea.y + this.imageArea.height / 2);
    spinner.visible = false;
    spinner.alpha = 0.4;
    return spinner;
  }

  private createFrame() {
    const frameTextureId = "station-billboard/billboard-station-click.png";
    const texture = this.context.assets.getTexture(frameTextureId);
    const frame = new Sprite(texture);
    return frame;
  }

  private createDimmer() {
    const sprite = new Sprite(Texture.WHITE);
    sprite.alpha = 0.0;
    sprite.tint = 0x0;
    sprite.position.copyFrom(this.imageArea);
    sprite.width = this.imageArea.width;
    sprite.height = this.imageArea.height;
    return sprite;
  }

  protected setLoadingState(loading: boolean) {
    if (loading) {
      this.spinner.visible = true;
      this.billboardDimmer.alpha = 0.9;
    } else {
      this.spinner.visible = false;
      this.billboardDimmer.alpha = 0.6;
    }
  }

  public async setCurrentIPFSHash(ipfsHash: string) {
    this.billboardImageContainer.removeChildren();

    this.setLoadingState(true);

    const loadImageSprite = async () => {
      if (ipfsHash in _spriteCache) {
        const existingSprite = _spriteCache[ipfsHash];
        if (!existingSprite.destroyed) {
          _spriteCache[ipfsHash].scale.set(1);
          return _spriteCache[ipfsHash];
        } else {
          delete _spriteCache[ipfsHash];
        }
      }

      const sprite = await getSpriteFromIPFSHash(ipfsHash);
      if (sprite) {
        _spriteCache[ipfsHash] = sprite;
        return sprite;
      }

      const defaultTextureId = "station-billboard/default-billboard-content.png";
      const texture = this.context.assets.getTexture(defaultTextureId);
      const defaultSprite = new Sprite(texture);
      return defaultSprite;
    };

    const sprite = await loadImageSprite();
    this.setLoadingState(false);

    const scaleToFit = Math.min(this.imageArea.width / sprite.width, this.imageArea.height / sprite.height);
    sprite.scale.set(scaleToFit);
    sprite.anchor.set(0.5);
    sprite.position.set(this.imageArea.x + this.imageArea.width / 2, this.imageArea.y + this.imageArea.height / 2);
    this.billboardImageContainer.addChild(sprite);
  }

  public hide(immediate: boolean = false) {
    if (immediate) {
      this.container.scale.set(0);
      return Promise.resolve();
    } else {
      return this.tweeener.to(this.container, {
        pixi: { scale: 0 },
        duration: 0.3,
        ease: "back.in",
      });
    }
  }

  public show(immediate: boolean = false) {
    if (immediate) {
      this.container.scale.set(1);
      return Promise.resolve();
    } else {
      return this.tweeener.to(this.container, {
        pixi: { scale: 1 },
        duration: 0.45,
        ease: "back.out",
      });
    }
  }
}
