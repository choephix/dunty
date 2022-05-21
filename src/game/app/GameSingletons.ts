import { GameContext } from "@game/app/app";
import { ReadonlyDeep } from "type-fest/source/readonly-deep";

export module GameSingletons {
  let context: GameContext | null = null;

  export function setGameContextRef(gameContext: GameContext) {
    context = gameContext;
  }

  export function getGameContext() {
    if (context == null) {
      throw new Error("GameContext is not initialized");
    }

    return context;
  }

  export function getDataHolders() {
    if (context == null) {
      throw new Error("GameContext is not initialized");
    }

    return context as ReadonlyDeep<Pick<GameContext, "userData" | "mapData" | "gameConfigData">>;
  }

  export function getIntergrationServices() {
    if (context == null) {
      throw new Error("GameContext is not initialized");
    }

    return context as ReadonlyDeep<Pick<GameContext, "contracts" | "firebase">>;
  }

  export function getAssets() {
    if (context == null) {
      throw new Error("GameContext is not initialized");
    }

    return context.assets;
  }

  export function getSimpleObjectFactory() {
    if (context == null) {
      throw new Error("GameContext is not initialized");
    }

    return context.simpleFactory;
  }

  export function getAudioServices() {
    if (context == null) {
      throw new Error("GameContext is not initialized");
    }

    return context as ReadonlyDeep<Pick<GameContext, "sfx" | "music">>;
  }

  export function getSpinner() {
    if (context == null) {
      throw new Error("GameContext is not initialized");
    }

    return context.spinner;
  }

  export function getPixiApplication() {
    if (context == null) {
      throw new Error("GameContext is not initialized");
    }

    return context.app;
  }
}
