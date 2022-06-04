import { waitForDocumentClick } from "@dungeon/common/display/utils/waitForDocumentClick";
import { VScene } from "@dungeon/common/display/VScene";
import { GameSingletons } from "@dungeon/core/GameSingletons";
import { __window__ } from "@debug/__window__";
import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { delay } from "@sdk/utils/promises";

export async function resolveTitleScreen() {
  
  const app = GameSingletons.getPixiApplicaiton();
  
  const vscene = new VScene();
  __window__.container = app.stage.addChild(vscene);
  
  const titleTextureId = `https://public.cx/dunty/titlecard.png`;
  const titleTexture = await Texture.fromURL(titleTextureId);
  const titleSprite = new Sprite(titleTexture);
  titleSprite.anchor.set(0.5);
  titleSprite.position.copyFrom(vscene.getFractionalPosition(0.5, 0.4));
  vscene.addChild(titleSprite);
  vscene.tweeener.from(titleSprite, { alpha: 0, duration: 0.9 });

  await Promise.race([waitForDocumentClick(), delay(2.2)]);

  await vscene.tweeener.to(titleSprite, { alpha: 0, duration: 0.9, overwrite: true });

  vscene.playHideAnimation().then(() => vscene.destroy());
}
