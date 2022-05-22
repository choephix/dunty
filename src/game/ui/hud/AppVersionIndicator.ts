import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { env } from "@game/app/global";
import { FontFamily } from "@game/constants/FontFamily";
import { FontIcon } from "@game/constants/FontIcon";
import { Point } from "@pixi/math";
import { Text } from "@pixi/text";

export function createAppVersionIndicator() {
  const context = GameSingletons.getGameContext();
  const { app, events, VERSION } = context;

  const padding = new Point(25, 20);
  const screenAnchor = new Point(0.0, 1.0);

  const version = env.ENVIRONMENT === "production" ? `${FontIcon.CenturyTrain} ${VERSION}` : env.COMMIT_HASH;

  const tf = new Text(version.toUpperCase(), {
    fontFamily: FontFamily.Default,
    fontSize: 10,
    fill: 0xffffff,

    stroke: "#080808",
    strokeThickness: 1,

    // dropShadow: true,
    // dropShadowAngle: 1.57079632679,
    // dropShadowColor: 0x010101,
    // dropShadowDistance: 2,
    // dropShadowAlpha: 0.75,
  });
  tf.alpha = 0.4;
  tf.zIndex = 100;
  tf.anchor.copyFrom(screenAnchor);
  context.stageContainers._hud.addChild(tf);

  function updateIndicatorPositions({ width, height }: { width: number; height: number }) {
    tf.updateText(false);
    tf.x = (width - padding.x - padding.x) * screenAnchor.x + padding.x;
    tf.y = (height - padding.y - padding.y) * screenAnchor.y + padding.y;
  }
  events.on({ resize: updateIndicatorPositions });
  updateIndicatorPositions(app.screen);

  return tf;
}

export type AppVersionIndicator = ReturnType<typeof createAppVersionIndicator>;
