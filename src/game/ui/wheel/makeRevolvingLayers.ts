import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { DisplayObject } from "@pixi/display";

type RevolvingLayerInput = [DisplayObject, number];

export function makeRevolvingLayers(inputs: RevolvingLayerInput[]) {
  const { app, assets, viewSize, ticker, animator } = GameSingletons.getGameContext();

  const service = Object.assign({}, { layers: inputs.map(([layer]) => layer) }, { torque: 1 });

  function onEnterFrame() {
    for (const [layer, speed] of inputs) {
      layer.rotation += service.torque * speed;
    }
    console.log();
  }

  ticker.add(onEnterFrame);

  return service;
}
