import { GameSingletons } from "@game/app/GameSingletons";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { IParticleProperties, ParticleContainer } from "@pixi/particle-container";
import { Emitter, EmitterConfigV3 } from "@pixi/particle-emitter";
import { enchantInstance } from "@sdk/pixi/enchant/enchantInstance";
import { EnchantmentGlobals } from "@sdk/pixi/enchant/EnchantmentGlobals";

export function makeEnchantedParticles(
  config: EmitterConfigV3,
  properties?: IParticleProperties,
  maxSize: number = 1000,
  mods?: Partial<ParticleContainer>
) {
  const emitterContainer = enchantInstance(new ParticleContainer(maxSize, properties));
  const emitter = new Emitter(emitterContainer, config);
  emitter.emit = false;
  emitterContainer.enchantments.onEnterFrame.add(() => emitter.update(EnchantmentGlobals.timeDelta));
  const behavior = {
    emitter,
    emmit: () => {
      emitter.emit = true;
      return emitterContainer.enchantments.waitUntil(() => !emitter.emit && emitterContainer.children.length === 0);
    },
    emmitAndDestroy: () => {
      return modded.emmit().then(() => modded.destroy());
    },
  };
  const modded = Object.assign(emitterContainer, mods, behavior);
  return modded;
}

export function makeParticlesExplosion(mods: Partial<ParticleContainer>) {
  const texture = Texture.from("fx/particle-b.png");
  return makeEnchantedParticles(
    getParticleConfig_Explosion(texture),
    {
      position: true,
      scale: true,
      alpha: true,
      rotation: false,
      uvs: false,
      tint: false,
      vertices: false,
    },
    100,
    mods
  );
}

export async function makeSelfDestructingParticlesExplosion(parent: Container, mods: Partial<ParticleContainer>) {
  const texture = Texture.from("fx/particle-b.png");
  const container = makeEnchantedParticles(
    getParticleConfig_Explosion(texture),
    {
      position: true,
      scale: true,
      alpha: true,
      rotation: false,
      uvs: false,
      tint: false,
      vertices: false,
    },
    100,
    mods
  );
  parent.addChild(container);

  await container.emmit();

  container.destroy();
}

function getParticleConfig_Explosion(texture: Texture): EmitterConfigV3 {
  return {
    lifetime: { min: 0.5, max: 1 },
    frequency: 0.0055,
    emitterLifetime: 0.15,
    maxParticles: 100,
    addAtBack: false,
    pos: { x: 0, y: 0 },
    behaviors: [
      {
        type: "alpha",
        config: {
          alpha: {
            list: [
              { time: 0, value: 0 },
              { time: 0.2, value: 0.2 },
              { time: 1, value: 0.0 },
            ],
          },
        },
      },
      {
        type: "moveSpeed",
        config: {
          speed: {
            list: [
              { time: 0, value: 800 },
              { time: 1, value: 200 },
            ],
          },
        },
      },
      {
        type: "scale",
        config: {
          scale: {
            list: [
              { time: 0, value: 2 },
              { time: 1, value: 2.25 },
            ],
          },
        },
      },
      {
        type: "textureSingle",
        config: { texture: texture },
      },
      {
        type: "spawnShape",
        config: {
          type: "torus",
          data: { x: 0, y: 0, radius: 120, innerRadius: 60, affectRotation: true },
        },
      },
    ],
  };
}
