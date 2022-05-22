import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { TextureId } from "@game/constants/paths/TextureId";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { NineSlicePlane } from "@pixi/mesh-extras";
import { Sprite } from "@pixi/sprite";
import { Text, TextStyle } from "@pixi/text";
import { buttonizeInstance } from "@sdk-ui/buttonize";
import { lerp } from "@sdk/utils/math";

export function createMeshyButton(text: string = "", width: number = 360, onClick: () => void | Promise<void>) {
  const assets = GameSingletons.getResources();

  // const btnPadTexture = assets.getTexture(TextureId.MeshyTitlePad);
  // const btnPadTextureSlices = [56, 35, 56, 35] as [
  //   number,
  //   number,
  //   number,
  //   number
  // ];
  // const btnPad = new NineSlicePlane(
  //   btnPadTexture,
  //   ...btnPadTextureSlices
  // );
  // btnPad.width = width - 52;
  // btnPad.pivot.set(0.51 * btnPad.width, 0.5 * btnPad.height);

  // const btnLabel = componentFactory.createLabel({
  //   text: `Purchase`.toUpperCase(),
  //   fontSize: 36,
  //   anchor: [0.5, 0.5],
  // });

  // container.scale.set(ITEM_CARD_SCALE);
  // container.pivot.set(0.5 * bgTexture.width, 0.5 * bgTexture.height);

  // return container;

  const padTexture = assets.getTexture(TextureId.MeshyTitlePad);
  const padTextureSlices = [56, 35, 56, 35] as [number, number, number, number];
  const pad = new NineSlicePlane(padTexture, ...padTextureSlices);

  const paddingX = 0;
  const paddingY = 0;
  const totalPaddingWithSlicesX = padTextureSlices[0] + padTextureSlices[2] + paddingX + paddingX;
  const totalPaddingWithSlicesY = padTextureSlices[1] + padTextureSlices[3] + paddingY + paddingY;

  const labelStyle: Partial<TextStyle> = {
    fontSize: 44,
    fill: "#FFFFff",
    fontFamily: FontFamily.Default,
    stroke: "#080808",
    strokeThickness: 3,

    dropShadow: true,
    dropShadowAlpha: 0.65,
    dropShadowColor: "#000000",
    dropShadowBlur: 1,
    dropShadowAngle: Math.PI / 4,
    dropShadowDistance: 16,
  };
  const label = new Text(text, labelStyle);
  label.anchor.set(0.5, 0.5);
  label.pivot.x -= 0.5 * labelStyle.dropShadowDistance! * Math.cos(labelStyle.dropShadowAngle!);
  label.pivot.y -= 0.5 * labelStyle.dropShadowDistance! * Math.sin(labelStyle.dropShadowAngle!);

  const container = new Container();
  container.addChild(pad, label);

  function update() {
    pad.pivot.set(0.51 * pad.width, 0.5 * pad.height);

    const wouldBeLabelWidth = label.width / (label.scale.x || 1);
    const maxLabelWidth = pad.width - totalPaddingWithSlicesX;
    const wouldBeLabelHeight = label.height / (label.scale.y || 1);
    const maxLabelHeight = pad.height - totalPaddingWithSlicesY;
    if (wouldBeLabelWidth > maxLabelWidth || wouldBeLabelHeight > maxLabelHeight) {
      const maxScaleX = maxLabelWidth / wouldBeLabelWidth;
      const maxScaleY = maxLabelHeight / wouldBeLabelHeight;
      const scale = Math.max(0.01, Math.min(maxScaleX, maxScaleY));
      label.scale.set(scale, lerp(scale, Math.min(maxScaleY, 1), 0.5));
    } else {
      label.scale.set(1);
    }
  }

  function setText(newText: string) {
    label.text = newText;
    update();
  }

  function setWidth(newWidth: number) {
    pad.width = newWidth / container.scale.x;
    update();
  }

  setWidth(width);

  const buttonizedContainer = buttonizeInstance(container, { setText, setWidth });
  buttonizedContainer.behavior.on({
    hoverIn: () => {
      label.style.fill = "#49FfFf";
    },
    hoverOut: () => {
      label.style.fill = "#FfFfFf";
    },
    down: () => {
      pad.tint = 0x909090;
    },
    up: () => {
      pad.tint = 0xffffff;
    },
    trigger: async () => {
      await onClick();
    },
  });

  console.log(buttonizedContainer);

  return buttonizedContainer;
}

export type MeshyLabel = ReturnType<typeof createMeshyButton>;
