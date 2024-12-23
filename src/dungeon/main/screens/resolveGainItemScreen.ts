import { VConsumableItem } from "@dungeon/combat/display/ui/ConsumablesList";
import { ConsumableItemBlueprints } from "@dungeon/combat/state/ConsumableItemBlueprints";
import { UserCrossCombatData } from "@dungeon/run/UserCrossCombatData";
import { FontFamily } from "@dungeon/common/display/constants/FontFamily";
import { waitForDocumentClick } from "@dungeon/common/display/utils/waitForDocumentClick";
import { VScene } from "@dungeon/common/display/VScene";
import { GameSingletons } from "@dungeon/core/GameSingletons";
import { __window__ } from "@debug/__window__";
import { spawnSpriteWave } from "@sdk-pixi/asorted/animations/spawnSpriteWave";
import { BLEND_MODES } from "@pixi/constants";
import { Texture } from "@pixi/core";
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

  await Promise.race([waitForDocumentClick(), delay(0.3)]);
  await Texture.fromURL(item.iconTextureUrl);
  await Texture.fromURL(waveTextureUrl);

  const vitem = new VConsumableItem(item);
  vitem.position.copyFrom(vscene.getFractionalPosition(0.5, 0.5));
  vitem.scale.set(2);
  vscene.addChild(vitem);
  vscene.tweeener.from(vitem, { pixi: { scale: 0 }, duration: 0.4, ease: "back.out" });

  spawnSpriteWave(
    waveTextureUrl,
    { pixi: { scale: 2.0 }, duration: 1 },
    { x: vitem.x, y: vitem.y, blendMode: BLEND_MODES.ADD, parent: vscene }
  );

  await waitForDocumentClick();

  GameSingletons.getTooltipManager().clear();

  vscene.tweeener.to(hint, { alpha: 0, duration: 0.5 });
  await vscene.tweeener.to(vitem, { pixi: { scale: 5, alpha: 0 }, duration: 0.35, ease: "power2.in" });
  // await vscene.tweeener.to(vitem, { y: 1600, alpha: 0, duration: 0.35, ease: "power2.in" });
  vitem.destroy();

  await delay(0.4);
}

// const waveTextureUrl = `https://undroop-assets.web.app/davinci/3/rays-1.png`;
// const waveTextureUrl = `https://undroop-assets.web.app/davinci/3/plazmo-5.png`;
// const waveTextureUrl = `https://undroop-assets.web.app/davinci/2/flare-11.2.png`;
const waveTextureUrl = `https://undroop-assets.web.app/davinci/2/boom-w1.png`;
// const waveTextureUrl = `https://undroop-assets.web.app/davinci/3/flare-24.png`;
