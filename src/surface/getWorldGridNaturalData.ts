import { range2D } from "@sdk/math/range2d";
import { randomIntBetweenIncluding } from "@sdk/utils/random";

const BASE = "https://undroop-assets.web.app/blackbeard/surfaces/";
const TILES = [
  `023b60bbc3877990a3b1ff4d805513a8.jpg`, // grass
  `c412de6208fca6ab77ad117eb74c6387.jpg`, // grass dk
  `af8753c5bbbb6310baad7b8f8d8847e1.jpg`, // rock
  `3767d2aaa55ae0afe5db1b75683293de.jpg`, // magical blue rock
  `18cbfcd1190b26645d81b0b25eac198e.jpg`, // lava-ish
  `bfec9c57d9f67f5d34336323a38aca41.jpg`, // alien cheese
];

interface TileNaturalData {
  gridPositionX: number;
  gridPositionY: number;
  textureUrl: string;
  textureFileName: string;
}

export function getWorldGridNaturalData() {
  const tiles = new Array<TileNaturalData>();

  const GROUP_SIZE = 5;
  const GR = Math.floor(GROUP_SIZE / 2);

  for (let [gx, gy] of range2D.fromToIncluding(-4, -4, 4, 4)) {
    if (gx === 0 && gy === 0) {
      for (let [dx, dy] of range2D.fromToIncluding(-GR, -GR, GR, GR)) {
        const file = `79780337e003fd1cab5db4775c5516f8.jpg`;
        const tile = {
          gridPositionX: gx * GROUP_SIZE + dx,
          gridPositionY: gy * GROUP_SIZE + dy,
          textureUrl: BASE + file,
          textureFileName: file,
        };
        tiles.push(tile);
      }
    } else {
      const variety = 2;
      const rand = randomIntBetweenIncluding(0, TILES.length - variety, 4);
      const tilePool = TILES.slice(rand, rand + variety);
      for (let [dx, dy] of range2D.fromToIncluding(-GR, -GR, GR, GR)) {
        const file = tilePool[randomIntBetweenIncluding(0, tilePool.length - 1, 4)];
        const tile = {
          gridPositionX: gx * GROUP_SIZE + dx,
          gridPositionY: gy * GROUP_SIZE + dy,
          textureUrl: BASE + file,
          textureFileName: file,
        };
        tiles.push(tile);
      }
    }
  }

  return tiles;
}
