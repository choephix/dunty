import { GameSingletons } from "@dungeon/core/GameSingletons";
import { CanvasSource, Sprite, Texture } from "pixi.js";

type SpotlightPoint = {
  x: number;
  y: number;
  radius: number;
  lean: number;
};

export class Spotlights extends Sprite {
  readonly canvasElement: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;

  constructor(readonly imageWidth = 20, readonly imageHeight = 20) {
    super();

    this.canvasElement = document.createElement("canvas");
    this.canvasElement.width = this.imageWidth;
    this.canvasElement.height = this.imageHeight;
    this.ctx = this.canvasElement.getContext("2d")!;
    this.texture = new Texture({ source: new CanvasSource({ resource: this.canvasElement }) });
  }

  updateSpotlights(points: SpotlightPoint[]) {
    const imageData = this.ctx.createImageData(this.imageWidth, this.imageHeight);
    const data = imageData.data;
    for (let i = 0; i < this.imageWidth * this.imageHeight; i++) {
      data[i * 4 + 0] = 0xff;
      data[i * 4 + 1] = 0xff;
      data[i * 4 + 2] = 0xff;
      let a = 0xff;
      for (const point of points) {
        const x = point.x * this.imageWidth;
        const y = point.y * this.imageHeight;
        const radius = point.radius * Math.min(this.imageWidth, this.imageHeight);

        const dx = (i % this.imageWidth) - x;
        const dy = Math.floor(i / this.imageWidth) - y;
        const d2 = dx * dx + dy * dy;
        if (d2 < radius * radius) {
          const mul = d2 / (radius * radius);
          a = a * Math.pow(mul, point.lean);
        }
      }
      data[i * 4 + 3] = ~~a;
    }
    this.ctx.putImageData(imageData, 0, 0);
    this.texture.source.update();
  }

}

export function testTheTest() {
  const points: SpotlightPoint[] = [
    { x: 0.5, y: 0.5, radius: 0.9, lean: 0.25 },
    { x: 0.8, y: 0.6, radius: 0.9, lean: 0.25 },
  ];

  const spotlights = new Spotlights();
  spotlights.updateSpotlights(points);
  spotlights.tint = 0x0;
  spotlights.alpha = 0.9;
  spotlights.blendMode = "multiply";

  const app = GameSingletons.getPixiApplicaiton();
  const pointer = { x: app.screen.width / 2, y: app.screen.height / 2 };
  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen;
  app.stage.on("pointermove", event => {
    pointer.x = event.global.x;
    pointer.y = event.global.y;
  });

  setInterval(() => {
    points[1].x = pointer.x / app.screen.width;
    points[1].y = pointer.y / app.screen.height;
    spotlights.updateSpotlights(points);
  }, 100);

  return spotlights;
}

export function testTheTestimage_Failed() {
  const width = 100;
  const height = 100;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(width, height);

  for (let i = 0; i < width * height; i++) {
    imageData.data[i * 4 + 0] = ~~(Math.random() * 0xff);
    imageData.data[i * 4 + 1] = ~~(Math.random() * 0xff);
    imageData.data[i * 4 + 2] = ~~(Math.random() * 0xff);
    imageData.data[i * 4 + 3] = 0xff;
  }

  ctx.putImageData(imageData, 0, 0);
  const texture = new Texture({ source: new CanvasSource({ resource: canvas }) });
  const noiseImg = new Sprite(texture);
  noiseImg.position.copyFrom({ x: 100, y: 100 });
  return noiseImg;
}
