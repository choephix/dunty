import { waitForDocumentClick } from "@client/common/display/utils/waitForDocumentClick";
import { VScene } from "@client/common/display/VScene";
import { GameSingletons } from "@client/core/GameSingletons";
import { FontFamily } from "@client/common/display/constants/FontFamily";
import { VCard } from "@client/combat/display/entities/VCard";
import { UserCrossCombatData } from "@client/combat/state/data";
import { generateRandomPlayerCard } from "@client/combat/state/game.factory";
import { __window__ } from "@debug/__window__";
import { createAnimatedButtonBehavior } from "@game/asorted/createAnimatedButtonBehavior";
import { Application } from "@pixi/app";
import { Text } from "@pixi/text";
import { delay } from "@sdk/utils/promises";
import { range } from "@sdk/utils/range";
import FontFaceObserver from "fontfaceobserver";

export async function resolveWinScreen(app: Application) {
  await new FontFaceObserver("Henny Penny").load();

  const vscene = new VScene();
  __window__.container = app.stage.addChild(vscene);

  await resolveCongrats(vscene);

  await resolveNewCardChoice(vscene, 4);

  vscene.playHideAnimation().then(() => vscene.destroy());
}

export async function resolveCongrats(vscene: VScene) {
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
  vscene.tweeener.from(text, { pixi: { alpha: 0, scale: 0 }, duration: .99, ease: 'elastic.out' });

  await Promise.race([waitForDocumentClick(), delay(1.5)]);

  await vscene.tweeener.to(text, { alpha: 0, duration: 0.3, overwrite: true });
}

export async function resolveNewCardChoice(vscene: VScene, cardsCount: number) {
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
}
