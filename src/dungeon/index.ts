import "./index.css";

import { Application } from "@pixi/app";

import { boot } from "@dungeon/core/boot";
import { main } from "@dungeon/main/main";
import { initializeGameSingletons } from "@dungeon/core/GameSingletons";

const __window__ = window as any;

if (__window__.__DUNTY_INITIALIZED__) {
  console.warn(`An instance of the game already exists.`, __window__.main);
} else {
  console.log("Client initializing...");

  __window__.__DUNTY_INITIALIZED__ = true;

  const greateApp = () => {
    if (!__window__.APP) __window__.APP = boot();
    return __window__.APP as Application;
  };

  const app = greateApp();

  initializeGameSingletons(app);

  main(app);
}