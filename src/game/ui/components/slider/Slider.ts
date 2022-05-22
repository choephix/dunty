import { GameContext } from "@game/app/app";
import { Container } from "@pixi/display";
import { InteractionEvent, InteractivePointerEvent } from "@pixi/interaction";
import { Point } from "@pixi/math";
import { SliderBarOptions, SliderBar } from "./SliderBar";
import { SliderKnob, SliderKnobOptions } from "./SliderKnob";

export interface SliderOptions {
  barOptions: SliderBarOptions;
  knobOptions: SliderKnobOptions;
}

export class Slider extends Container {
  sliderBar: SliderBar;
  sliderKnob: SliderKnob;

  dragging: boolean;

  barWidth: number;
  barHeight: number;

  currentValue: number;

  constructor(sliderOptions: SliderOptions) {
    super();

    this.barWidth = sliderOptions.barOptions.width;
    this.barHeight = sliderOptions.barOptions.height;

    this.currentValue = 0;

    this.dragging = false;

    this.sliderBar = new SliderBar(sliderOptions.barOptions);

    this.sliderKnob = new SliderKnob(sliderOptions.knobOptions);
    this.sliderKnob.interactive = true;
    this.sliderKnob.buttonMode = true;

    this.addChild(this.sliderBar);
    this.addChild(this.sliderKnob);

    this.sliderKnob.on("pointerdown", (e: InteractionEvent) => {
      this.emit("startDrag", this.currentValue);
      this.dragging = true;
    });

    this.sliderKnob.on("pointerup", (e: InteractionEvent) => {
      this.emit("endDrag", this.currentValue);
      this.dragging = false;
    });

    this.sliderKnob.on("pointerupoutside", (e: InteractionEvent) => {
      this.emit("endDrag", this.currentValue);
      this.dragging = false;
    });

    this.sliderKnob.on("pointermove", (e: InteractionEvent) => {
      if (this.dragging) {
        const newPosition = e.data.getLocalPosition(this);
        this.setValue(newPosition.x / this.barWidth);
      }
    });

    this.sliderKnob.position.y = this.sliderBar.height / 4;
  }

  setValue(value: number, silent: boolean = false) {
    this.currentValue = value;

    if (this.currentValue > 1) {
      this.currentValue = 1;
    }

    if (this.currentValue < 0) {
      this.currentValue = 0;
    }

    if (!silent) {
      this.emit("change", this.currentValue);
    }

    this.updateKnobPosition();
  }

  updateKnobPosition() {
    let knobPosition = this.currentValue * this.barWidth;
    this.sliderKnob.x = knobPosition;
  }
}
