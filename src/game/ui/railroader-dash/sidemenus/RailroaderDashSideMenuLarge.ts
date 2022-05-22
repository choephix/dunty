import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { ThemeColors } from "@game/constants/ThemeColors";
import { openChooChooDrawLink } from "@game/gameplay/externals/chooChooDrawLink";
import { openWikiLink } from "@game/gameplay/externals/tocWikiLink";
import { openV1PackLink } from "@game/gameplay/externals/v1MixPackLink";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { GlowFilterService } from "../../fx/GlowFilterService";
import { getRailroaderDashTabsConfiguration } from "./railroaderDashSidemenuConfigurations";

const bannerSlidesData = [
  {
    title: "CENTURYVERSE WIKI",
    body: "Welcome to both seasoned and new\nRailroaders alike! Lost? The Wiki is a great\nplace to find answers.",
    footer: "Let's Go...",
    textureId: "ui-railroader-dashboard/event-banners/wiki.png",
    function: openWikiLink,
  },
  {
    title: "V1 Mix Pack Drop",
    body: "Better Pack Odds & Redeemables!\nSale ends Saturday May 7th",
    footer: "Drop Link",
    textureId: "ui-railroader-dashboard/event-banners/v1-drop.png",
    function: openV1PackLink,
  },
  {
    title: "Happy V1 Day!",
    body: "Welcome to both seasoned and new Railroaders alike!\nLost? Check out the Wiki!",
    footer: "Let's Go...",
    textureId: "ui-railroader-dashboard/event-banners/wiki.png",
    function: openWikiLink,
  },
  {
    title: "James Park Choo Draw",
    body: "Enter Tocium to Win Prizes! Drawings occur on a bi-weekly basis.",
    footer: "Let's Go...",
    textureId: "ui-railroader-dashboard/event-banners/jpcc.png",
    function: openChooChooDrawLink,
  },
];

export class RailroaderDashSideMenuLarge extends Container {
  private readonly context = GameSingletons.getGameContext();
  private readonly tweeener = new TemporaryTweeener(this);

  private readonly glowFilterService: GlowFilterService = new GlowFilterService();

  constructor(public readonly setTab: (index: number) => void) {
    super();

    this.init();
  }

  init() {
    //// Add background
    const bg = this.context.simpleFactory.createSprite("ui-railroader-dashboard/left-panel-bg.png", {
      x: 0,
      y: 75,
    });
    bg.scale.set(0.7);
    this.addChild(bg);

    //// Add Promotional Event Banner
    this.addPromoBanner();

    //// Add selection tabs
    this.addChild(this.addSelectionTabs());
  }

  addPromoBanner() {
    const { simpleFactory } = this.context;
    const slide = bannerSlidesData[0];

    //// Add Event Title Card
    const image = simpleFactory.createSprite(slide.textureId, { x: 0, y: 115 });
    image.scale.set(0.7);
    buttonizeDisplayObject(image, slide.function);
    this.addChild(image);

    //// Add Event Title text
    const title = simpleFactory.createText(slide.title, {
      fontFamily: FontFamily.Default,
      fontSize: 35,
      fill: 0xffffff,
    });
    title.position.set(25, 360);
    this.addChild(title);

    //// Add Event Body text
    const description = simpleFactory.createText(slide.body, {
      fontFamily: FontFamily.DefaultThin,
      fontSize: 20,
      fill: 0xffffff,
      wordWrap: true,
      wordWrapWidth: 400,
      lineHeight: 30,
    });
    description.position.set(25, 415);
    this.addChild(description);

    //// Add Event Footer text
    const footer = simpleFactory.createText(slide.footer, {
      fontFamily: FontFamily.Default,
      fontSize: 20,
      fill: 0xf0b503,
      align: "right",
    });
    footer.anchor.set(1, 0);
    footer.position.set(400, 475);
    buttonizeDisplayObject(footer, slide.function);
    this.addChild(footer);

    //// Add underline
    const underline = new Graphics()
      .lineStyle(1.25, ThemeColors.ACTIVE_COLOR.toInt())
      .moveTo(25, 525)
      .lineTo(image.width - 25, 525);
    this.addChild(underline);
  }

  addSelectionTabs(): Container {
    const container = new Container();
    let startY = 550;
    let startX = 25;

    const tabsCfg = getRailroaderDashTabsConfiguration();
    for (const [tabKey, { largeMenuTexture, disabled }] of Object.entries(tabsCfg)) {
      const sprite = this.context.simpleFactory.createSprite(largeMenuTexture, {
        x: startX,
        y: startY,
      });
      sprite.scale.set(0.7);
      if (!disabled) {
        buttonizeDisplayObject(sprite, () => this.setTab(+tabKey - 1));
      } else {
        sprite.tint = 0x7e7e7e;
      }
      container.addChild(sprite);
      startX += sprite.width + 12.5;

      if (+tabKey % 3 == 0) {
        startX = 25;
        startY += 100;
      }
    }
    return container;
  }

  playShowAnimation() {
    return this.tweeener.fromTo(
      this.pivot,
      {
        x: 500,
      },
      {
        delay: 0.2,
        x: 0,
        duration: 1.3,
        ease: "bounce.out",
      }
    );
  }

  playHideAnimation() {
    return this.tweeener.fromTo(
      this.pivot,
      {
        x: 0,
      },
      {
        x: 500,
        duration: 0.2,
        ease: "power2.in",
      }
    );
  }
}
