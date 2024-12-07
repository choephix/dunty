import { range2D } from "@sdk/math/range2d";
import { createNoise2D } from "simplex-noise";

const BASE = "https://undroop-assets.web.app/blackbeard/surfaces/";
const TILES = [
  `023b60bbc3877990a3b1ff4d805513a8.jpg`, // grass
  // `c412de6208fca6ab77ad117eb74c6387.jpg`, // grass dk
  `af8753c5bbbb6310baad7b8f8d8847e1.jpg`, // rock
  `18cbfcd1190b26645d81b0b25eac198e.jpg`, // lava-ish
  `bfec9c57d9f67f5d34336323a38aca41.jpg`, // alien cheese
  `3767d2aaa55ae0afe5db1b75683293de.jpg`, // magical blue rock
];

const TILES2 = [
  `5f6a91860d5fde67294ce5b424b525bd.jpg`, // rock
  // `c412de6208fca6ab77ad117eb74c6387.jpg`, // grass dk
  `023b60bbc3877990a3b1ff4d805513a8.jpg`, // grass
  `023b60bbc3877990a3b1ff4d805513a8.jpg`, // grass
  `023b60bbc3877990a3b1ff4d805513a8.jpg`, // grass
  `023b60bbc3877990a3b1ff4d805513a8.jpg`, // grass
  `023b60bbc3877990a3b1ff4d805513a8.jpg`, // grass
  `023b60bbc3877990a3b1ff4d805513a8.jpg`, // grass
  `af8753c5bbbb6310baad7b8f8d8847e1.jpg`, // rock
  `af8753c5bbbb6310baad7b8f8d8847e1.jpg`, // rock
  `18cbfcd1190b26645d81b0b25eac198e.jpg`, // lava-ish
];

interface TileNaturalData {
  gridPositionX: number;
  gridPositionY: number;
  textureUrl: string;
  textureFileName: string;
  isDungeonTile: boolean;
}

export function getWorldGridNaturalData() {
  const tiles = new Array<TileNaturalData>();

  const GROUP_RADIUS = 5;
  const GROUP_SIZE = 5;
  const GR = Math.floor(GROUP_SIZE / 2);

  const noise2D = createNoise2D();
  const noiseScale = 1 / 24;

  for (let [gx, gy] of range2D.fromToIncluding(-GROUP_RADIUS, -GROUP_RADIUS, GROUP_RADIUS, GROUP_RADIUS)) {
    if (gx === 0 && gy === 0) {
      for (let [dx, dy] of range2D.fromToIncluding(-GR, -GR, GR, GR)) {
        const file = `79780337e003fd1cab5db4775c5516f8.jpg`;
        const tile = {
          gridPositionX: gx * GROUP_SIZE + dx,
          gridPositionY: gy * GROUP_SIZE + dy,
          textureUrl: BASE + file,
          textureFileName: file,
          isDungeonTile: true,
        };
        tiles.push(tile);
      }
    } else {
      for (let [dx, dy] of range2D.fromToIncluding(-GR, -GR, GR, GR)) {
        const x = gx * GROUP_SIZE + dx;
        const y = gy * GROUP_SIZE + dy;

        // const noise = noise2D(noiseScale * x, noiseScale * y) * 0.5 + 0.5;
        const noise = Math.abs(noise2D(noiseScale * x, noiseScale* y));
        const typeIndex = Math.floor(noise * TILES2.length);
        const file = TILES2[typeIndex];

        const tile = {
          gridPositionX: x,
          gridPositionY: y,
          textureUrl: BASE + file,
          textureFileName: file,
          isDungeonTile: false,
        };
        tiles.push(tile);
      }
    }
  }

  return tiles;
}
