import { GameSingletons } from "@dungeon/core/GameSingletons";
import { BLEND_MODES } from "@pixi/constants";
import { BaseTexture, BufferResource, resources, Texture } from "@pixi/core";
import { InteractionManager } from "@pixi/interaction";
import { Sprite } from "@pixi/sprite";

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
    this.ctx = this.canvasElement.getContext("2d");
  }

  updateSpotlights(points: SpotlightPoint[]) {
    const imageData = this.ctx.createImageData(this.imageWidth, this.imageHeight); // only do this once per page
    const data = imageData.data; // only do this once per page
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
    const canvasTexture = new Texture(new BaseTexture(this.canvasElement));
    this.texture = canvasTexture;
  }

  render(...[renderer]: Parameters<Sprite["render"]>) {
    super.render.call(this, renderer);
    this.width = renderer.view.width;
    this.height = renderer.view.height;
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
  spotlights.blendMode = BLEND_MODES.MULTIPLY;

  const app = GameSingletons.getPixiApplicaiton();
  const interaction: InteractionManager = app.renderer.plugins.interaction;

  setInterval(() => {
    // points[0].y = Math.random();
    // points[0].x = Math.random();
    points[1].x = interaction.mouse.global.x / app.renderer.view.width;
    points[1].y = interaction.mouse.global.y / app.renderer.view.height;
    spotlights.updateSpotlights(points);
  }, 100);

  return spotlights;
}

export function testTheTestimage_Failed() {
  const width = 100;
  const height = 100;
  const colorHexValues = new Array<number>();
  for (let i = 0; i < width * height; i++) {
    colorHexValues.push(~~(Math.random() * 0xffffff));
    colorHexValues.push(~~(Math.random() * 0xffffff));
    colorHexValues.push(~~(Math.random() * 0xffffff));
    colorHexValues.push(0xffffff);
  }

  let options = {
    width: width,
    height: height,
  };
  let colorValues = Uint32Array.from(colorHexValues);

  let u8 = new Uint8Array(colorValues.buffer); // This doesn't copy. It's just another view to same memory location

  let br = new BufferResource(u8, options); // constructor only works with Uint8Array
  let bt = new BaseTexture(br);
  let texture = new Texture(bt);

  let noiseImg = new Sprite(texture);
  noiseImg.position.copyFrom({ x: 100, y: 100 });
  return noiseImg;
}
