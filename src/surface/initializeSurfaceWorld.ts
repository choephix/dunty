import { __window__ } from "@debug/__window__";
import { Application } from "@pixi/app";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { range2D } from "@sdk/math/range2d";
import { randomInt } from "@sdk/utils/random";
import { Viewport } from "pixi-viewport";
import { gsap } from "gsap";
import { BLEND_MODES } from "@pixi/constants";
import { getRandomItemFrom } from "@sdk/helpers/arrays";

const BASE = "https://public.cx/mock/surfaces/";
const TILES = [
  "3641f9eadeb0a48bc77d50aec8a360ae.jpg",
  "0767f8dbe3703c9d3edba82e3a9b89ef.jpg",
  "023b60bbc3877990a3b1ff4d805513a8.jpg",
  "58732ace5d81e17aa3fb7fd018262d59.jpg",
  "1c29e55d284fe7c0582c90d5d7d75ccd.jpg",
  "c98be884b1fac395ebc7ed0edb62cce1.jpg",
  "aeb6fed4559574069dc64f4a9a64daf1.jpg",
  "c412de6208fca6ab77ad117eb74c6387.jpg",
  "7da83283670af479f9352ebe2d88f34c.jpg", // lava
  "15f73d1dd4427c2ea6e1049c98bea160.jpg",
  "18cbfcd1190b26645d81b0b25eac198e.jpg",
  "15178a6071d9423e95984aa0d766ecff.jpg",
  "246217a3a77e1425584e62a85c7a9f1f.jpg",
  "4e472ba64c599c02e2c090c282cc9a30.jpg", // rocks
  "a89ef1e0c2150f88a29b41d691fa5dac.jpg",
  "fb9aedbc837487559b0682add892d1a6.jpg",
  "f0566f2cf7de8c6d134a2986e9cc0a96.jpg",
  "edae1e04b01a9c63e46b4060ac5e552a.jpg",
  "20739dedf5a3baec10487205f509dbf6.jpg",
  "bfec9c57d9f67f5d34336323a38aca41.jpg",
  "3767d2aaa55ae0afe5db1b75683293de.jpg",
  "1aeda412a19030b51ab42fc3e3da363b.jpg",
];

export function initializeSurfaceWorld(app: Application) {
  console.log("Initializing surface world...");

  const viewport = new Viewport();
  viewport.drag().wheel().pinch().decelerate();
  viewport.position.set(window.innerWidth / 2, window.innerHeight / 2);
  app.stage.addChild(viewport);

  const tiles = new Array<Tile>();

  const GROUP_SIZE = 5;
  for (let [gx, gy] of range2D.fromToIncluding(-4, -4, 4, 4)) {

    if (gx === 0 && gy === 0) continue;

    const variety = 3;
    const rand = randomInt(TILES.length - variety);
    const tilePool = TILES.slice(rand, rand + variety);

    const DXY = Math.floor(GROUP_SIZE / 2);
    for (let [dx, dy] of range2D.fromToIncluding(-DXY, -DXY, DXY, DXY)) {
      const file = getRandomItemFrom(tilePool);
      const tile = new Tile(BASE + file);
      viewport.addChild(tile);

      const ix = gx * GROUP_SIZE + dx;
      const iy = gy * GROUP_SIZE + dy;
      const p = worldToIsometricPosition(ix, iy);
      tile.position.set(p.x * TILE_SIZE, p.y * TILE_SIZE);
      tile.zIndex = tile.x + tile.y * 10;

      tiles.push(tile);
    }
  }

  for (const tile of tiles) {
    gsap.from(tile, {
      pixi: { pivotY: 100 },
      alpha: 0,
      delay: Math.random(),
      ease: "back.out",
      duration: 0.4,
    });
  }

  const holo = new TileHolo();
  holo.visible = false;
  viewport.addChild(holo);

  for (const tile of tiles) {
    const btn = tile.base.inner;
    btn.interactive = true;
    btn.buttonMode = true;
    btn.on("pointerover", () => {
      tile.base.outline.addChild(holo);
      holo.scale.set(2 / holo.parent.scale.x);
      holo.visible = true;
    });
    btn.on("pointerout", () => {
      holo.visible = false;
    });
  }

  __window__.tiles = viewport;
}

const TILE_SIZE = 128;

function worldToIsometricPosition(x: number, y: number) {
  const SQRT_2H = Math.sqrt(2) * 0.5;
  return {
    x: SQRT_2H * (x - y),
    y: SQRT_2H * (x + y) * 0.5,
  };
}

export class Tile extends Container {
  base: TileBase;

  // constructor(typeIndex: number) {
    // this.base = new TileBase(BASE + TILES[typeIndex]);

  constructor(textureURL: string) {
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
    this.outline.tint = 0x909090;
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
      this.inner.scale.set(0.95);
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
      const holo = Sprite.from(holoTextureId);
      holo.anchor.set(0.5);
      holo.tint = 0x00f0d0;
      holo.blendMode = BLEND_MODES.SCREEN;
      this.addChild(holo);
      await gsap.to(holo, { y: -64, x: -64, alpha: 0, duration: 3.5, ease: 'power1.in' });
      holo.destroy();
    };

    setInterval(spawnHolo, 350);
  }
}
