import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";

export interface SliderBarOptions {
  fill: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export class SliderBar extends Container {
  constructor(barOptions: SliderBarOptions) {
    super();
    const sliderBG = new Graphics();

    sliderBG.clear();
    sliderBG.beginFill(barOptions.fill);
    sliderBG.drawRect(barOptions.x, barOptions.y, barOptions.width, barOptions.height);
    sliderBG.endFill();

    this.addChild(sliderBG);
  }
}
