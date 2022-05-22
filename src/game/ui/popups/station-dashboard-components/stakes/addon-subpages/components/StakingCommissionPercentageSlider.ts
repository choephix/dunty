import { FontFamily } from "@game/constants/FontFamily";
import { GlowFilterService } from "@game/ui/fx/GlowFilterService";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { InteractionEvent } from "@pixi/interaction";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";

export class StakingCommissionPercentageSlider extends Container {
  glowService: GlowFilterService = new GlowFilterService();

  knobPositionTop: number = 1;
  knobPositionBottom: number = 1;

  sliderTrack!: Sprite;
  sliderKnob: Container = new Container();

  value: number = -1;

  init(
    railTexture: Texture,
    nameplateTexture: Texture,
    nameplateText: string,
    buttonTexture: Texture,
    buttonBackTexture: Texture,
    color: number,
    onChange: (value: number) => unknown
  ) {
    //// Add nameplate box
    const nameplate = new Sprite(nameplateTexture);
    nameplate.tint = color;
    nameplate.position.set(-nameplate.width / 2, nameplate.height);
    this.addChild(nameplate);

    //// Add nameplate text
    const nameText = new Text(nameplateText, {
      fontFamily: FontFamily.Default,
      fontSize: 24,
      fill: 0xffffff,
    });
    nameText.anchor.set(0.5);
    nameText.position.set(nameplate.x + nameplate.width / 2, nameplate.y + nameplate.height / 2);
    this.addChild(nameText);

    //// Add rail track
    this.sliderTrack = new Sprite(railTexture);
    this.sliderTrack.anchor.set(0.5, 1);
    this.sliderTrack.position.set(0, nameplate.y);
    this.addChild(this.sliderTrack);

    //// Add slider button
    this.sliderKnob = this.createSliderKnob(buttonTexture, buttonBackTexture, color);

    this.knobPositionTop = this.sliderTrack.y + this.sliderKnob.height * 0.25;
    this.knobPositionBottom = this.sliderTrack.y + this.sliderTrack.height - this.sliderKnob.height * 0.25;

    const onTouchActionAtY = (touchActionY: number) => {
      const knobPositionRange = this.knobPositionBottom - this.knobPositionTop;
      const normalized = (touchActionY - this.knobPositionTop) / knobPositionRange;
      this.setValue(normalized);
      onChange(this.value);
    };

    this.sliderTrack.interactive = true;
    this.sliderTrack.buttonMode = true;

    let dragging = false;

    const getPointerY = (event: InteractionEvent) => {
      return 1 - event.data.getLocalPosition(this.sliderTrack).y;
    };
    this.sliderTrack.on("pointerdown", (e: InteractionEvent) => {
      dragging = true;
      onTouchActionAtY(getPointerY(e));
    });
    this.sliderTrack.on("pointerup", (e: InteractionEvent) => {
      if (dragging) {
        dragging = false;
        onTouchActionAtY(getPointerY(e));
      }
    });
    this.sliderTrack.on("pointerupoutside", (e: InteractionEvent) => {
      dragging = false;
    });
    this.sliderTrack.on("pointermove", (e: InteractionEvent) => {
      if (dragging) {
        onTouchActionAtY(getPointerY(e));
      }
    });

    this.addChild(this.sliderKnob);

    this.sliderKnob.visible = false;
  }

  createSliderKnob(buttonTexture: Texture, buttonBackTexture: Texture, color: number) {
    const container = new Container();

    //// Add button fill
    const buttonFill = new Sprite(buttonBackTexture);
    buttonFill.scale.set(0.25, 1);
    container.addChild(buttonFill);
    buttonFill.anchor.set(0.5);

    //// Add button cog
    const button = new Sprite(buttonTexture);
    container.addChild(button);
    button.tint = color;
    button.anchor.set(0.5);

    return container;
  }

  setValue(value: number) {
    if (value < 0) {
      value = 0;
    }

    if (value > 1) {
      value = 1;
    }

    // if (this.value === value) {
    //   return;
    // }

    this.value = value;

    const knobPositionRange = this.knobPositionBottom - this.knobPositionTop;
    const normalized = value;

    // console.log({ value, normalized, knobPositionRange });

    this.sliderKnob.visible = true;
    this.sliderKnob.position.y = this.knobPositionTop - knobPositionRange * normalized - this.sliderKnob.height * 0.75;
  }
}
