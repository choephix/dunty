import { Assets, Sprite, Texture, TilingSprite } from "pixi.js";

type TextureTarget = {
  texture: Texture;
};

type LoadableTextureTarget = TextureTarget & {
  textureLoadPromise?: Promise<Texture>;
};

export const loadTexture = (url: string) => Assets.load<Texture>(url);

export function setTextureFromUrl<T extends TextureTarget>(target: T, url: string) {
  const loadableTarget = target as LoadableTextureTarget;
  const textureLoadPromise = loadTexture(url).then(texture => {
    target.texture = texture;
    return texture;
  });

  loadableTarget.textureLoadPromise = textureLoadPromise;
  return textureLoadPromise;
}

export function spriteFromUrl(url: string) {
  const sprite = new Sprite(Texture.EMPTY) as Sprite & LoadableTextureTarget;
  setTextureFromUrl(sprite, url);
  return sprite;
}

export function tilingSpriteFromUrl(url: string, options: { width: number; height: number }) {
  const sprite = new TilingSprite({ texture: Texture.EMPTY, ...options }) as TilingSprite & LoadableTextureTarget;
  setTextureFromUrl(sprite, url);
  return sprite;
}

export const waitForTexture = (target: Partial<LoadableTextureTarget>) =>
  target.textureLoadPromise ?? Promise.resolve(target.texture ?? Texture.EMPTY);
