import { VScene } from "@dungeon/common/display/VScene";
import { BLEND_MODES } from "@pixi/constants";
import { TilingSprite } from "@pixi/sprite-tiling";
export declare class VCombatScene extends VScene {
    readonly backdrop: any;
    readonly ln: any;
    constructor();
    addStreakyEffect({ lnBlendMode, lnTint, lnAlpha }?: {
        lnBlendMode?: BLEND_MODES;
        lnTint?: number;
        lnAlpha?: number;
    }): TilingSprite & {
        onEnterFrame: () => number;
    };
    focusOn(target: number): void;
}
