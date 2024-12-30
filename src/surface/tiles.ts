import { BLEND_MODES } from "@pixi/constants";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { OutlineFilter } from "@pixi/filter-outline";
import { Sprite } from "@pixi/sprite";
import { gsap } from "gsap";

export const TILE_SIZE = 128;

export class Tile extends Container {
  readonly sprite: Sprite;

  isDungeonTile: boolean = false;

  textureFileName?: string;

  constructor(public readonly textureURL: string) {
    super();

    this.sprite = new Sprite();
    this.addChild(this.sprite);

    this.initialize();
  }

  async initialize() {
    const texture = await Texture.fromURL(this.textureURL);
    this.sprite.texture = texture;
    this.sprite.pivot.set(texture.width / 2, texture.height - 195);
    this.sprite.scale.set(0.2575, 0.2325);
    // this.sprite.filters = [new GlowFilter({
    //   distance: 40,
    //   color: 0xffffff,
    //   innerStrength: 1,
    //   quality: .1,
    //   outerStrength: 0,
    // })];
    // this.sprite.filters = [new OutlineFilter(3, 0x0, .2)];
  }

  debug() {
    const sq = this.addChild(new Sprite(Texture.WHITE));
    const tint = ~~(Math.random() * 0xffffff);
    this.sprite.tint = tint;
    sq.tint = tint;
  }
}

export class TileHolo extends Container {
  constructor() {
    super();

    const holoTextureId = "https://undroop.web.app/dunty/asorted/tile-holo.png";

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
