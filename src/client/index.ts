import "@client/index.css";

import { Application } from "@pixi/app";
import { boot } from "@sdk-pixi/core/boot";

const __window__ = window as any;

const greateApp = () => {
  if (!__window__.APP) __window__.APP = boot();
  return __window__.APP as Application;
};

const LAUNCHERS = {
  async dungeon() {
    const app = greateApp();

    const { initializeGameSingletons } = await import("@dungeon/core/GameSingletons");
    initializeGameSingletons(app);

    const { main } = await import("@dungeon/main/main");
    main(app);
  },
  async surface() {
    const app = greateApp();

    const { initializeGameSingletons } = await import("@dungeon/core/GameSingletons");
    initializeGameSingletons(app);

    const { initializeSurfaceWorld } = await import("@surface/initializeSurfaceWorld");
    initializeSurfaceWorld(app);
  },
};

if (__window__.__DUNTY_INITIALIZED__) {
  console.warn(`An instance of the game already exists.`, __window__.main);
} else {
  console.log("Client initializing...");

  __window__.__DUNTY_INITIALIZED__ = true;

  LAUNCHERS.dungeon();
  // LAUNCHERS.surface();
}
