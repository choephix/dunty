import { TooltipManager } from "@sdk-pixi/TooltipManager";
import { Application } from "@pixi/app";

let bucket: ReturnType<typeof createGameSingletonsBucket> = null!;

export module GameSingletons {
  export function getPixiApplicaiton() {
    return bucket.app as Application;
  }

  export function getTooltipManager() {
    return bucket.tooltipManager;
  }
}

export function initializeGameSingletons(app: Application) {
  bucket = createGameSingletonsBucket(app);
}

function createGameSingletonsBucket(app: Application) {
  return {
    app,
    tooltipManager: new TooltipManager(app.stage),
  };
}
