import { GameSingletons } from "@game/app/GameSingletons";
import { SfxManager } from "@game/app/sound/sfxManager";

export function playCardSwapSound() {
  return GameSingletons.getAudioServices().sfx.play(
    "paper",
    false,
    SfxManager.MultipleInstanceStrategy.None,
    1 + 0.3 * Math.cos(Math.random() * Math.PI)
  );
}
