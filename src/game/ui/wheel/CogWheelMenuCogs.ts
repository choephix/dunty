import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { range } from "@sdk/utils/range";
import { createAnimator_InOutViaTimeline } from "../common/createAnimator_InOutViaTimeline";

export function createCogWheelMenuCogWheel() {
  const { assets, ticker } = GameSingletons.getGameContext();

  const container = new Container();

  const texturesPrefix = "ui-cog-wheel-menu/";
  const textures = assets.mapTextures({
    cogLayer0: texturesPrefix + "cog-0.png",
    cogLayer1: texturesPrefix + "cog-1.png",
    cogLayer2: texturesPrefix + "cog-2.png",
    cogLayer3: texturesPrefix + "cog-3.png",
    cogLayer4: texturesPrefix + "cog-4.png",
    cogLayer4_Special: texturesPrefix + "cog-4-green.png",
    cogLayer4_Special2: texturesPrefix + "cog-4-green-glow.png",
    cogLayer4_Disabled: texturesPrefix + "cog-4-gray.png",
    iconTocLogo: texturesPrefix + "toc-logo.png",
    iconCheck: texturesPrefix + "check.png",
  });
  type TextureKey = keyof typeof textures;

  const cogs = range.fromToIncluding(0, 4).map(j => {
    const cogTexture = textures[`cogLayer${j}`];
    const cog = new Sprite(cogTexture);
    cog.anchor.set(0.5);
    cog.scale.set(0.6);
    cog.zIndex = j * 10;
    return cog;
  });
  container.addChild(...cogs);

  function createHighlight(textureName: TextureKey) {
    const highlightTexture = textures[textureName];
    const highlight = new Sprite(highlightTexture);
    highlight.anchor.set(0.5);
    highlight.scale.set(0.6);
    highlight.zIndex = 100;
    highlight.alpha = 0;
    return highlight;
  }

  function addIcon(textureName: TextureKey, scale: number = 1) {
    const icon = new Sprite(textures[textureName]);
    icon.anchor.set(0.5);
    icon.scale.set(scale);
    icon.zIndex = 1000;

    const animationState = {
      _shownProgress: 1,
      get shownProgress() {
        return this._shownProgress;
      },
      set shownProgress(value) {
        this._shownProgress = value;
        icon.scale.set(value * scale);
        icon.alpha = value;
      },
    };

    return Object.assign(icon, { animationState });
  }

  const highlight = createHighlight("cogLayer4_Special");
  const highlightGlow = createHighlight("cogLayer4_Special2");
  const grayedOutOverlay = createHighlight("cogLayer4_Disabled");
  container.addChild(highlight, highlightGlow, grayedOutOverlay);

  const icons = {
    logo: addIcon("iconTocLogo", 0.2),
    check: addIcon("iconCheck"),
  };
  container.addChild(...Object.values(icons));

  //// ANIMATIONS (SHOW / HIDE HIGHLIGHT) ////

  const highlightAnimator = createAnimator_InOutViaTimeline(
    {
      howToShow: tl => {
        let delay = 0;

        tl.to(
          icons.logo.animationState,
          {
            shownProgress: 0,
            duration: 0.2,
            ease: "back.in",
          },
          delay
        );

        tl.to(icons.check.animationState, {
          shownProgress: 1,
          duration: 0.3,
          ease: "power2.inOut",
        });

        tl.to(
          highlight,
          {
            alpha: 1,
            duration: 0.6,
          },
          delay
        );

        return tl;
      },
      howToHide: tl => {
        let delay = 0;

        tl.to(
          icons.check.animationState,
          {
            shownProgress: 0,
            duration: 0.2,
            ease: "power2.inOut",
          },
          delay
        );

        tl.to(icons.logo.animationState, {
          shownProgress: 1,
          duration: 0.3,
          ease: "back.out",
        });

        tl.to(
          highlight,
          {
            alpha: 0,
            duration: 0.6,
          },
          delay
        );
      },
    },
    true
  );

  const highlightGlowAnimator = createAnimator_InOutViaTimeline(
    {
      howToShow: tl => {
        let delay = 0;

        tl.to(
          highlightGlow,
          {
            alpha: 1,
            duration: 0.6,
          },
          delay
        );

        return tl;
      },
      howToHide: tl => {
        let delay = 0;

        tl.to(
          highlightGlow,
          {
            alpha: 0,
            duration: 0.6,
          },
          delay
        );
      },
    },
    true
  );

  const grayedOutOverlayAnimator = createAnimator_InOutViaTimeline(
    {
      howToShow: tl => {
        let delay = 0;

        tl.to(
          grayedOutOverlay,
          {
            alpha: 1,
            duration: 0.6,
          },
          delay
        );

        return tl;
      },
      howToHide: tl => {
        let delay = 0;

        tl.to(
          grayedOutOverlay,
          {
            alpha: 0,
            duration: 0.6,
          },
          delay
        );
      },
    },
    true
  );

  // function onEnterFrame(dt: number) {
  //   const str = Math.sin(ticker.lastTime / 300);
  //   highlight2.alpha = str * str * str * str * highlight.alpha;
  // }
  // ticker.add(onEnterFrame);

  ////

  return Object.assign(container, {
    sortableChildren: true,
    cogs,
    icons,
    highlight: Object.assign(highlight, {
      show: highlightAnimator.show,
      hide: highlightAnimator.hide,
    }),
    highlightGlow: Object.assign(highlightGlow, {
      show: highlightGlowAnimator.show,
      hide: highlightGlowAnimator.hide,
    }),
    grayedOutOverlay: Object.assign(grayedOutOverlay, {
      show: grayedOutOverlayAnimator.show,
      hide: grayedOutOverlayAnimator.hide,
    }),
  });
}
