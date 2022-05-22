import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";

export interface SliderKnobOptions {
  knobSprite: Sprite;
}

export class SliderKnob extends Container {
  [x: string]: any;

  sliderKnob: Sprite;
  dragging: boolean;

  constructor(knobOptions: SliderKnobOptions) {
    super();
    this.sliderKnob = knobOptions.knobSprite;
    this.dragging = false;
    this.sliderKnob.anchor.set(0.5, 0.5);

    this.sliderKnob.interactive = true;
    this.sliderKnob.buttonMode = true;

    // this.sliderKnob.on("pointerdown", this.onDragStart);
    // this.sliderKnob.on("pointerup", () => {
    //   this.onDragEnd(() => {
    //     knobOptions.dragChange();
    //   });
    // });
    // this.sliderKnob.on("pointerupoutside", () => {
    //   this.onDragEnd(() => {
    //     knobOptions.dragChange();
    //   });
    // });
    // this.sliderKnob.on("pointermove", () => {
    //   this.onDragMove();
    // });

    this.addChild(this.sliderKnob);
  }

  // onDragStart = (event: { data: any }) => {
  //   this.data = event.data;
  //   this.dragging = true;
  // };

  // onDragEnd(dragChange: () => unknown) {
  //   this.dragging = false;
  //   this.data = null;
  //   dragChange();
  // }

  // onDragMove() {
  //   const min = 0;

  //   const max = this.parent.width - this.sliderKnob.width / 2;
  //   if (this.dragging) {
  //     const newPosition = this.data.getLocalPosition(this.parent);
  //     this.x = newPosition.x;
  //     if (this.x > max) this.x = max;
  //     if (this.x < min) this.x = min;
  //   }
  // }
}
