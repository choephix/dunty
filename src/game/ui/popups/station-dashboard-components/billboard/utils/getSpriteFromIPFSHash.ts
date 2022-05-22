import { __window__ } from "@debug/__";
import { Texture } from "@pixi/core";
import { AnimatedGIF } from "@pixi/gif";
import { Loader, LoaderResource } from "@pixi/loaders";
import { Sprite } from "@pixi/sprite";
import { shuffle } from "@sdk/helpers/arrays";
import { chance } from "@sdk/utils/random";
import { makeURLsFromIPFSHash } from "./makeURLsFromIPFSHash";

const ipfsLoader = new Loader();
function waitUntilLoaderNotBusy() {
  return new Promise<void>(resolve => {
    function loop() {
      if (ipfsLoader.loading) {
        requestAnimationFrame(loop);
      } else {
        resolve();
      }
    }
    loop();
  });
}

async function getSpriteFromURL(url: string, loader = ipfsLoader) {
  const getResource = (url: string) => {
    const existingResource = loader.resources[url];
    if (existingResource) {
      return Promise.resolve(existingResource);
    }

    return new Promise<LoaderResource>((resolve, reject) => {
      try {
        loader.add(
          url,
          {
            loadType: LoaderResource.LOAD_TYPE.XHR,
            xhrType: LoaderResource.XHR_RESPONSE_TYPE.BUFFER,
          },
          resolve
        );
        loader.load();
        loader.onError.add(reject);
      } catch (error) {
        reject(error);
      }
    });
  };

  try {
    await waitUntilLoaderNotBusy();

    const resource = await getResource(url);

    if (resource.data && new TextDecoder().decode(resource.data)?.includes?.("GIF")) {
      console.log(`🎨 is GIF: ${url}`);
      return AnimatedGIF.fromBuffer(resource.data);
    } else {
      console.log(`🎨 is not GIF: ${url}`);
      const texture = await Texture.fromURL(url);
      if (texture) {
        return new Sprite(texture);
      }
    }
  } catch (error) {
    console.error(error);
  }

  return null;
}

export async function getSpriteFromIPFSHash(ipfsHash: string) {
  const urls = makeURLsFromIPFSHash(ipfsHash);
  if (chance(0.45)) {
    shuffle(urls);
  }
  for (const url of urls) {
    try {
      const sprite = await getSpriteFromURL(url);
      console.log(`🎨 is loaded: ${url} into`, sprite);
      if (sprite) {
        return sprite;
      }
    } catch (e) {
      continue;
    }
  }
  return null;
}
