import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { TextureId } from "@game/constants/paths/TextureId";
import { Container } from "@pixi/display";
import { NineSlicePlane } from "@pixi/mesh-extras";
import { ITextStyle, Text } from "@pixi/text";
import { lerp } from "@sdk/utils/math";

export function createMeshyLabel(text: string = "", width: number = 360) {
  const { assets } = GameSingletons.getGameContext();

  const padTexture = assets.getTexture(TextureId.MeshyTitlePad);
  const padTextureSlices = [56, 35, 56, 35] as [number, number, number, number];
  const pad = new NineSlicePlane(padTexture, ...padTextureSlices);

  const paddingX = 0;
  const paddingY = 0;
  const totalPaddingWithSlicesX = padTextureSlices[0] + padTextureSlices[2] + paddingX + paddingX;
  const totalPaddingWithSlicesY = padTextureSlices[1] + padTextureSlices[3] + paddingY + paddingY;

  const labelStyle: Partial<ITextStyle> = {
    fontSize: 36,
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

  return Object.assign(container, { setText, setWidth });
}

export type MeshyLabel = ReturnType<typeof createMeshyLabel>;
