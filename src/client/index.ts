import "@client/index.css";

import { Application } from "@pixi/app";
import { boot } from "@sdk-pixi/core/boot";
import { launcherKey } from "./lib/urlParams";
import { ensureSingleInstance } from "./lib/ensureSingleInstance";

const __window__ = window as any;

const greateApp = () => {
  if (!__window__.APP) __window__.APP = boot();
  return __window__.APP as Application;
};

const LAUNCHERS = {
  async combat() {
    const app = greateApp();

    const { initializeGameSingletons } = await import("@dungeon/core/GameSingletons");
    initializeGameSingletons(app);

    const { main } = await import("@dungeon/main/main");
    main(app);
  },

  async floor() {
    const app = greateApp();

    const { initializeGameSingletons } = await import("@dungeon/core/GameSingletons");
    initializeGameSingletons(app);

    const { initializeDungeonFloor } = await import("@dungeon/floor/testFloor");
    initializeDungeonFloor(app);
  },

  async surface() {
    const app = greateApp();

    const { initializeGameSingletons } = await import("@dungeon/core/GameSingletons");
    initializeGameSingletons(app);

    const { initializeSurfaceWorld } = await import("@surface/initializeSurfaceWorld");
    initializeSurfaceWorld(app);
  },
};

ensureSingleInstance();

console.log("Client initializing...");

const launch = launcherKey in LAUNCHERS ? LAUNCHERS[launcherKey as keyof typeof LAUNCHERS] : LAUNCHERS.combat;
launch();
