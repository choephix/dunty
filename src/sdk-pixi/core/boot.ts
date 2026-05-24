import * as PIXI from "pixi.js";
import { Application, Filter, Ticker, UPDATE_PRIORITY } from "pixi.js";
import type { ApplicationOptions } from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { initDebugging } from "@debug";
import { callOnEnterFrameRecursively } from "@sdk/pixi/enchant/oef/callOnEnterFrameRecursively";

Filter.defaultOptions.resolution = window.devicePixelRatio || 1;

PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin);

gsap.defaults({ overwrite: "auto" });
gsap.ticker.lagSmoothing(33, 33);

const APP_DIV_ID = "app";
const CANVAS_ID = "canvas";

initDebugging();

export async function boot(applicationOptions: Partial<ApplicationOptions> = {}) {
  const parentElement = document.getElementById(APP_DIV_ID) ?? document.body;
  const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement | null;

  const app = new Application();
  await app.init({
    backgroundColor: 0x090b0e,
    resolution: window.devicePixelRatio || 1,
    canvas: canvas || undefined,
    resizeTo: parentElement,
    autoDensity: true,
    antialias: true,
    sharedTicker: true,
    autoStart: true,
    hello: false,
    ...applicationOptions,
  });

  parentElement.innerHTML = ``;
  parentElement.appendChild(app.canvas);

  const onlyIfPageVisible = (callback: () => void) => (): void =>
    void (document.visibilityState === "visible" && callback());
  const ticker = new Ticker();
  ticker.start();
  ticker.add(
    onlyIfPageVisible(() => app.render()),
    undefined,
    UPDATE_PRIORITY.LOW
  );
  ticker.add(
    onlyIfPageVisible(() => callOnEnterFrameRecursively(app.stage)),
    undefined,
    UPDATE_PRIORITY.HIGH
  );
  Object.assign(app, { ticker });

  return app;
}
