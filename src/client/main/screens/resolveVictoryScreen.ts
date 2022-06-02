import { UserCrossCombatData } from "@client/run/UserCrossCombatData";
import { FontFamily } from "@client/common/display/constants/FontFamily";
import { waitForDocumentClick } from "@client/common/display/utils/waitForDocumentClick";
import { VScene } from "@client/common/display/VScene";
import { GameSingletons } from "@client/core/GameSingletons";
import { __window__ } from "@debug/__window__";
import { Text } from "@pixi/text";
import { delay } from "@sdk/utils/promises";
import FontFaceObserver from "fontfaceobserver";
import { resolveChooseNewCardScreen } from "./resolveChooseNewCardScreen";
import { resolveGainItemScreen } from "./resolveGainItemScreen";

export async function resolveVictoryScreen() {
  await new FontFaceObserver("Henny Penny").load();

  const app = GameSingletons.getPixiApplicaiton();
  const vscene = new VScene();
  __window__.container = app.stage.addChild(vscene);

  await resolveCongrats(vscene);

  if (UserCrossCombatData.current.currentFloor % 3 === 2) {
    await resolveGainItemScreen();
  }

  await resolveChooseNewCardScreen(3);

  vscene.playHideAnimation().then(() => vscene.destroy());
}

async function resolveCongrats(vscene: VScene) {
  const text = new Text("Nice work!", {
    fill: 0xffff00,
    fontFamily: FontFamily.GameOver,
    fontSize: 160,
    stroke: 0x0,
    strokeThickness: 2,
    lineHeight: 160,
    align: "center",
  });
  text.anchor.set(0.5);
  text.position.copyFrom(vscene.getFractionalPosition(0.5, 0.4));
  vscene.addChild(text);
  vscene.tweeener.from(text, { pixi: { alpha: 0, scale: 0 }, duration: 0.99, ease: "elastic.out" });

  await Promise.race([waitForDocumentClick(), delay(1.5)]);

  await vscene.tweeener.to(text, { alpha: 0, duration: 0.3, overwrite: true });
}
