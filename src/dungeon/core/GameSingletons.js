import { TooltipManager } from "@sdk-pixi/TooltipManager";
let bucket = null;
export var GameSingletons;
(function (GameSingletons) {
    function getPixiApplicaiton() {
        return bucket.app;
    }
    GameSingletons.getPixiApplicaiton = getPixiApplicaiton;
    function getTooltipManager() {
        return bucket.tooltipManager;
    }
    GameSingletons.getTooltipManager = getTooltipManager;
})(GameSingletons || (GameSingletons = {}));
export function initializeGameSingletons(app) {
    bucket = createGameSingletonsBucket(app);
}
function createGameSingletonsBucket(app) {
    return {
        app,
        tooltipManager: new TooltipManager(app.stage),
    };
}
//# sourceMappingURL=GameSingletons.js.map