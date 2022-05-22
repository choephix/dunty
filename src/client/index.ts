import "./index.css";

import { Application } from "@pixi/app";

import { boot } from "@client/boot";
import { main } from "@client/main";

const __window__ = window as any;

console.log("Client initializing...");

const greateApp = () => {
  if (!__window__.APP) __window__.APP = boot();
  return __window__.APP as Application;
};

if (!__window__.__DUNTY_INITIALIZED__) {
  main(greateApp());
} else {
  console.error("Dunty is already initialized");
}


