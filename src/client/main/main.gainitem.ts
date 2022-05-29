import { VCard } from "@client/combat/display/entities/VCard";
import { VConsumableItem } from "@client/combat/display/ui/ConsumablesList";
import { ConsumableItemBlueprints } from "@client/combat/state/ConsumableItemBlueprints";
import { UserCrossCombatData } from "@client/combat/state/data";
import { generateRandomPlayerCard } from "@client/combat/state/game.factory";
import { FontFamily } from "@client/common/display/constants/FontFamily";
import { VScene } from "@client/common/display/VScene";
import { GameSingletons } from "@client/core/GameSingletons";
import { __window__ } from "@debug/__window__";
import { createAnimatedButtonBehavior } from "@game/asorted/createAnimatedButtonBehavior";
import { Text } from "@pixi/text";
import { delay } from "@sdk/utils/promises";
import { range } from "@sdk/utils/range";
import FontFaceObserver from "fontfaceobserver";

export async function resolveGainItemScreen() {
  const app = GameSingletons.getPixiApplicaiton();

  await new FontFaceObserver("Henny Penny").load();

  const vscene = new VScene();
  __window__.container = app.stage.addChild(vscene);

  await resolveNewCardChoice(vscene, 4);

  vscene.playHideAnimation().then(() => vscene.destroy());
}

export async function resolveNewCardChoice(vscene: VScene, cardsCount: number) {
  const hint = new Text("You have gained\na new item!", {
    fill: 0x909090,
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
  vscene.tweeener.from(hint, { alpha: 0, duration: 1.5 });

  new FontFaceObserver("Irish Grover").load().then(() => hint.updateText(false));

  const vitems = ConsumableItemBlueprints.map(c => vscene.addChild(new VConsumableItem(c)));

  const chosenVItem = await new Promise<VConsumableItem>(resolve => {
    const xDelta = Math.min(220, (vscene.designWidth - 220) / (cardsCount - 1));
    for (const [index, vcard] of vitems.entries()) {
      const centerCardsAroundPoint = vscene.getFractionalPosition(0.5, 0.5);
      vcard.position.x = centerCardsAroundPoint.x + (index - cardsCount / 2 + 0.5) * xDelta;
      vcard.position.y = centerCardsAroundPoint.y;
      vscene.tweeener.from(vcard, { pixi: { scale: 0 }, duration: 0.4, delay: index * 0.1, ease: "back.out" });
      createAnimatedButtonBehavior(vcard, { onClick: () => resolve(vcard) }, true);
    }
  });
  vitems.forEach(vcard => vcard.removeAllListeners());

  GameSingletons.getTooltipManager().clear();

  vscene.tweeener.to(hint, { alpha: 0, duration: 0.5 });

  vscene.tweeener.to(chosenVItem, { y: 1600, alpha: 0, duration: 0.35, ease: "back.in" });
  await vscene.tweeener.to(
    vitems.filter(vc => vc !== chosenVItem),
    { pixi: { scale: 0 }, duration: 0.25, ease: "back.in", stagger: 0.1 }
  );

  vitems.forEach(vcard => vcard.destroy());

  console.log(`🤍 You chose `, chosenVItem.data);

  await delay(0.4);
}
