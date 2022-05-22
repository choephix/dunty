import { Texture } from "@pixi/core";
import { shuffle } from "@sdk/helpers/arrays";
import { chance } from "@sdk/utils/random";
import { makeURLsFromIPFSHash } from "./makeURLsFromIPFSHash";

export async function getTextureFromIPFSHash(ipfsHash: string) {
  const urls = makeURLsFromIPFSHash(ipfsHash);
  if (chance(0.45)) {
    shuffle(urls);
  }
  for (const url of urls) {
    try {
      const texture = await Texture.fromURL(url);
      if (texture) {
        return texture;
      }
    } catch (e) {
      continue;
    }
  }
  return null;
}
