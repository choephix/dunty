import { __addLabel } from "@debug/objects/__addLabel";
import { __DEBUG__ } from "@debug/__DEBUG__";
import { addBoostedLocoGlow } from "@game/asorted/fx/addBoostedLocoGlow";
import { CardImageIPFSHash, getProperTexture, getProperTextureFromCache } from "@game/assets/cards";
import { CardEntity } from "@game/data/entities/CardEntity";
import { CardTemplate } from "@game/data/entities/CardTemplate";
import { WRAP_MODES } from "@pixi/constants";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { CardData } from "@sdk-integration/contracts";
import { nextFrame } from "@sdk/utils/promises";
import { CardSpriteErrorOverlay } from "./CardSpriteErrorOverlay";
import { CardSpriteSkeletonOverlay } from "./CardSpriteSkeletonOverlay";
import { CardSpriteSubtleMessageOverlay } from "./CardSpriteSubtleMessageOverlay";

export const CARD_SPRITE_DIMENSIONS = {
  width: 512,
  height: 717,
};

export const CARD_SPRITE_CENTER = {
  x: Math.round(CARD_SPRITE_DIMENSIONS.width / 2),
  y: Math.round(CARD_SPRITE_DIMENSIONS.height / 2),
};

const cardSpriteEmptyTexture = Texture.EMPTY.clone();
cardSpriteEmptyTexture.baseTexture.wrapMode = WRAP_MODES.REPEAT;
cardSpriteEmptyTexture._frame.width = CARD_SPRITE_DIMENSIONS.width;
cardSpriteEmptyTexture._frame.height = CARD_SPRITE_DIMENSIONS.height;
cardSpriteEmptyTexture.updateUvs();

export class CardSprite extends Container {
  private readonly shouldUseSuperCompressedTexture = true;

  private placeholder: CardSpriteSkeletonOverlay | null = null;
  public __label: Text | null = null;

  public readonly shade: Sprite;
  public readonly image: Sprite;

  public overlay: CardSpriteErrorOverlay | CardSpriteSubtleMessageOverlay | null = null;

  /**
   * Please use .pivot instead of anchor for the instances of CardSprite.
   *
   * This is because setting achor does not also move the children of the sprite,
   * resulting in misaligned components.
   *
   * As a shorthand, you can also use .setPivotFraction() to set the pivot
   * to a fraction of the sprite's dimensions.
   */
  // @ts-ignore
  get anchor() {
    throw new Error("Please do not use anchor for the instances of CardSprite");
  }

  public get width(): number {
    return CARD_SPRITE_DIMENSIONS.width * this.scale.x;
  }
  public set width(value: number) {
    this.scale.x = value / CARD_SPRITE_DIMENSIONS.width;
  }
  public get height(): number {
    return CARD_SPRITE_DIMENSIONS.height * this.scale.y;
  }
  public set height(value: number) {
    this.scale.y = value / CARD_SPRITE_DIMENSIONS.height;
  }

  public readonly assetData: CardData | CardTemplate | null;
  public readonly entity: CardEntity | null;

  constructor(data: CardEntity | CardData | CardTemplate | null, autoTextureSelf: boolean = false) {
    super();

    this.shade = new Sprite(Texture.from(`cardShade`));
    this.shade.anchor.set(0.5);
    this.shade.position.copyFrom(CARD_SPRITE_CENTER);
    this.addChild(this.shade);

    this.image = new Sprite(cardSpriteEmptyTexture);
    this.image.anchor.set(0.5);
    this.image.position.copyFrom(CARD_SPRITE_CENTER);
    this.addChild(this.image);

    if (data == null) {
      this.assetData = null;
      this.entity = null;
      this.addPlaceholder();
      return;
    }

    const assetError = ("assetError" in data && data.assetError) || null;

    if ("data" in data) {
      this.entity = data;
      data = data.data;
    } else {
      this.entity = null;
    }

    this.assetData = data;

    if (assetError) {
      this.setErrorOverlayMessage(assetError.message, 0xff5050);
    }

    if (autoTextureSelf) {
      const imageIPFSHash = data.img;
      nextFrame().then(this.autoTextureSelf.bind(this, imageIPFSHash));
    }

    if (__DEBUG__) {
      if ("asset_id" in data) {
        __addLabel(this, data.asset_id, 2);
      }
    }

    this.sortableChildren = true;

    if ("boosted" in data && data.boosted) {
      addBoostedLocoGlow(this);
    }
  }

