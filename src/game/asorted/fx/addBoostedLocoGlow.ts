import { CardGlowMesh } from "@game/fx/glow-overlay/CardGlowMesh";
import { CardSprite, CARD_SPRITE_DIMENSIONS } from "@game/ui/cards/CardSprite";
import { WRAP_MODES } from "@pixi/constants";
import { Texture } from "@pixi/core";

export function addBoostedLocoGlow(card: CardSprite) {
  const maskTextureId: string = "https://public.cx/1/card-glow/g.png";
  const noiseTextureId: string = "perlin";
  const textureMask = Texture.from(maskTextureId);
  const textureNoise = Texture.from(noiseTextureId);
  textureNoise.baseTexture.wrapMode = WRAP_MODES.MIRRORED_REPEAT;
  const boostedGlow = new CardGlowMesh(textureMask, textureNoise, { colorLow: [0.8, 0, 0], colorHigh: [0, 6, 12] });
  boostedGlow.pivot.set(64);
  boostedGlow.scale.set(8, 8);
  boostedGlow.position.set(CARD_SPRITE_DIMENSIONS.width / 2, CARD_SPRITE_DIMENSIONS.height / 2);
  card.addChild(boostedGlow);
}
