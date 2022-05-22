import { FontFamily } from "@game/constants/FontFamily";
import { EnchantedText } from "@game/core/enchanted-classes";
import { ITextStyle } from "@pixi/text";

const commonLabelStyle = {
  fill: "#FFFFFF",
  fontFamily: FontFamily.Default,
};

export class StaticComponentFactory {
  static createLabel({
    text = "",
    fontSize = 52,
    anchor = [0.5, 0.5] as [number, number],
    position = [0.0, 0.0] as [number, number],
    getText = null as null | (() => string),
    getDangerState = null as null | (() => boolean),
    styleOverrides = {} as Partial<ITextStyle>,
  }) {
    const label = new EnchantedText(text, {
      ...commonLabelStyle,
      ...styleOverrides,
      fontSize,
    });
    label.anchor.set(...anchor);
    label.position.set(...position);

    if (getText) {
      label.enchantments.watch(getText, text => (label.text = text), true);
    }

    if (getDangerState) {
      const COLORS = ["#FFFFFF", "#DD2222"];
      label.enchantments.watch(getDangerState, danger => (label.style.fill = COLORS[+danger]), true);
    }

    return label;
  }
}
