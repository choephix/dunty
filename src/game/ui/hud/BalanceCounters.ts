import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { ResourceCounter } from "@game/ui/hud/ResourceCounter";
import { Container } from "@pixi/display";
import { Point } from "@pixi/math";

export function createBalanceCounters() {
  const context = GameSingletons.getGameContext();
  const { app, events, gameConfigData } = context;

  //// Construct and initialize indicators

  const container = new Container();
  container.zIndex = 100;

  let y = 0;
  const cfg = gameConfigData.features.hud.balanceIndicators;
  if (cfg.tocium) {
    const counter = new ResourceCounter({
      iconTexture: "ui-main/tocium-sm.png",
      iconGlowTexture: "ui-main/tocium-sm-glow.png",
      iconScaleMultiplier: 0.6,
      showDecimalsOnHover: true,
    });
    ResourceCounter.attachAnimatedValueGetter(counter, () => context.userData.tocium);
    container.addChild(counter);

    counter.position.y = y;
    y += counter.height;
  }

  if (cfg.animaticParticles) {
    const counter = new ResourceCounter({
      iconTexture: "ui-main/anomatter-sm.png",
      iconGlowTexture: "ui-main/tocium-sm-glow.png",
      iconScaleMultiplier: 0.9,
    });
    ResourceCounter.attachAnimatedValueGetter(counter, () => context.userData.anomaticParticles);
    container.addChild(counter);

    counter.position.y = y;
    y += counter.height;
  }

  //// Position indicators properly on the screen

  const padding = new Point(10, 20);
  const screenAnchor = new Point(0, 0);
  function updateIndicatorPositions({ width, height }: { width: number; height: number }) {
    container.position.set(
      padding.x + (width - padding.x - padding.x) * screenAnchor.x,
      padding.y + (height - padding.y - padding.y) * screenAnchor.y
    );
  }
  events.on({ resize: updateIndicatorPositions });
  updateIndicatorPositions(app.screen);

  return container;
}

export type BalanceCounters = ReturnType<typeof createBalanceCounters>;