  public setErrorOverlayMessage(message: string | null, color?: number) {
    if (this.overlay) {
      this.overlay.destroy();
    }

    if (message) {
      this.overlay = new CardSpriteErrorOverlay(message, color);
      this.overlay.zIndex = 100;
      this.overlay.centerSelf();
      this.overlay.position.copyFrom(CARD_SPRITE_CENTER);
      this.addChild(this.overlay);
    }
  }

  public setSubtleOverlayMessage(message: string | null, color?: number) {
    if (this.overlay) {
      this.overlay.destroy();
    }

    if (message) {
      this.overlay = new CardSpriteSubtleMessageOverlay(message, color);
      this.overlay.zIndex = 100;
      this.overlay.centerSelf();
      this.overlay.position.copyFrom(CARD_SPRITE_CENTER);
      this.addChild(this.overlay);
    }
  }

  public setPivotFraction(fracX = 0.5, fracY = fracX) {
    this.pivot.set(CARD_SPRITE_DIMENSIONS.width * fracX, CARD_SPRITE_DIMENSIONS.height * fracY);
  }

  private autoTextureSelf(imageIPFSHash: CardImageIPFSHash) {
    const cachedTexture = getProperTextureFromCache(this.shouldUseSuperCompressedTexture, imageIPFSHash);
    if (cachedTexture) {
      this.image.texture = cachedTexture;
    } else {
      this.loadProperTexture(imageIPFSHash);
      this.addPlaceholder();
    }
  }

  public async loadProperTexture(imageIPFSHash: CardImageIPFSHash) {
    try {
      const properTexture = await getProperTexture(this.shouldUseSuperCompressedTexture, imageIPFSHash);
      await this.setProperTexture(properTexture);
    } catch (e) {
      console.error(`Error while loading proper card texture`, e);
    }
  }

  public addPlaceholder() {
    this.placeholder = new CardSpriteSkeletonOverlay(this);
    this.addChild(this.placeholder);
  }

  public async setProperTexture(properTexture: Texture) {
    try {
      await upToOncePerFrame.addMonkeyPromise(() => this.zIndex);

      if (this.destroyed) {
        return;
      }

      this.image.texture = properTexture;

      this.placeholder?.hideAndDestroy();
    } catch (e) {
      console.error(`Error while applying proper card texture`, e);
    }
  }
}

//// ------------------------------

module upToOncePerFrame {
  type UpToOncePerFrameMonkey = (() => unknown) & { getPriority?: (() => number) | undefined };

  const monkeys = new Array<UpToOncePerFrameMonkey>();
  let handle = -1;

  export function addMonkeyPromise(getPriority?: () => number) {
    if (handle === -1) {
      handle = requestAnimationFrame(onEnterFrame);
    }
    return new Promise<void>(resolve => monkeys.push(Object.assign(resolve, { getPriority })));
  }

  export function addMonkey(cb: () => unknown) {
    monkeys.push(cb);
    if (handle === -1) {
      handle = requestAnimationFrame(onEnterFrame);
    }
  }

  function onEnterFrame() {
    monkeys.sort((a, b) => (b.getPriority?.() ?? 0) - (a.getPriority?.() ?? 0));
    monkeys.shift()?.();
    if (monkeys.length > 0) {
      handle = requestAnimationFrame(onEnterFrame);
    } else {
      handle = -1;
    }
  }
}
