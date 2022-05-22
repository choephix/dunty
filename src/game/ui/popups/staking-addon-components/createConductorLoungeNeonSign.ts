import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { Container } from "@pixi/display";
import { Text, TextStyle } from "@pixi/text";
import { EnchantmentGlobals } from "@sdk/pixi/enchant/EnchantmentGlobals";
import { SimpleTimeline } from "@sdk/time/SimpleTimeline";

const atlasTexturePrefix = "ui-staking-hub/conductor-lounge/";

export function createConductorLoungeNeonSign(stationName: string = "") {
  const { simpleFactory } = GameSingletons.getGameContext();

  const neonSignContainer = new Container();

  const style = new TextStyle({
    dropShadow: true,
    dropShadowAngle: 0,
    dropShadowBlur: 4,
    dropShadowColor: "#00a4ff",
    dropShadowDistance: 0,
    fill: "#00145d",
    fontFamily: FontFamily.Default,
    fontSize: 15,
    lineJoin: "round",
    stroke: "#d3f2ff",
    strokeThickness: 2,
  });
  const stationNameLabel = new Text(stationName.toUpperCase(), style);
  stationNameLabel.name = "title";
  stationNameLabel.position.set(141, 73);
  neonSignContainer.addChild(stationNameLabel);

  const signSpriteOff = simpleFactory.createSprite(atlasTexturePrefix + `neon-sign-off.png`);
  signSpriteOff.name = "signSpriteOff";
  signSpriteOff.scale.set(0.5 * 4); // Off image version is x4 actually smaller
  neonSignContainer.addChild(signSpriteOff);

  const signSpriteOn = simpleFactory.createSprite(atlasTexturePrefix + `neon-sign.png`);
  signSpriteOn.name = "signSpriteLight";
  signSpriteOn.scale.set(0.5);
  neonSignContainer.addChild(signSpriteOn);

  let isTurnedOn = false;
  let _timeline: SimpleTimeline | undefined;
  function onEnterFrame() {
    _timeline?.progress(EnchantmentGlobals.timeDelta);
  }

  function turnOff() {
    signSpriteOn.alpha = 0;
    stationNameLabel.alpha = 0;
  }

  function turnOn() {
    isTurnedOn = true;

    const timeline = (_timeline = new SimpleTimeline());
    function addFlickerTween(duration: number, strength: number | ((p: number) => number)) {
      timeline.addTween(p => {
        const strengthValue = typeof strength === "function" ? strength(p) : strength;
        signSpriteOn.alpha = strengthValue;
        stationNameLabel.alpha = strengthValue;
      }, duration);
    }

    addFlickerTween(0.23, 0);
    addFlickerTween(0.03, () => 0.1 * Math.random());
    addFlickerTween(0.06, 0);
    addFlickerTween(0.03, () => 0.3 * Math.random());
    addFlickerTween(0.31, 0);
    addFlickerTween(0.07, p => p * Math.random());

    let nextFlickerTime = 2.0;
    let flickerTimeLeft = 0.0;
    timeline.addIndefiniteTween(p => {
      const now = EnchantmentGlobals.timeTotal;

      if (flickerTimeLeft <= 0) {
        if (now < nextFlickerTime) {
          signSpriteOn.alpha = 1;
          stationNameLabel.alpha = 1;
        } else {
          flickerTimeLeft = 0.3 * Math.random();
        }
      }

      if (flickerTimeLeft > 0) {
        flickerTimeLeft -= EnchantmentGlobals.timeDelta;

        const alpha = 0.2 + Math.random();
        signSpriteOn.alpha = alpha;
        stationNameLabel.alpha = alpha;

        if (flickerTimeLeft <= 0) {
          flickerTimeLeft = 0;
          nextFlickerTime = now + 5.0 * Math.random();
        }
      }
    });
  }

  return Object.assign(neonSignContainer, {
    isTurnedOn() {
      return isTurnedOn;
    },
    turnOff,
    turnOn,
    onEnterFrame,
  });
}

export type ConductorLoungeNeonSign = ReturnType<typeof createConductorLoungeNeonSign>;
