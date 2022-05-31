import { waitForDocumentClick } from "@client/common/display/utils/waitForDocumentClick";
import { VScene } from "@client/common/display/VScene";
import { GameSingletons } from "@client/core/GameSingletons";
import { FontFamily } from "@client/common/display/constants/FontFamily";
import { UserCrossCombatData } from "@client/run/UserCrossCombatData";
import { __window__ } from "@debug/__window__";
import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { delay } from "@sdk/utils/promises";
import { randomIntBetweenIncluding } from "@sdk/utils/random";
import FontFaceObserver from "fontfaceobserver";

export async function resolveFloorIntroScreen() {
  await new FontFaceObserver("Jolly Lodger").load();

  const swordTextureId = `https://public.cx/mock/swords/${randomIntBetweenIncluding(1, 48)}.png`;
  const texture = await Texture.fromURL(swordTextureId);

  const app = GameSingletons.getPixiApplicaiton();

  const vscene = new VScene();
  __window__.container = app.stage.addChild(vscene);

  const text = new Text(`Floor ${UserCrossCombatData.current.currentFloor}`, {
    // fill: 0xffff00,
    fill: 0xff0050,
    fontFamily: FontFamily.FloorIndicator,
    fontSize: 160,
    stroke: 0x0,
    strokeThickness: 18,
    lineHeight: 160,
  });
  text.anchor.set(0.5);
  text.position.copyFrom(vscene.getFractionalPosition(0.5, 0.4));
  vscene.addChild(text);
  vscene.tweeener.from(text, { pixi: { scale: 0 }, duration: 0.4, ease: `back.out` });

  function addSword(flip: boolean) {
    const flipSign = flip ? -1 : 1;
    const scale = 2.0;
    const sprite = Sprite.from(texture);
    sprite.position.copyFrom(text);
    sprite.anchor.set(0.5);
    sprite.scale.set(flipSign * scale, scale);
    sprite.tint = 0x2020f0;
    vscene.tweeener.from(sprite, { pixi: { alpha: 0, angle: -flipSign * 45 }, duration: 0.4, ease: "back.out" });
    return vscene.addChildAt(sprite, 0);
  }

  const swords = [addSword(false), addSword(true)];

  await Promise.race([waitForDocumentClick(), delay(1.25)]);

  await Promise.all([
    vscene.tweeener.to(text, { pixi: { alpha: 0, scale: 0 }, duration: 0.5, overwrite: true, ease: "back.in" }),
    vscene.tweeener.to(swords, { pixi: { scale: 0 }, duration: 0.5, overwrite: true, ease: "power1.in" }),
  ]);

  vscene.playHideAnimation().then(() => vscene.destroy());
}
