import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { createAnimator_InOutViaTimeline } from "../common/createAnimator_InOutViaTimeline";
import { CogWheelMenu } from "./CogWheelMenu";
import { CogWheelMenuButton } from "./CogWheelMenuButton";

export function createCogWheelMenuButtons(events: CogWheelMenu["events"]) {
  const { app, assets, viewSize, ticker, animator } = GameSingletons.getGameContext();

  const texturesPrefix = "ui-cog-wheel-menu/";
  const textures = assets.mapTextures({
    btnLayer1: texturesPrefix + "btn-bg-1.png",
    btnLayer2: texturesPrefix + "btn-bg-2.png",
    btnIconShop: texturesPrefix + "btn-shop.png",
    btnIconRuns: texturesPrefix + "btn-runs.png",
    btnIconCards: texturesPrefix + "btn-cards.png",
  });

  const btnParameters: [keyof typeof textures, number, number, undefined | (() => Promise<unknown>)][] = [
    [`btnIconShop`, -5, -258, () => events.dispatch("onClickShop")],
    [`btnIconRuns`, -188, -180, () => events.dispatch("onClickRuns")],
    [`btnIconCards`, -253, -1, () => events.dispatch("onClickCards")],
  ];

  //// BUTTONS ////

  function createButtons() {
    return btnParameters.map(([iconName, x, y, onTrigger]) => {
      const btn = new CogWheelMenuButton(
        [textures[`btnLayer1`]!, textures[`btnLayer2`]!, textures[iconName]!],
        animator
      );

      btn.position.set(x, y);
      btn.scale.set(0.4);

      btn.onClick = async () => {
        if (!btn.isDisabled) {
          try {
            btn.isDisabled = true;
            await onTrigger?.();
          } finally {
            btn.isDisabled = false;
          }
        }
      };

      return btn;
    });
  }

  const buttons = createButtons();

  //// ANIMATIONS (SHOW / HIDE) ////

  const inOutAnimator = createAnimator_InOutViaTimeline(
    {
      howToShow: tl => {
        for (const [i, btn] of buttons.entries()) {
          tl.fromTo(
            btn,
            {
              x: 0,
              y: 0,
            },
            {
              x: btnParameters[i][1],
              y: btnParameters[i][2],
              duration: 0.4,
              ease: "back.out",
              onStart: () => {
                btn.visible = true;
              },
            },
            0.07 * i
          );
        }
        return tl;
      },
      howToHide: tl => {
        for (const btn of buttons) {
          tl.to(
            btn,
            {
              x: 0,
              y: 0,
              duration: 0.2,
              ease: "back.in",
              onComplete: () => {
                btn.visible = false;
              },
            },
            0
          );
        }

        tl.call(() => buttons.forEach(btn => (btn.visible = false)));
      },
    },
    true
  );

  ////

  return Object.assign(buttons, inOutAnimator);
}
