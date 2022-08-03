import { BLEND_MODES } from "@pixi/constants";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { gsap } from "gsap";

export const TILE_SIZE = 128;

export class Tile extends Container {
  readonly base: TileBase;

  isDungeonTile: boolean = false;

  textureFileName?: string;

  constructor(public readonly textureURL: string) {
    super();

    this.base = new TileBase(textureURL);
    this.addChild(this.base);
  }
}

export class TileBase extends Container {
  readonly outline: Sprite;
  readonly inner: Sprite;

  constructor(textureURL: string) {
    super();

    this.outline = new Sprite();
    this.outline.anchor.set(0.5);
    this.outline.tint = 0xb0b0b0;
    this.addChild(this.outline);

    this.inner = new Sprite();
    this.inner.anchor.set(0.5);
    this.outline.addChild(this.inner);

    Texture.fromURL(textureURL).then(texture => {
      this.outline.texture = texture;
      this.outline.scale.set(TILE_SIZE / texture.width);
      this.outline.angle = 45;
      this.scale.y = 0.5;

      this.inner.texture = texture;
      // this.inner.scale.set(0.95);

      this.outline.scale.set(0.96);
      this.inner.y -= 4;
      this.inner.x -= 4;
    });
  }
}

export class TileHolo extends Container {
  constructor() {
    super();

    const holoTextureId = "https://public.cx/dunty/asorted/tile-holo.png";

    const holo = Sprite.from(holoTextureId);
    holo.anchor.set(0.5);
    holo.tint = 0x00f0d0;
    holo.blendMode = BLEND_MODES.ADD;
    this.addChild(holo);

    const spawnHolo = async () => {
      if (this.children.length > 40) return;
      const holo = Sprite.from(holoTextureId);
      holo.anchor.set(0.5);
      holo.tint = 0x00f0d0;
      holo.blendMode = BLEND_MODES.SCREEN;
      this.addChild(holo);
      await gsap.to(holo, { y: -64, x: -64, alpha: 0, duration: 3.5, ease: "power1.in" });
      holo.destroy();
    };

    setInterval(spawnHolo, 350);
  }
}
