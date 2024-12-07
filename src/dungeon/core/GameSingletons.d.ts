import { TooltipManager } from "@sdk-pixi/TooltipManager";
import { Application } from "@pixi/app";
export declare module GameSingletons {
    function getPixiApplicaiton(): Application;
    function getTooltipManager(): TooltipManager;
}
export declare function initializeGameSingletons(app: Application): void;
