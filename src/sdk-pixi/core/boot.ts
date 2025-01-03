import { Application, IApplicationOptions } from "@pixi/app";
import { Renderer, extensions } from "@pixi/core";

import "@pixi/events";

import { InteractionManager } from "@pixi/interaction";
extensions.add(InteractionManager);

import { BatchRenderer } from "@pixi/core";
extensions.add(BatchRenderer);

import { TilingSpriteRenderer } from "@pixi/sprite-tiling";
extensions.add(TilingSpriteRenderer);

import { AppLoaderPlugin, Loader } from "@pixi/loaders";
import { SpritesheetLoader } from "@pixi/spritesheet";
extensions.add(AppLoaderPlugin);
extensions.add(SpritesheetLoader);

import "@pixi/math-extras";
import { Ticker, UPDATE_PRIORITY } from "@pixi/ticker";

import { skipHello } from "@pixi/utils";

import * as PIXI from "@pixi/display";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { callOnEnterFrameRecursively } from "@sdk/pixi/enchant/oef/callOnEnterFrameRecursively";

import { settings } from "@pixi/settings";
import { initDebugging } from "@debug";
settings.FILTER_RESOLUTION = window.devicePixelRatio || 1;

PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin);

gsap.defaults({ overwrite: "auto" });
gsap.ticker.lagSmoothing(33, 33);

skipHello();

const APP_DIV_ID = "app";
const CANVAS_ID = "canvas";

initDebugging();

export function boot(applicationOptions: Partial<IApplicationOptions> = {}) {
  const parentElement = document.getElementById(APP_DIV_ID) ?? document.body;
  const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement | null;

  const app = new Application({
    backgroundColor: 0x090b0e,
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

  const onlyIfPageVisible = (callback: () => void) => (): void =>
    void (document.visibilityState === "visible" && callback());
  const ticker = new Ticker();
  ticker.start();
  ticker.add(
    onlyIfPageVisible(() => app.render()),
    null,
    UPDATE_PRIORITY.LOW
  );
  ticker.add(
    onlyIfPageVisible(() => callOnEnterFrameRecursively(app.stage)),
    null,
    UPDATE_PRIORITY.HIGH
  );
  app.ticker = ticker;

  return app;
}
