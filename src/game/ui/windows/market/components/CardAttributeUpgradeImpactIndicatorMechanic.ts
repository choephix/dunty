import { BitmapFontName } from "@game/constants/FontFamily";
import { BitmapText, IBitmapTextStyle } from "@pixi/text-bitmap";
import { CardAttributeUpgradeImpactIndicator } from "./CardAttributeUpgradeImpactIndicator";

export class CardAttributeUpgradeImpactIndicatorMechanic extends CardAttributeUpgradeImpactIndicator {
  private maxValueLabel?: BitmapText;
  constructor(backgroundTextureId: string, iconTextureId: string, nameLabelText: string) {
    super(backgroundTextureId, iconTextureId, nameLabelText, false);

    //// Change background
    this.background.height = this.background.height * 1.5;
    //// Change positions
    this.icon.y += 50;
    this.valueLabel.y += 50;
    this.addMaxValueLabel();
    this.setMaxValueLabel(0);
  }

  addMaxValueLabel() {
    //// Add max value label
    const maxValue = 0;
    const valueLabelStyle = {
      fontName: BitmapFontName.CelestialTypeface,
    } as IBitmapTextStyle;
    this.maxValueLabel = new BitmapText(maxValue.toString(), valueLabelStyle);
    this.maxValueLabel.anchor.x = 0.5;
    this.maxValueLabel.position.set(114, 5);
    this.maxValueLabel.scale.set(1);
    this.maxValueLabel.tint = 0x808080;
    this.addChild(this.maxValueLabel);
  }

  setMaxValueLabel(value: number) {
    if (!this.maxValueLabel) return new Error("No max value label exists");
    if (value == 0) this.maxValueLabel.visible = false;
    else {
      this.maxValueLabel.visible = true;
      this.maxValueLabel.text = value.toString();
    }
  }
}
