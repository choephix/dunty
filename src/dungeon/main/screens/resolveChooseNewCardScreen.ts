import { VCard } from "@dungeon/combat/display/entities/VCard";
import { UserCrossCombatData } from "@dungeon/run/UserCrossCombatData";
import { generateRandomPlayerCard } from "@dungeon/combat/state/StuffFactory";
import { FontFamily } from "@dungeon/common/display/constants/FontFamily";
import { VScene } from "@dungeon/common/display/VScene";
import { GameSingletons } from "@dungeon/core/GameSingletons";
import { __window__ } from "@debug/__window__";
import { createAnimatedButtonBehavior } from "@sdk-pixi/asorted/createAnimatedButtonBehavior";
import { Text } from "@pixi/text";
import { delay } from "@sdk/utils/promises";
import { range } from "@sdk/utils/range";
import FontFaceObserver from "fontfaceobserver";

export async function resolveChooseNewCardScreen(cardsCount: number) {
  const app = GameSingletons.getPixiApplicaiton();
  const vscene = new VScene();
  __window__.container = app.stage.addChild(vscene);

  const hint = new Text("Pick a card\nto add to your deck", {
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

  const cards = range(cardsCount).map(c => generateRandomPlayerCard());
  const vcards = cards.map(c => vscene.addChild(new VCard(c)));

  const chosenVCard = await new Promise<VCard>(resolve => {
    const xDelta = Math.min(220, (vscene.designWidth - 220) / (cardsCount - 1));
    for (const [index, vcard] of vcards.entries()) {
      const centerCardsAroundPoint = vscene.getFractionalPosition(0.5, 0.5);
      vcard.position.x = centerCardsAroundPoint.x + (index - cardsCount / 2 + 0.5) * xDelta;
      vcard.position.y = centerCardsAroundPoint.y;
      vscene.tweeener.from(vcard, { pixi: { scale: 0 }, duration: 0.4, delay: index * 0.1, ease: "back.out" });
      createAnimatedButtonBehavior(vcard, { onClick: () => resolve(vcard) }, true);
    }
  });
  vcards.forEach(vcard => vcard.removeAllListeners());

  GameSingletons.getTooltipManager().clear();

  UserCrossCombatData.current.deck.push(chosenVCard.data);

  vscene.tweeener.to(hint, { alpha: 0, duration: 0.5 });

  vscene.tweeener.to(chosenVCard, { y: 1600, alpha: 0, duration: 0.35, ease: "back.in" });
  await vscene.tweeener.to(
    vcards.filter(vc => vc !== chosenVCard),
    { pixi: { scale: 0 }, duration: 0.25, ease: "back.in", stagger: 0.1 }
  );

  vcards.forEach(vcard => vcard.destroy());

  console.log(`🤍 You chose `, chosenVCard.data);

  await delay(0.4);

  vscene.playHideAnimation().then(() => vscene.destroy());
}
