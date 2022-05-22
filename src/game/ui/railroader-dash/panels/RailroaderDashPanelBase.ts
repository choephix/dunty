import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { RailroaderDashComponentFactory } from "../RailroaderDashComponentFactory";

const DESIGN_DIMENSIONS = {
  width: 980,
  height: 980,
};

export abstract class RailroaderDashPanelBase extends Container {
  public readonly tweeener = new TemporaryTweeener(this);
  protected readonly assets = GameSingletons.getResources();
  protected readonly factory = GameSingletons.getSimpleObjectFactory();

  public readonly pad: Sprite;
  public readonly shelf: Sprite;

  public scaleMultiplier = 1;

  get width(): number {
    return DESIGN_DIMENSIONS.width;
  }

  get height(): number {
    return DESIGN_DIMENSIONS.height;
  }
  constructor(public readonly componentFactory: RailroaderDashComponentFactory) {
    super();

    //// Shelf
    const shelfTexture = this.assets.getTexture("ui-railroader-dashboard/panel-shelf.png");
    this.shelf = new Sprite(shelfTexture);
    this.shelf.anchor.set(0.5, 0.5);
    this.shelf.width = 5000;
    this.shelf.height = 100;
    this.shelf.position.set(980, 920);
    this.addChild(this.shelf);

    //// Background
    const padTexture = this.assets.getTexture("railroaderDashboardPanelBackgroundWithBase");
    this.pad = new Sprite(padTexture);
    this.pad.scale.set(0.7);
    this.pad.interactive = true;
    this.addChild(this.pad);
  }

  abstract init(): void;

  //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////
  //// Factory Methods
  //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////

  addYellowPlaque() {
    const texture = this.assets.getTexture("ui-railroader-dashboard/page-leaderboards/plaque.png");
    const plaque = new Sprite(texture);
    plaque.scale.set(0.6);
    plaque.position.set(275, 790);
    return this.addChild(plaque);
  }

  addGreenPlaque(options: { textureId?: string; message?: string }, fontSize: number = 24) {
    const { textureId = "ui-railroader-dashboard/plaque.png", message: textContents } = options;

    const texture = this.assets.getTexture(textureId);
    const plaque = new Sprite(texture);
    plaque.name = `plaque`;
    plaque.scale.set(0.7);
    plaque.position.set(485, 855);
    plaque.pivot.set(texture.width / 2, texture.height / 2);
    this.addChild(plaque);

    if (textContents) {
      const text = new Text(textContents.trim(), {
        fontFamily: FontFamily.Default,
        fontSize: fontSize,
        fill: 0xffffff,
        align: "center",
        wordWrap: true,
        wordWrapWidth: 620,
      });
      text.anchor.set(0.5);
      text.position.set(texture.width / 2, texture.height / 2);
      plaque.addChild(text);
    }

    return plaque;
  }

  addTitleImage(textureId: string) {
    const texture = this.assets.getTexture(textureId);
    const titleImage = new Sprite(texture);
    titleImage.scale.set(0.75);
    titleImage.position.set(337, 50);
    return this.addChild(titleImage);
  }

  addListPad() {
    const container = new Container();

    // table background
    {
      const texture = this.assets.getTexture("ui-railroader-dashboard/bg-table.png");
      const sprite = new Sprite(texture);
      sprite.scale.set(0.675);
      sprite.position.set(0, 0);
      container.addChild(sprite);
    }

    // table header
    {
      const texture = this.assets.getTexture("ui-railroader-dashboard/header-row.png");
      const sprite = new Sprite(texture);
      sprite.scale.set(0.685);
      sprite.position.set(-15, -25);
      container.addChild(sprite);
    }

    container.position.set(200, 310);

    this.addChild(container);
    return container;
  }

  setLayoutMode(layoutMode: "portrait" | "landscape") {
    if (this.shelf) {
      this.shelf.visible = layoutMode === "portrait";
    }
  }

  // abstract setLayoutMode?: (layoutMode: "portrait" | "landscape") => void;

  //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////
  //// Animation Methods
  //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////

  playShowAnimation() {
    return this.tweeener.from(this, {
      pixi: {
        alpha: 0.0,
        // scale: 0.0,
        pivotY: -1000,
      },
      scaleMultiplier: 0.0,
      duration: 0.7,
      ease: "power4.out",
    });
  }

  playHideAnimation() {
    return this.tweeener.to(this, {
      pixi: {
        alpha: 0.0,
        // scale: this.scale.x * 0.7,
        pivotY: -1000,
      },
      scaleMultiplier: 0.0,
      duration: 0.3,
      ease: "back.in",
    });
  }
}
