import { __window__ } from "@debug/__window__";
import { Application } from "@pixi/app";
import { Sprite } from "@pixi/sprite";
import { getRandomItemFrom } from "@sdk/helpers/arrays";
import { range2D } from "@sdk/math/range2d";
import { randomInt, randomIntBetweenIncluding } from "@sdk/utils/random";
import { gsap } from "gsap";
import { Viewport } from "pixi-viewport";
import { Tile, TileHolo, TILE_SIZE } from "./tiles";

const BASE = "https://public.cx/mock/surfaces/";
const TILES = [
  `023b60bbc3877990a3b1ff4d805513a8.jpg`, // grass
  `c412de6208fca6ab77ad117eb74c6387.jpg`, // grass dk
  `af8753c5bbbb6310baad7b8f8d8847e1.jpg`, // rock
  `3767d2aaa55ae0afe5db1b75683293de.jpg`, // magical blue rock
  `18cbfcd1190b26645d81b0b25eac198e.jpg`, // lava-ish
  `bfec9c57d9f67f5d34336323a38aca41.jpg`, // alien cheese
];

export function initializeSurfaceWorld(app: Application) {
  console.log("Initializing surface world...");

  const viewport = new Viewport();
  viewport.drag().wheel().pinch().decelerate();
  viewport.position.set(window.innerWidth / 2, window.innerHeight / 2);
  app.stage.addChild(viewport);

  const tiles = new Array<Tile>();

  const GROUP_SIZE = 5;
  const GR = Math.floor(GROUP_SIZE / 2);

  for (let [gx, gy] of range2D.fromToIncluding(-4, -4, 4, 4)) {
    if (gx === 0 && gy === 0) {
      for (let [dx, dy] of range2D.fromToIncluding(-GR, -GR, GR, GR)) {
        const file = `79780337e003fd1cab5db4775c5516f8.jpg`;
        const tile = new Tile(BASE + file);
        viewport.addChild(tile);

        const ix = gx * GROUP_SIZE + dx;
        const iy = gy * GROUP_SIZE + dy;
        const p = worldToIsometricPosition(ix, iy);
        tile.isDungeonTile = true;
        tile.position.set(p.x * TILE_SIZE, p.y * TILE_SIZE);
        tile.zIndex = tile.x + tile.y * 10;

        tiles.push(tile);
      }
    } else {
      const variety = 2;
      const rand = randomIntBetweenIncluding(0, TILES.length - variety, 4);
      const tilePool = TILES.slice(rand, rand + variety);

      for (let [dx, dy] of range2D.fromToIncluding(-GR, -GR, GR, GR)) {
        const file = tilePool[randomIntBetweenIncluding(0, tilePool.length - 1, 4)];
        const tile = new Tile(BASE + file);
        viewport.addChild(tile);

        const ix = gx * GROUP_SIZE + dx;
        const iy = gy * GROUP_SIZE + dy;
        const p = worldToIsometricPosition(ix, iy);
        tile.position.set(p.x * TILE_SIZE, p.y * TILE_SIZE);
        tile.zIndex = tile.x + tile.y * 10;

        tiles.push(tile);

        tile.textureFileName = file;
      }
    }
  }

  const dungeon = Sprite.from("https://public.cx/dunty/dungeon.png");
  dungeon.position.set(0, -7);
  dungeon.anchor.set(0.5);
  dungeon.scale.set(0.735);
  dungeon.zIndex = Number.MAX_SAFE_INTEGER;
  viewport.addChild(dungeon);

  for (const tile of tiles) {
    if (tile.isDungeonTile) continue;
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
  holo.zIndex = Number.MAX_SAFE_INTEGER;
  viewport.addChild(holo);

  for (const tile of tiles) {
    if (tile.isDungeonTile) continue;
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
    btn.on("click", () => {
      console.log(tile.textureFileName);
      navigator.clipboard.writeText(tile.textureFileName);
    });
  }

  __window__.tiles = viewport;

  function sortWorldObjectsZIndex() {
    for (const child of viewport.children) {
      child.zIndex = child.x * 0.1 + child.y;
    }
    dungeon.zIndex += 1.5 * TILE_SIZE;
    viewport.sortChildren();
  }

  sortWorldObjectsZIndex();

  // app.stage.addChild(testTheTest());
}

function worldToIsometricPosition(x: number, y: number) {
  const SQRT_2H = Math.sqrt(2) * 0.5;
  return {
    x: SQRT_2H * (x - y),
    y: SQRT_2H * (x + y) * 0.5,
  };
}
