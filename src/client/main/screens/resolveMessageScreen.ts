import { waitForDocumentClick } from "@client/common/display/utils/waitForDocumentClick";
import { VScene } from "@client/common/display/VScene";
import { GameSingletons } from "@client/core/GameSingletons";
import { FontFamily } from "@client/common/display/constants/FontFamily";
import { __window__ } from "@debug/__window__";
import { Text } from "@pixi/text";
import { delay } from "@sdk/utils/promises";
import FontFaceObserver from "fontfaceobserver";

export async function resolveMessageScreen(message: string) {
  await new FontFaceObserver("Jolly Lodger").load();

  const app = GameSingletons.getPixiApplicaiton();

  const vscene = new VScene();
  __window__.container = app.stage.addChild(vscene);

  const text = new Text(message, {
    // fill: 0xffff00,
    fill: 0xff0050,
    fontFamily: FontFamily.FloorIndicator,
    fontSize: 160,
    stroke: 0x0,
    strokeThickness: 2,
    lineHeight: 160,
  });
  text.anchor.set(0.5);
  text.position.copyFrom(vscene.getFractionalPosition(0.5, 0.4));
  vscene.addChild(text);
  vscene.tweeener.from(text, { alpha: 0, duration: 1.5 });
  
  await Promise.race([waitForDocumentClick(), delay(1.5)]);

  await vscene.tweeener.to(text, { alpha: 0, duration: 0.5, overwrite: true });

  vscene.playHideAnimation().then(() => vscene.destroy());
}
