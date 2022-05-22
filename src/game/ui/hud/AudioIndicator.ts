import { GameSingletons } from "@game/app/GameSingletons";
import { EnchantedSprite } from "@game/core/enchanted-classes";
import { Point } from "@pixi/math";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";

export function createAudioIndicator() {
  const { app, assets, events, ticker, music, sfx } = GameSingletons.getGameContext();
  const mutedTexture = assets.getTexture("mutedSoundIcon");
  const unmutedTexture = assets.getTexture("playingSoundIcon");
  const padding = new Point(20, 100);
  const screenAnchor = new Point(1.0, 0.0);

  const button = new EnchantedSprite(mutedTexture);
  button.zIndex = 100;
  button.alpha = 0.4;
  button.scale.set(0.4);
  button.anchor.copyFrom(screenAnchor);

  function updateIndicatorPositions({ width, height }: { width: number; height: number }) {
    button.position.set(
      padding.x + (width - padding.x - padding.x) * screenAnchor.x,
      padding.y + (height - padding.y - padding.y) * screenAnchor.y
    );
  }

  events.on({ resize: updateIndicatorPositions });
  updateIndicatorPositions(app.screen);

  button.enchantments.watch(
    () => music.muted && sfx.isMuted,
    everythingMuted => (button.texture = everythingMuted ? mutedTexture : unmutedTexture),
    true
  );

  buttonizeDisplayObject(button, () => {
    if (music.muted && sfx.isMuted) {
      music.unmute();
      sfx.unmute();
    } else {
      music.mute();
      sfx.mute();
    }
  });

  return button;
}

export type AudioIndicator = ReturnType<typeof createAudioIndicator>;
