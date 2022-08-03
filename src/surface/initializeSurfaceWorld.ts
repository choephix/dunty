import { __window__ } from "@debug/__window__";
import { Application } from "@pixi/app";
import { Sprite } from "@pixi/sprite";
import { Color } from "@sdk/utils/color/Color";
import { lerp } from "@sdk/utils/math";
import { gsap } from "gsap";
import { Viewport } from "pixi-viewport";
import { getWorldGridNaturalData } from "./getWorldGridNaturalData";
import { Tile, TileHolo, TILE_SIZE } from "./tiles";

export function initializeSurfaceWorld(app: Application) {
  console.log("Initializing surface world . . .");

  const viewport = new Viewport();
  viewport.drag().wheel().pinch().decelerate();
  viewport.position.set(window.innerWidth / 2, window.innerHeight / 2);
  app.stage.addChild(viewport);

  const tilesData = getWorldGridNaturalData();
  const tiles = new Array<Tile>();

  for (const tileData of tilesData) {
    const tile = new Tile(tileData.textureUrl);
    viewport.addChild(tile);

    const p = worldToIsometricPosition(tileData.gridPositionX, tileData.gridPositionY);
    tile.position.set(p.x * TILE_SIZE, p.y * TILE_SIZE);
    tile.textureFileName = tileData.textureFileName;
    tile.isDungeonTile = tileData.isDungeonTile;

    tiles.push(tile);

    const brightness = lerp(0.8, 1.0, Math.random());
    const tint = Color.lerp(0x000000, 0xffffff, brightness).toInteger();
    tile.base.inner.tint = tint;
    const tint2 = Color.lerp(0x000000, 0xffffff, brightness * .6).toInteger();
    tile.base.outline.tint = tint2;
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
      ease: "bounce.out",
      duration: 0.4,
    });
  }

  __window__.tiles = viewport;

  function addHoloShit() {
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
  }

  function sortWorldObjectsZIndex() {
    for (const child of viewport.children) {
      child.zIndex = child.x * 0.1 + child.y;
    }
    dungeon.zIndex += 1.5 * TILE_SIZE;
    viewport.sortChildren();
  }

  addHoloShit();

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
