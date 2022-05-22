import { FontFamily } from "@game/constants/FontFamily";
import { ITextStyle } from "@pixi/text";

const titleStyle = {
  fontSize: 26,
  fill: "#FFFFFF",
  fontFamily: FontFamily.Default,
  lineHeight: 32,
} as Partial<ITextStyle>;

const titleStyleDropShadow = {
  stroke: "#080808",
  strokeThickness: 1,
  dropShadow: true,
  dropShadowAngle: 1.57079632679,
  dropShadowColor: 0x080808,
  dropShadowDistance: 4,
  dropShadowAlpha: 0.75,
} as Partial<ITextStyle>;

export function makeCommonFontStyle(fontSize = 26, withDropShadow = false, stroke = 1) {
  return {
    ...titleStyle,
    ...(withDropShadow ? titleStyleDropShadow : {}),
    strokeThickness: stroke,
    fontSize: fontSize,
    dropShadowDistance: 0.1 * fontSize,
  };
}
