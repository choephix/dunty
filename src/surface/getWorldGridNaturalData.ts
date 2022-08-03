import { range2D } from "@sdk/math/range2d";
import { createNoise2D } from "simplex-noise";

const BASE = "https://public.cx/dunty/tiles-ar-separated/";
const TILES = [
  `0155.webp`, // grass
  `0161.webp`, // grass
  `0164.webp`, // grass
  `0162.webp`, // grass
  `0129.webp`, // grass
  `0133.webp`, // grass
  `0163.webp`, // grass
  `0242.webp`, // grass
  `0006.webp`, // gras+dirt
  `0245.webp`, // gras+dirt
  `0171.webp`, // gras+dirt
  `0231.webp`, // gras+dirt
  `0172.webp`, // dirt
  `0065.webp`, // dirt
  `0064.webp`, // dirt
  `0063.webp`, // dirt
  `0179.webp`, // cave
  // `0176.webp`, // cave
  `0170.webp`, // wood
  `0079.webp`, // wood
  `0166.webp`, // woods
  `0169.webp`, // woods
  `0157.webp`, // woods
  `0165.webp`, // woods pine
  // `0173.webp`, // woods dry
  `0072.webp`, // mnt dirt
  `0071.webp`, // mnt dirt
  `0007.webp`, // mnt rock
  // `0058.webp`, // lava
  // `0057.webp`, // lava
  // `0226.webp`, // magma
  // `0225.webp`, // magma
  // `0227.webp`, // magma
  // `0003.webp`, // magma
  // `0247.webp`, // arte
  // `0248.webp`, // arte
  // `0249.webp`, // arte
  // `0250.webp`, // arte
  // `0246.webp`, // arte
  // `0131.webp`, // arte
  // `0136.webp`, // arte
  // `0128.webp`, // arte
  // `0001.webp`, // arte
  // `0009.webp`, // arte
];
const BUILDINGS = [
  `0002.webp`, // xxxx
  `0005.webp`, // xxxx
  `0008.webp`, // xxxx
  `0025.webp`, // xxxx
  `0024.webp`, // xxxx
  `0021.webp`, // xxxx
  `0020.webp`, // xxxx
  `0019.webp`, // xxxx
  `0018.webp`, // xxxx
  `0017.webp`, // xxxx
  `0016.webp`, // xxxx
  `0015.webp`, // xxxx
  `0014.webp`, // xxxx
  `0013.webp`, // xxxx
  `0010.webp`, // xxxx
  `0026.webp`, // xxxx
  `0028.webp`, // xxxx
  `0031.webp`, // xxxx
  `0033.webp`, // xxxx
  `0035.webp`, // xxxx
  `0037.webp`, // xxxx
  `0036.webp`, // xxxx
  `0038.webp`, // xxxx
  `0044.webp`, // xxxx
  `0042.webp`, // xxxx
  `0040.webp`, // xxxx
  `0075.webp`, // xxxx
  `0080.webp`, // xxxx
  `0082.webp`, // xxxx
  `0086.webp`, // xxxx
  `0088.webp`, // xxxx
  `0093.webp`, // xxxx
  `0116.webp`, // xxxx
  `0097.webp`, // xxxx
  `0107.webp`, // xxxx
  `0102.webp`, // xxxx
  `0101.webp`, // xxxx
  `0098.webp`, // xxxx
  `0096.webp`, // xxxx
  `0099.webp`, // xxxx
  `0159.webp`, // xxxx
  `0147.webp`, // xxxx
  `0097.webp`, // xxxx
  `0097.webp`, // xxxx
  `0244.webp`, // xxxx
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
        const noise = Math.abs(noise2D(noiseScale * x, noiseScale* y)) ** 1.5;
        const typeIndex = Math.floor(noise * TILES.length);
        const file = TILES[typeIndex];

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
