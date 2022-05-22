import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { makeParticlesForTheCogWheelMenu } from "@game/ui/fx/makeParticlesForTheCogWheelMenu";
import { EventBus } from "@sdk/core/EventBus";
import { MultipleReasons } from "@sdk/core/MultipleReasons";
import { EnchantmentGlobals } from "@sdk/pixi/enchant/EnchantmentGlobals";
import { lerp } from "@sdk/utils/math";
import { createAnimator_InOutViaTimeline } from "../common/createAnimator_InOutViaTimeline";
import { buttonizeCogs } from "./buttonizeCogs";
import { createCogWheelMenuButtons } from "./CogWheelMenuButtonGroup";
import { createCogWheelMenuCogWheel } from "./CogWheelMenuCogs";
import { makeRevolvingLayers } from "./makeRevolvingLayers";

const wheelTorqueIdle = 0.1;
const wheelRelativePosition = [-100, -93];

export enum CogWheelMenuMode {
  Logo = "Logo",
  Confirm = "Confirm",
}

export function createCogWheelMenu() {
  const { sfx, viewSize, ticker, animator } = GameSingletons.getGameContext();

  const events = new EventBus<{
    onClickCentralButton: () => void;

    onClickShop?: () => void;
    onClickRuns?: () => void;
    onClickCards?: () => void;

    onClose?: () => void;
    onOpen?: () => void;
  }>();

  const container = new EnchantedContainer();

  const particles = makeParticlesForTheCogWheelMenu();
  container.addChild(particles.emitterContainer);

  let idle = true;

  //// WHEEL ////

  const cogWheel = createCogWheelMenuCogWheel();
  container.addChild(cogWheel);

  //// BUTTONS ////

  const buttons = createCogWheelMenuButtons(events);
  cogWheel.addChild(...buttons);

  const onMainButtonClick = async () => events.dispatch("onClickCentralButton");

  const mainButton = buttonizeCogs(cogWheel.cogs[3], animator, () => idle && onMainButtonClick(), [
    [cogWheel.highlight, 0.95],
    [cogWheel.cogs[3], 0.95],
    [cogWheel.cogs[2], 0.99],
    [cogWheel.cogs[1], 1.01],
    [cogWheel.cogs[0], 0.98],
    [cogWheel.icons.logo, 0.85],
    [cogWheel.icons.check, 0.85],
  ]);
  container.enchantments.watch(() => mainButton.downProgress, console.log);

  //// APPLY SPINNING ANIMATION ////

  const revolver = makeRevolvingLayers([
    [cogWheel.cogs[0], 0.001],
    [cogWheel.cogs[1], -0.001],
    [cogWheel.cogs[2], -0.002],
    [cogWheel.cogs[3], 0.004],
    // [cogWheel.cogs[4], 0.0],
  ]);

  //// ANIMATIONS ////

  const WHEEL_HIDE_DISTANCE = [500, 0] as [number, number];

  let isOpen = false;
  container.visible = false;

  const ani = createAnimator_InOutViaTimeline(
    {
      howToShow: tl => {
        const [wheelX, wheelY] = wheelRelativePosition;

        let DELAY = 0;

        tl.add(() => void buttons.hide(true), DELAY);

        tl.fromTo(revolver, { torque: 50 }, { torque: wheelTorqueIdle, duration: 1.0, ease: "power2.out" }, DELAY);

        tl.to(
          cogWheel,
          {
            x: wheelX,
            y: wheelY,
            duration: 0.4,
            ease: "power3.out",
          },
          DELAY
        );

        tl.add(() => void particles.spray(), DELAY);

        DELAY += 0.26;

        tl.add(() => void buttons.show(), DELAY);
      },
      howToHide: tl => {
        const [wheelX, wheelY] = wheelRelativePosition;

        let DELAY = 0;

        tl.fromTo(revolver, { torque: wheelTorqueIdle }, { torque: 25, duration: 0.1, ease: "power2.out" }, DELAY);

        tl.add(() => void buttons.hide(), DELAY);

        DELAY += 0.21;

        tl.add(() => void particles.spray(), DELAY);

        tl.to(
          cogWheel,
          {
            x: wheelX + WHEEL_HIDE_DISTANCE[0],
            y: wheelY + WHEEL_HIDE_DISTANCE[1],
            duration: 0.15,
            ease: "power2.in",
          },
          DELAY
        );
      },
    },
    true
  );

  async function open() {
    if (isOpen) return;
    events.dispatch("onOpen");
    idle = false;
    isOpen = true;
    container.visible = true;
    ani.show();
    idle = true;
  }

  async function close() {
    if (!isOpen) return;
    events.dispatch("onClose");
    idle = false;
    isOpen = false;
    ani.hide().then(() => (container.visible = false));
    idle = true;
  }

  async function spinUp(line = true, spray = true) {
    line && particles.line();
    spray && particles.spray();
    animator.tween.fromTo(revolver, { torque: 50 }, { torque: wheelTorqueIdle, duration: 1.0, ease: "power2.out" });
  }

  const reasonsToHideRimButtons = new MultipleReasons();
  reasonsToHideRimButtons.on({
    empty: () => buttons.show(),
    notEmpty: () => buttons.hide(),
  });

  let mode = CogWheelMenuMode.Logo;
  async function setCurrentMode(value: CogWheelMenuMode) {
    if (mode === value) return;

    mode = value;

    reasonsToHideRimButtons.set("NonDashboardMode", mode !== CogWheelMenuMode.Logo);

    component.spinUp();

    switch (mode) {
      case CogWheelMenuMode.Confirm:
        cogWheel.highlight.show();
        break;
      case CogWheelMenuMode.Logo:
        cogWheel.highlight.hide();
        break;
    }
  }
  async function setHighlightGlowMode(value: boolean) {
    if (value) {
      cogWheel.highlightGlow.show();
    } else {
      cogWheel.highlightGlow.hide();
    }
  }
  async function setGrayedOutMode(value: boolean) {
    if (value) {
      cogWheel.grayedOutOverlay.show();
    } else {
      cogWheel.grayedOutOverlay.hide();
    }
  }

  //// ON ENTER FRAME ////

  const onEnterFrame = () => {
    const scale = lerp(GameSingletons.getGameContext().scaleFactor * 0.75, 1, 0.1);
    container.scale.set(scale);
    container.x = viewSize.width;
    container.y = viewSize.height;
  };
  ticker.add(onEnterFrame);
  onEnterFrame();

  //// RETURN ////

  const component = Object.assign(container, {
    zIndex: 90,
    revolver,
    cogWheel,
    buttons,
    particles,
    events,
    close,
    open,
    setHighlightGlowMode,
    setGrayedOutMode,
    spinUp,

    setCurrentMode,
    getCurrentMode() {
      return mode;
    },

    reasonsToHideRimButtons,
  });

  return component;
}

export type CogWheelMenu = ReturnType<typeof createCogWheelMenu>;
