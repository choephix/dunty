import "./index.css";

import { Application } from "@pixi/app";

import { boot } from "@client/boot";
import { main } from "@client/main";

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

  main(greateApp());
}

export module GameSingletons {
  export function getPixiApplicaiton() {
    return __window__.APP as Application;
  }
}
