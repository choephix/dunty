import { VScene } from "@client/common/display/VScene";
import { FontFamily } from "@client/display/constants/FontFamily";
import { __window__ } from "@debug/__window__";
import { Application } from "@pixi/app";
import { Text } from "@pixi/text";
import FontFaceObserver from "fontfaceobserver";

export async function resolveGameOver(app: Application) {
  await new FontFaceObserver("Henny Penny").load();

  const vscene = new VScene();
  __window__.container = app.stage.addChild(vscene);

  const text = new Text("Game\nOver", {
    fill: 0xffffff,
    fontFamily: FontFamily.GameOver,
    fontSize: 160,
    stroke: 0x0,
    strokeThickness: 2,
    lineHeight: 160,
  });

  text.anchor.set(0.5);
  text.position.copyFrom(vscene.getFractionalPosition(0.5, 0.4));
  vscene.addChild(text);
}