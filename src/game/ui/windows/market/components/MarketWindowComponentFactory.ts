import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { createValueAnimator_Counter } from "@game/ui/common/createValueAnimator_Counter";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text, TextStyle } from "@pixi/text";
import { MarketWindow } from "../MarketWindow";

const commonLabelStyle = {
  fill: "#FFFFFF",
  fontFamily: FontFamily.Default,
};

const ASSET_PREFIX = "ui-market-window/";

export class MarketWindowComponentFactory {
  private readonly context = GameSingletons.getGameContext();

  constructor(public readonly marketWindow: MarketWindow) {}

  async loadAssets() {
    const { assets } = this.context;

    const textureAtlasPath1 = "assets/atlases-png/atlas-ui-market-window.json";
    const textureAtlasPath2 = "assets/atlases-png/atlas-ui-market-window-compositions.json";
    const resources = await assets.load({
      marketWindowComponentsTextureAtlas1: textureAtlasPath1,
      marketWindowComponentsTextureAtlas2: textureAtlasPath2,
    });

    return resources;
  }

  //// //// //// //// //// //// //// //// ////

  addTitle(title: string) {
    const titleText = new Text(title, {
      fontFamily: FontFamily.Default,
      fill: 0xffffff,
      fontSize: 56,
    });
    return titleText;
  }

  createTociumIcon() {
    const container = new Container();

    const { width, height } = this.marketWindow;
    const { userData } = this.context;

    const tociumIconTextureName = ASSET_PREFIX + "marketplace-toc.png";
    const tociumIconTexture = Texture.from(tociumIconTextureName);
    const tociumIcon = new Sprite(tociumIconTexture);
    tociumIcon.anchor.set(0.5);
    tociumIcon.scale.set(0.6);
    container.addChild(tociumIcon);

    const tociumOnScreen = createValueAnimator_Counter(() => userData.tocium);
    tociumOnScreen.animationDuration = 0.45;

    const formatTocium = (value: number) => {
      const [int, dec] = value.toFixed(4).split(".");
      const showDecimals = +dec && !tociumOnScreen.animationRunning;
      const formattedInt = int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return showDecimals
        ? formattedInt +
            parseFloat("." + dec)
              .toString()
              .substr(1)
        : formattedInt;
    };

    const tociumIconLabel = this.createLabel({
      fontSize: 36,
      anchor: [0.0, 0.5],
      getText: () => formatTocium(tociumOnScreen.valueOnScreen),
    });

    container.addChild(tociumIconLabel);

    tociumIcon.position.set(-1024, -495);
    tociumIconLabel.position.set(-960, -495);

    return container;
  }

  //// //// //// //// //// //// //// //// ////

  createLabel({
    text = "",
    fontSize = 52,
    anchor = [0.5, 0.5] as [number, number],
    position = [0.0, 0.0] as [number, number],
    getText = null as null | (() => string),
    getDangerState = null as null | (() => boolean),
    styleOverrides = {} as Partial<TextStyle>,
  }) {
    const label = new Text(text, {
      ...commonLabelStyle,
      ...styleOverrides,
      fontSize,
    });
    label.anchor.set(...anchor);
    label.position.set(...position);

    if (getText) {
      //TODO: Clean up on destroy
      this.marketWindow.enchantments.watch(getText, text => (label.text = text), true);
    }

    if (getDangerState) {
      //TODO: Clean up on destroy
      const COLORS = ["#FFFFFF", "#DD2222"];
      this.marketWindow.enchantments.watch(getDangerState, danger => (label.style.fill = COLORS[+danger]), true);
    }

    return label;
  }
}
