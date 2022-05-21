import { GameContext } from "@game/app/app";
import { Texture } from "@pixi/core";
import { ParticleContainer } from "@pixi/particle-container";
import { Emitter, EmitterConfigV3 } from "@pixi/particle-emitter";
import { Rectangle as EmitterSpawnShapeRectangle } from "@pixi/particle-emitter/lib/behaviors/shapes/Rectangle";

export function makeParticlesForTheCogWheelMenu(context: GameContext) {
  const { app, assets, mapData, ticker, animator, viewport, viewSize } = context;

  const emitterContainer = new ParticleContainer(1000, {
    scale: true,
    position: true,
    rotation: true,
    uvs: true,
    alpha: true,
  });

  const emitter_Spray = new Emitter(emitterContainer, getParticleConfig_Spray());
  const emitter_Line = new Emitter(emitterContainer, getParticleConfig_Line());

  const lineSpawnShape = emitter_Line.getBehavior("spawnShape") as {
    shape: EmitterSpawnShapeRectangle;
  } | null;
  if (!lineSpawnShape) {
    throw new Error("Spawn shape not found");
  }
  const lineShape = lineSpawnShape.shape;

  ticker.add(dt => {
    // emitterContainer.position.set(viewSize.width, viewSize.height);
    emitter_Spray.update(dt / 60);
    emitter_Line.update(dt / 60);
  });

  return {
    emitterContainer,
    spray() {
      emitter_Spray.emit = true;
      emitter_Spray.resetPositionTracking();
      // emitter_Spray.updateOwnerPos(viewSize.width, viewSize.height);
    },
    line() {
      // lineShape.x = viewSize.width;
      // lineShape.y = viewSize.height;
      lineShape.w = -viewSize.width;

      emitter_Line.emit = true;
      emitter_Line.resetPositionTracking();
    },
  };
}

const texture = Texture.from("https://pixijs.io/particle-emitter/examples/images/particle.png");

function getParticleConfig_Line(): EmitterConfigV3 {
  return {
    lifetime: {
      min: 0.5,
      max: 2.5,
    },
    frequency: 0.025,
    emitterLifetime: 0.35,
    maxParticles: 200,
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
          min: 600,
          max: 600,
        },
      },
      {
        type: "color",
        config: {
          color: {
            list: [
              {
                time: 0,
                value: "fff191",
              },
              {
                time: 1,
                value: "ff622c",
              },
            ],
          },
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
          minStart: 150,
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
            w: -1000,
            h: 0,
          },
        },
      },
    ],
  };
}

function getParticleConfig_Spray(): EmitterConfigV3 {
  return {
    lifetime: {
      min: 0.5,
      max: 2,
    },
    frequency: 0.01,
    emitterLifetime: 0.15,
    maxParticles: 1000,
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
                value: 0.12,
              },
            ],
          },
        },
      },
      {
        type: "color",
        config: {
          color: {
            list: [
              {
                time: 0,
                value: "fff191",
              },
              {
                time: 1,
                value: "ff622c",
              },
            ],
          },
        },
      },
      {
        type: "moveSpeed",
        config: {
          speed: {
            list: [
              {
                time: 0,
                value: 700,
              },
              {
                time: 1,
                value: 400,
              },
            ],
          },
        },
      },
      {
        type: "moveAcceleration",
        config: {
          accel: {
            x: 0,
            y: 2000,
          },
          minStart: 300,
          maxStart: 300,
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
                value: 0.1,
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
          minSpeed: 0,
          maxSpeed: 10,
          minStart: 210,
          maxStart: 260,
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
            w: -100,
            h: 0,
          },
        },
      },
    ],
  };
}
