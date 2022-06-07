import { Application } from "@pixi/app";
import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";

const BASE = "https://public.cx/mock/surfaces/";
const TILES = [
  "3641f9eadeb0a48bc77d50aec8a360ae.jpg",
  "3641f9eadeb0a48bc77d50aec8a360ae.jpg",
  "3641f9eadeb0a48bc77d50aec8a360ae.jpg",
  "3641f9eadeb0a48bc77d50aec8a360ae.jpg",
  "3641f9eadeb0a48bc77d50aec8a360ae.jpg",
  "3641f9eadeb0a48bc77d50aec8a360ae.jpg",
  "3641f9eadeb0a48bc77d50aec8a360ae.jpg",
  "3641f9eadeb0a48bc77d50aec8a360ae.jpg",
  "3641f9eadeb0a48bc77d50aec8a360ae.jpg",
  "3641f9eadeb0a48bc77d50aec8a360ae.jpg",
  "3641f9eadeb0a48bc77d50aec8a360ae.jpg",
  "3641f9eadeb0a48bc77d50aec8a360ae.jpg",
  "3641f9eadeb0a48bc77d50aec8a360ae.jpg",
];

export function initializeSurfaceWorld(app: Application) {
  console.log("Initializing surface world...");

  const tile = new Tile(0);
  app.stage.addChild(tile);
}

const tileSize = 256;

export class Tile extends Sprite {
  constructor(typeIndex: number) {
    super();

    this.anchor.set(0.5);

    Texture.fromURL(BASE + TILES[typeIndex]).then(texture => {
      this.texture = texture;
      this.scale.set(tileSize / texture.width);
    });
  }
}
