import { GameSingletons } from "@game/app/GameSingletons";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";

const DESIGN_DIMENSIONS = {
  width: 980,
  height: 980,
};

const cogsCriteria: Array<string>[] = [
  ["Top 50", "Top 100", "Top 200"],
  ["Tocium Earnings", "Total Railruns"],
  ["Today", "This Week", "30 Days" /**, "All Time" **/],
  // For server performance reasons, we are not showing "All Time" in the leaderboard for now
];

export class RailroaderDashPanelBackground extends Container {
  private readonly assets = GameSingletons.getResources();

  pad: Sprite;
  shelf: Sprite;

  get width(): number {
    return DESIGN_DIMENSIONS.width;
  }

  get height(): number {
    return DESIGN_DIMENSIONS.height;
  }

  constructor() {
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
    this.addChild(this.pad);
  }

  addYellowPlaque() {
    const texture = this.assets.getTexture("ui-railroader-dashboard/page-leaderboards/plaque.png");
    const plaque = new Sprite(texture);
    plaque.scale.set(0.6);
    plaque.position.set(275, 790);
    this.addChild(plaque);
  }

  addGreenPlaque() {
    const texture = this.assets.getTexture("ui-railroader-dashboard/plaque.png");
    const plaque = new Sprite(texture);
    plaque.scale.set(0.6);
    plaque.position.set(275, 790);
    this.addChild(plaque);
  }

  addLogo(textureId: string) {
    // "ui-railroader-dashboard/page-leaderboards/img-leaderboards.png"
    const texture = this.assets.getTexture(textureId);
    const titleImage = new Sprite(texture);
    titleImage.scale.set(0.75);
    titleImage.position.set(337, 50);
    this.addChild(titleImage);
  }

  addTablePad() {
    // table background
    {
      const texture = this.assets.getTexture("ui-railroader-dashboard/bg-table.png");
      const sprite = new Sprite(texture);
      sprite.scale.set(0.675);
      sprite.position.set(200, 310);
      this.addChild(sprite);
    }

    // table header
    {
      const texture = this.assets.getTexture("ui-railroader-dashboard/header-row.png");
      const sprite = new Sprite(texture);
      sprite.scale.set(0.685);
      sprite.position.set(185, 285);
      this.addChild(sprite);
    }
  }

  setLayoutMode(layoutMode: "portrait" | "landscape") {
    if (this.shelf) {
      this.shelf.visible = layoutMode === "portrait";
    }
  }
}
