import { waitForDocumentClick } from "@dungeon/common/display/utils/waitForDocumentClick";
import { VScene } from "@dungeon/common/display/VScene";
import { FontFamily } from "@dungeon/common/display/constants/FontFamily";
import { __window__ } from "@debug/__window__";
import { Application } from "@pixi/app";
import { Text } from "@pixi/text";
import FontFaceObserver from "fontfaceobserver";
import { GameSingletons } from "@dungeon/core/GameSingletons";

export async function resolveGameOverScreen() {
  await new FontFaceObserver("Henny Penny").load();
  
  const app = GameSingletons.getPixiApplicaiton();
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
  vscene.tweeener.from(text, { alpha: 0, duration: 1.5 });

  await waitForDocumentClick();

  await vscene.tweeener.to(text, { alpha: 0, duration: 0.5, overwrite: true });

  vscene.playHideAnimation().then(() => vscene.destroy());
}
