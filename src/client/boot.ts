import { Renderer } from "@pixi/core";
import { Application, IApplicationOptions } from "@pixi/app";

import "@pixi/events";

import { InteractionManager } from "@pixi/interaction";
Renderer.registerPlugin("interaction", InteractionManager);

import { BatchRenderer } from "@pixi/core";
Renderer.registerPlugin("batch", BatchRenderer);

import { AppLoaderPlugin } from "@pixi/loaders";
Application.registerPlugin(AppLoaderPlugin);
import { Loader } from "@pixi/loaders";
import { SpritesheetLoader } from "@pixi/spritesheet";
Loader.registerPlugin(SpritesheetLoader);

import { Ticker } from "@pixi/ticker";
import "@pixi/math-extras";

import { skipHello } from "@pixi/utils";

import * as PIXI from "@pixi/display";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin);

gsap.defaults({ overwrite: "auto" });
gsap.ticker.lagSmoothing(33, 33);

skipHello();

const APP_DIV_ID = "app";
const CANVAS_ID = "canvas";

export function boot(applicationOptions: Partial<IApplicationOptions> = {}) {
  const parentElement = document.getElementById(APP_DIV_ID) ?? document.body;
  const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement | null;

  const app = new Application({
    backgroundColor: 0x1f1f1f,
    //backgroundColor: 0xFFFFFF,
    resolution: window.devicePixelRatio || 1,
    view: canvas || undefined,
    resizeTo: parentElement,
    autoDensity: true,
    antialias: true,
    sharedTicker: true,
    autoStart: true,
    ...applicationOptions,
  });

  parentElement.innerHTML = ``;
  parentElement.appendChild(app.view);

  const ticker = new Ticker();
  ticker.add(() => app.render());
  ticker.start();
  app.ticker = ticker;

  return app;
}
