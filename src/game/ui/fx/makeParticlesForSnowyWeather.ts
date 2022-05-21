import { GameContext } from "@game/app/app";
import { Texture } from "@pixi/core";
import { ParticleContainer } from "@pixi/particle-container";
import { Emitter, EmitterConfigV3 } from "@pixi/particle-emitter";
import { Rectangle as EmitterSpawnShapeRectangle } from "@pixi/particle-emitter/lib/behaviors/shapes/Rectangle";

export function makeParticlesForSnowyWeather(context: GameContext) {
  const { app, assets, mapData, ticker, animator, viewport, viewSize } = context;

  const emitterContainer = new ParticleContainer(1000, {
    scale: true,
    position: true,
    rotation: true,
    uvs: true,
    alpha: true,
  });

  const emitter_Line = new Emitter(emitterContainer, getParticleConfig_Line());

  const lineSpawnShape = emitter_Line.getBehavior("spawnShape") as {
    shape: EmitterSpawnShapeRectangle;
  } | null;
  if (!lineSpawnShape) {
    throw new Error("Spawn shape not found");
  }
  const lineShape = lineSpawnShape.shape;

  emitter_Line.update(100.0);

  ticker.add(dt => {
    // emitterContainer.position.set(viewSize.width, viewSize.height);
    emitter_Line.update(dt / 60);
  });

  return {
    emitterContainer,
    start() {
      lineShape.w = viewSize.width;

      emitter_Line.emit = true;
      emitter_Line.resetPositionTracking();
    },
  };
}

function getParticleConfig_Line(): EmitterConfigV3 {
  const texture = Texture.from("https://pixijs.io/particle-emitter/examples/images/particle.png");
  return {
    autoUpdate: false,
    lifetime: {
      min: 2.0,
      max: 12,
    },
    frequency: 0.01,
    maxParticles: 512,
    addAtBack: false,
    pos: {
      x: 0,
      y: 0,
    },
    behaviors: [
      {
        type: "alpha",
        config: {
          alpha: {
            list: [
              {
                time: 0,
                value: 1,
              },
              {
                time: 1,
                value: 0.22,
              },
            ],
          },
        },
      },
      {
        type: "moveSpeedStatic",
        config: {
          min: -600,
          max: -600,
        },
      },
      {
        type: "scale",
        config: {
          scale: {
            list: [
              {
                time: 0,
                value: 0.2,
              },
              {
                time: 1,
                value: 0.02,
              },
            ],
          },
          minMult: 0.5,
        },
      },
      {
        type: "rotation",
        config: {
          accel: 0,
          minSpeed: 10,
          maxSpeed: 150,
          minStart: 250,
          maxStart: 300,
        },
      },
      {
        type: "textureSingle",
        config: {
          texture: texture,
        },
      },
      {
        type: "spawnShape",
        config: {
          type: "rect",
          data: {
            x: 0,
            y: 0,
            w: 1000,
            h: 0,
          },
        },
      },
    ],
  };
}
