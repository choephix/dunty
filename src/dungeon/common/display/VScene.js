import { GameSingletons } from "@dungeon/core/GameSingletons";
import { __DEBUG__ } from "@dungeon/debug/URL_PARAMS";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
const DESIGN_SPECS = {
    width: 1080,
    height: 1920,
};
export class VScene extends Container {
    constructor() {
        super();
        this.designWidth = DESIGN_SPECS.width;
        this.designHeight = DESIGN_SPECS.height;
        this.tweeener = new TemporaryTweeener(this);
        this.sortableChildren = true;
        if (__DEBUG__) {
            const border = new Graphics();
            border.lineStyle(4, 0xffffff);
            border.drawRect(0, 0, this.designWidth, this.designHeight);
            border.alpha = 0.05;
            border.zIndex = Number.MAX_SAFE_INTEGER;
            this.addChild(border);
        }
    }
    onEnterFrame() {
        const app = GameSingletons.getPixiApplicaiton();
        const SCALE = Math.min(app.screen.width / this.designWidth, app.screen.height / this.designHeight);
        this.scale.set(SCALE);
        this.position.set(0.5 * (app.screen.width - this.designWidth * SCALE), 0.5 * (app.screen.height - this.designHeight * SCALE));
    }
    getFractionalPosition(x, y) {
        return { x: x * this.designWidth, y: y * this.designHeight };
    }
    playShowAnimation() {
        return this.tweeener.from(this, { alpha: 0, duration: 0.5 });
    }
    playHideAnimation() {
        return this.tweeener.to(this, { alpha: 0, duration: 1.5 });
    }
}
//# sourceMappingURL=VScene.js.map