import { GameSingletons } from "@dungeon/core/GameSingletons";
import { ToolTipComponent } from "@sdk-pixi/ToolTipComponent";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
const DEFAULT_DELAY = .700;
export class TooltipManager {
    constructor(container) {
        this.container = container;
        this.currentTooltip = null;
        this.currentTarget = null;
        this.timeoutHandle = null;
        this.targets = new Map();
        this.handleClearOnClick();
    }
    handleClearOnClick() {
        const clear = () => this.setCurrentTooltipTarget(null);
        document.addEventListener("click", clear);
        document.addEventListener("tap", clear);
    }
    clear() {
        this.targets.clear();
        this.setCurrentTooltipTarget(null);
    }
    clearDestroyedTargets() {
        for (const [target] of this.targets) {
            if (target.destroyed) {
                this.targets.delete(target);
            }
        }
    }
    registerTarget(target, options) {
        if (typeof options === "string") {
            options = { content: options };
        }
        this.targets.set(target, options);
        const { delay = DEFAULT_DELAY } = options;
        const clearCurrentTimeout = () => {
            if (this.timeoutHandle) {
                clearTimeout(this.timeoutHandle);
                this.timeoutHandle = null;
            }
        };
        const on = () => {
            clearCurrentTimeout();
            this.timeoutHandle = setTimeout(() => this.setCurrentTooltipTarget(target), 1000 * delay);
        };
        const off = () => {
            clearCurrentTimeout();
            if (this.currentTarget === target) {
                this.setCurrentTooltipTarget(null);
            }
            requestAnimationFrame(() => this.clearDestroyedTargets());
        };
        target.interactive = true;
        target.on("pointerover", on);
        target.on("pointerout", off);
        target.on("removed", off);
        return () => {
            off();
            target.off("pointerover", on);
            target.off("pointerout", off);
            target.off("removed", off);
        };
    }
    setCurrentTooltipTarget(target) {
        if (this.currentTarget === target) {
            return;
        }
        if (this.currentTooltip) {
            this.hideAndDestroy(this.currentTooltip);
            this.currentTooltip = null;
            this.currentTarget = null;
            this.clearDestroyedTargets();
        }
        if (target == null) {
            return;
        }
        const options = this.targets.get(target);
        if (options == null || options.content == undefined) {
            return;
        }
        const app = GameSingletons.getPixiApplicaiton();
        const interaction = app.renderer.plugins.interaction;
        const mousePosition = interaction.mouse.global;
        const getDefaultHorizontalAnchor = () => {
            return mousePosition.x / (app.view.width / app.renderer.resolution) * 2 - 1;
        };
        const getDefaultVerticalAnchor = () => {
            return mousePosition.y > (app.view.height / app.renderer.resolution) * 0.9 ? -1 : 1;
        };
        const { horizontalAlign = getDefaultHorizontalAnchor(), verticalAlign = getDefaultVerticalAnchor() } = options;
        const getDefaultPosition = () => {
            const bounds = target.getBounds(true);
            const x = bounds.x + bounds.width / 2;
            if (verticalAlign === 1) {
                return { x, y: bounds.y + bounds.height };
            }
            else {
                return { x, y: bounds.y };
            }
        };
        const { content, wordWrapWidth, position = getDefaultPosition() } = options;
        const tooltip = new ToolTipComponent(content, horizontalAlign, verticalAlign, wordWrapWidth);
        tooltip.position.copyFrom(position);
        tooltip.scale.set(0.6);
        this.container.addChild(tooltip);
        this.currentTarget = target;
        this.currentTooltip = tooltip;
        this.playShowAnimationOn(tooltip);
    }
    playShowAnimationOn(tooltip) {
        const tweeener = new TemporaryTweeener(tooltip);
        return tweeener.from(tooltip, {
            pixi: { scale: 0, alpha: 0 },
            duration: 0.29,
            ease: "back.out",
        });
    }
    hideAndDestroy(tooltip) {
        const tweeener = new TemporaryTweeener(tooltip);
        return tweeener.to(tooltip, {
            pixi: { scale: 0.3, alpha: 0 },
            duration: 0.11,
            ease: "power2.in",
            onComplete: () => tooltip.destroy(),
        });
    }
}
//# sourceMappingURL=TooltipManager.js.map