import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { lerp } from "@sdk/utils/math";
import { StakingCommissionPercentageSlider } from "./StakingCommissionPercentageSlider";

export class PercentageBox extends Container {
  private readonly assets = GameSingletons.getResources();

  percentValue: number = 15;

  slider?: StakingCommissionPercentageSlider;
  percentageText?: Text;

  async addPercentageBox(left: number, name: string, color: number, upperText?: string) {
    const container = new Container();
    //// Add box background
    const boxBk = new Sprite(
      this.assets.getTexture("ui-station-dashboard/staking/manage-tab/commissions/box-percentage.png")
    );
    boxBk.scale.x = boxBk.scale.x * left;
    container.addChild(boxBk);
    //// Add box nameplate
    const boxNamePlate = new Sprite(
      this.assets.getTexture("ui-station-dashboard/staking/manage-tab/commissions/sm-box.png")
    );
    boxNamePlate.tint = color;
    const x = left > 0 ? boxBk.x : boxBk.x + boxBk.width * left - 10;
    boxNamePlate.position.set(x, boxBk.y + boxBk.height - boxNamePlate.height);
    container.addChild(boxNamePlate);
    //// Add box name
    const nameText = new Text(name, {
      fontFamily: FontFamily.Default,
      fontSize: 24,
      fill: 0xffffff,
    });
    nameText.anchor.set(0.5);
    nameText.position.set(boxNamePlate.x + boxNamePlate.width / 2, boxNamePlate.y + boxNamePlate.height / 2);
    container.addChild(nameText);
    //// Add box percentage
    this.percentageText = new Text(this.percentValue + "%", {
      fontFamily: FontFamily.Default,
      fontSize: 62,
      fill: 0xffffff,
    });
    this.percentageText.anchor.set(0.5);
    this.percentageText.position.set((boxBk.x + boxBk.width / 2) * left, boxBk.y + boxBk.height / 2 - 15);
    container.addChild(this.percentageText);
    //// Add upper text
    if (upperText) {
      const upperLabel = new Text(upperText, {
        fontFamily: FontFamily.Default,
        fontSize: 20,
        fill: 0xffffff,
      });
      upperLabel.anchor.set(0.5);
      upperLabel.position.set((boxBk.x + boxBk.width / 2) * left, boxBk.y - upperLabel.height / 2);
      container.addChild(upperLabel);
    }

    //// Add slider

    const percentageMax = 50;
    const percentageMin = 0;
    const percentageStep = 5;

    const setPercentage = (percentage: number) => {
      this.percentValue = percentage;
      if (this.percentageText) this.percentageText.text = percentage + "%";
    };

    const createSlider = (nameplateTexture: Texture, namplateName: string, color: number) => {
      const onChange = (value: number) => {
        let percentage = lerp(percentageMin, percentageMax, value);
        percentage = Math.round(percentage / percentageStep) * percentageStep;
        setPercentage(percentage);
      };

      const slider = new StakingCommissionPercentageSlider();
      slider.init(
        this.assets.getTexture("ui-station-dashboard/staking/manage-tab/commissions/track.png"),
        nameplateTexture,
        namplateName,
        this.assets.getTexture("ui-station-dashboard/staking/manage-tab/commissions/icon-slider.png"),
        this.assets.getTexture("ui-station-dashboard/staking/manage-tab/commissions/btn-gray-multiply.png"),
        color,
        onChange
      );
      return slider;
    };

    this.slider = createSlider(
      this.assets.getTexture("ui-station-dashboard/staking/manage-tab/commissions/sm-box.png"),
      name,
      color
    );
    const sliderX = left > 0 ? 715 : 515;
    this.slider.position.set(sliderX, 150);
    container.addChild(this.slider);

    this.addChild(container);
  }

  setValue(value: number) {
    if (this.slider) this.slider.setValue(value);

    const percentage = lerp(0, 100, value);
    this.percentValue = percentage;
    if (this.percentageText) this.percentageText.text = percentage + "%";
  }

  removeGlow() {
    if (this.slider) this.slider.glowService.removeFrom(this.slider.sliderKnob);
  }
}
