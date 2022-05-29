import { VConsumableItem } from "@client/combat/display/ui/ConsumablesList";
import { ConsumableItemBlueprints } from "@client/combat/state/ConsumableItemBlueprints";
import { UserCrossCombatData } from "@client/combat/state/data";
import { FontFamily } from "@client/common/display/constants/FontFamily";
import { waitForDocumentClick } from "@client/common/display/utils/waitForDocumentClick";
import { VScene } from "@client/common/display/VScene";
import { GameSingletons } from "@client/core/GameSingletons";
import { __window__ } from "@debug/__window__";
import { Text } from "@pixi/text";
import { getRandomItemFrom } from "@sdk/helpers/arrays";
import { delay } from "@sdk/utils/promises";
import FontFaceObserver from "fontfaceobserver";

export async function resolveGainItemScreen() {
  const app = GameSingletons.getPixiApplicaiton();

  await new FontFaceObserver("Henny Penny").load();

  const vscene = new VScene();
  __window__.container = app.stage.addChild(vscene);

  await resolveNewItemRewardPresentation(vscene);

  vscene.playHideAnimation().then(() => vscene.destroy());
}

export async function resolveNewItemRewardPresentation(vscene: VScene) {
  const item = getRandomItemFrom(ConsumableItemBlueprints);

  UserCrossCombatData.current.consumables.push(item);

  const hint = new Text("You have gained\na new item!", {
    // fill: 0x20c0f0,
    fill: 0x50f0d0,
    fontFamily: FontFamily.CardPickScreen,
    fontSize: 60,
    stroke: 0x0,
    strokeThickness: 8,
    lineHeight: 80,
    align: "center",
  });
  hint.anchor.set(0.5);
  hint.position.copyFrom(vscene.getFractionalPosition(0.5, 0.3));
  vscene.addChild(hint);
  vscene.tweeener.from(hint, { alpha: 0, duration: 0.5 });

  new FontFaceObserver("Irish Grover").load().then(() => hint.updateText(false));

  const vitem = new VConsumableItem(item);
  vitem.position.copyFrom(vscene.getFractionalPosition(0.5, 0.5));
  vitem.scale.set(2);
  vscene.addChild(vitem);
  vscene.tweeener.from(vitem, { pixi: { scale: 0 }, duration: 0.4, ease: "back.out" });

  await Promise.race([waitForDocumentClick(), delay(3.5)]);

  GameSingletons.getTooltipManager().clear();

  vscene.tweeener.to(hint, { alpha: 0, duration: 0.5 });
  await vscene.tweeener.to(vitem, { pixi: { scale: 5, alpha: 0 }, duration: 0.35, ease: "power2.in" });
  // await vscene.tweeener.to(vitem, { y: 1600, alpha: 0, duration: 0.35, ease: "power2.in" });
  vitem.destroy();

  await delay(0.4);
}
