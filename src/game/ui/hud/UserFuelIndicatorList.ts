import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { Container } from "@pixi/display";
import { Point } from "@pixi/math";
import { Text } from "@pixi/text";
import { createValueAnimator_Counter } from "../common/createValueAnimator_Counter";

type FuelType = "coal" | "diesel";
type FuelStatus = Readonly<Record<FuelType, number | string>>;

export function createUserFuelIndicatorsList() {
  const { app, events, ticker, userData } = GameSingletons.getGameContext();

  const padding = new Point(25, 40);
  const screenAnchor = new Point(0, 1);

  //// Construct and initialize indicators

  const container = new Container();
  container.zIndex = 100;

  function makeIndicator(description: string, getCurrentValue: () => number) {
    const tf = new Text("", {
      fontFamily: FontFamily.Default,
      fontSize: 18,
      fill: 0xffffff,

      stroke: "#080808",
      strokeThickness: 1,

      dropShadow: true,
      dropShadowAngle: 1.57079632679,
      dropShadowColor: 0x010101,
      dropShadowDistance: 2,
      dropShadowAlpha: 0.75,
    });
    tf.alpha = 0.55;
    tf.x = -screenAnchor.x * (container.width + tf.width);
    tf.y = -screenAnchor.y * (container.height + tf.height);
    container.addChild(tf);

    const updateText = (screenValue: number) => {
      // tf.text = `${description.toUpperCase()}: ${screenValue.toFixed(4)}`
      tf.text = `${description.toUpperCase()}: ${Math.round(screenValue)}`;
    };
    updateText(getCurrentValue());

    const animator = createValueAnimator_Counter(getCurrentValue, updateText);
    animator.animationDuration = 1.7783;

    return Object.assign(tf, { animator });
  }

  const fuelIndicator_Coal = makeIndicator("Coal", () => userData.fuel.coal || 0);
  const fuelIndicator_Diesel = makeIndicator("Diesel", () => userData.fuel.diesel || 0);

  //// Position indicators properly on the screen

  function updateIndicatorPositions({ width, height }: { width: number; height: number }) {
    container.position.set(
      (width - padding.x - padding.x) * screenAnchor.x + padding.x,
      (height - padding.y - padding.y) * screenAnchor.y + padding.y
    );
  }
  events.on({ resize: updateIndicatorPositions });
  updateIndicatorPositions(app.screen);

  //// Return indicators service, which can be used to update indicators' values

  return Object.assign(container, { fuelIndicator_Coal, fuelIndicator_Diesel });
}

export type UserFuelIndicatorsList = ReturnType<typeof createUserFuelIndicatorsList>;
