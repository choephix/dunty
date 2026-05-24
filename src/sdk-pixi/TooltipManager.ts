import { GameSingletons } from "@dungeon/core/GameSingletons";
import { ToolTipComponent } from "@sdk-pixi/ToolTipComponent";
import { Container, Point } from "pixi.js";
import type { FederatedPointerEvent } from "pixi.js";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";

type TooltipOptions = {
  content: string;
  horizontalAlign: number;
  verticalAlign: 1 | -1;
  position: { x: number; y: number };
  delay: number;
  wordWrapWidth: number;
};

const DEFAULT_DELAY = 0.7;

export class TooltipManager {
  private currentTooltip: ToolTipComponent | null = null;
  private currentTarget: Container | null = null;
  private timeoutHandle: ReturnType<typeof setTimeout> | null = null;
  private lastPointerPosition = new Point();

  public readonly targets = new Map<Container, Partial<TooltipOptions>>();

  constructor(public readonly container: Container) {
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
      if ((target as any).destroyed) {
        this.targets.delete(target);
      }
    }
  }

  registerTarget(target: Container, options: Partial<TooltipOptions> | string) {
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

    const on = (event: FederatedPointerEvent) => {
      clearCurrentTimeout();
      this.lastPointerPosition.copyFrom(event.global);
      this.timeoutHandle = setTimeout(() => this.setCurrentTooltipTarget(target), 1000 * delay);
    };

    const off = () => {
      clearCurrentTimeout();

      if (this.currentTarget === target) {
        this.setCurrentTooltipTarget(null);
      }

      requestAnimationFrame(() => this.clearDestroyedTargets());
    };

    target.eventMode = "static";
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

  private setCurrentTooltipTarget(target: Container | null) {
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
    const mousePosition = this.lastPointerPosition;

    const getDefaultHorizontalAnchor = () => {
      return (mousePosition.x / app.screen.width) * 2 - 1;
    };
    const getDefaultVerticalAnchor = () => {
      return mousePosition.y > app.screen.height * 0.9 ? -1 : 1;
    };

    const { horizontalAlign = getDefaultHorizontalAnchor(), verticalAlign = getDefaultVerticalAnchor() } = options;

    const getDefaultPosition = () => {
      const bounds = target.getBounds();
      const x = bounds.x + bounds.width / 2;
      if (verticalAlign === 1) {
        return { x, y: bounds.y + bounds.height };
      } else {
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

  playShowAnimationOn(tooltip: ToolTipComponent) {
    const tweeener = new TemporaryTweeener(tooltip);
    return tweeener.from(tooltip, {
      pixi: { scale: 0, alpha: 0 },
      duration: 0.29,
      ease: "back.out",
    });
  }

  hideAndDestroy(tooltip: ToolTipComponent) {
    const tweeener = new TemporaryTweeener(tooltip);
    return tweeener.to(tooltip, {
      pixi: { scale: 0.3, alpha: 0 },
      duration: 0.11,
      ease: "power2.in",
      onComplete: () => tooltip.destroy(),
    });
  }
}
