import { __window__ } from "@debug/__";
import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { TextureId } from "@game/constants/paths/TextureId";
import { NineSlicePlane } from "@pixi/mesh-extras";
import { ITextStyle, Text } from "@pixi/text";
import { createValueAnimator_OutInViaTimeline } from "./common/createValueAnimator_OutInViaTimeline";

export function createScreenTitleVisual() {
  const { app, events, viewSize, assets } = GameSingletons.getGameContext();

  const paddingX = 30;
  const paddingY = 10;
  const padTexture = assets.getTexture(TextureId.MeshyTitlePad);
  const padTextureSlices = [56, 35, 56, 35] as [number, number, number, number];
  const pad = new NineSlicePlane(padTexture, ...padTextureSlices);
  pad.zIndex = 99;

  pad.name = "Screen Title";

  const labelStyle = {
    fontSize: 25,
    fill: "#FFFFFF",
    stroke: "#080808",
    strokeThickness: 3,
    fontFamily: FontFamily.Default,

    dropShadow: true,
    dropShadowAlpha: 0.65,
    dropShadowColor: "#000000",
    dropShadowBlur: 1,
    dropShadowAngle: Math.PI / 2,
    dropShadowDistance: 4,
  } as Partial<ITextStyle>;
  const label = new Text("", labelStyle);
  label.position.set(padTextureSlices[0], padTextureSlices[1]);
  label.pivot.y -= 0.5 * labelStyle.dropShadowDistance! * Math.sin(labelStyle.dropShadowAngle!);
  pad.addChild(label);

  const updatePosition = function () {
    label.anchor.set(0.5);

    pad.width = label.width + padTextureSlices[0] + padTextureSlices[2] + paddingX + paddingX;
    pad.height = label.height + padTextureSlices[1] + padTextureSlices[3] + paddingY + paddingY;

    pad.scale.set(Math.min((0.5 * viewSize.width) / pad.width, viewSize.height / 1080));

    pad.x = 0.5 * viewSize.width - 0.5 * pad.width * pad.scale.x;

    label.x = 0.5 * pad.width;
    label.y = 0.5 * pad.height;
  };
  updatePosition();
  events.on({ resize: updatePosition });

  const ani = createValueAnimator_OutInViaTimeline(
    {
      howToApplyValue(newText: string | null) {
        label.text = (newText || "").toString().trim().toUpperCase();
        updatePosition();
      },
      howToShow(tl) {
        tl.to(pad, {
          pixi: { alpha: 1, y: 0 },
          duration: 0.4,
          ease: "back.out",
        });
      },
      howToHide(tl) {
        tl.to(pad, {
          pixi: { alpha: 0.0, y: -80 },
          duration: 0.15,
          ease: "power2.in",
        });
      },
    },
    null
  );

  const service = {
    component: pad,
    /**
     * Actual title text, as it should be,
     * even if the label is currently showing different,
     * because of ongoing animation or something.
     */
    get currentText() {
      return ani.getCurrentValue();
    },
    setText(text: string | null) {
      return ani.setValue(text);
    },
  };

  return service;
}

export type MapTitle = ReturnType<typeof createScreenTitleVisual>;
