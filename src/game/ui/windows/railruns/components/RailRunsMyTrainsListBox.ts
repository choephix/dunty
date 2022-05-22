import { GameContext } from "@game/app/app";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { Sprite } from "@pixi/sprite";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { SafeScrollbox } from "@sdk-pixi/display/SafeScrollbox";
import { RailRunsMyTrainsListBoxRow } from "./RailRunsMyTrainsListBoxRow";
import { RailRunsMyTrainsListRowExpandedContent } from "./RailRunsMyTrainsListRowExpandedContent";
import { RailRunsMyTrainsListRowData } from "../pages/RailRunsMyTrainsPage";
import { RailRunsWindowComponentFactory } from "./RailRunsWindowComponentFactory";

const ROW_HEIGHT = 100;
const EXPANDED_CONTENT_HEIGHT = 600;

const AUTOSCROLL_ANIMATION_DURATION = 0.35;
const EXPANSION_ANIMATION_DURATION = 0.4;
const EXPANSION_ANIMATION_EASE = "power2.inOut";

function makeRect(width: number, height: number): Graphics {
  const rect = new Graphics();
  const color = ~~(Math.random() * 0xffffff);
  rect.beginFill(color, 0.5);
  rect.drawRect(0, 0, width, height);
  rect.endFill();
  return rect;
}

function addOrGetCurrentMask(target: Container) {
  const mask = (target.mask as Graphics) || makeRect(target.width, target.height);
  mask.position.copyFrom(target);
  mask.renderable = false;
  target.parent.addChild(mask);
  target.mask = mask;

  function cleanUp() {
    if (!mask.destroyed) {
      mask.destroy();
    }
    if (target.mask == mask) {
      target.mask = null;
    }
  }

  return cleanUp;
}

export class RailRunsMyTrainsListBox extends SafeScrollbox {
  private readonly tweeener = new TemporaryTweeener(this);

  private tableRows: RailRunsMyTrainsListBoxRow[] = [];

  /**
   * Makes sure you can scroll a bit beyond the bottom of the list.
   * Fixes animations when expanding rows on the last screen.
   */
  private endOfListFiller: Sprite;

  private currentIndex: number;
  private currentExpandedPage: RailRunsMyTrainsListRowExpandedContent | null;
  private cachedExpandedPages: Record<number, RailRunsMyTrainsListRowExpandedContent>;

  constructor(
    trainsData: Array<RailRunsMyTrainsListRowData>,
    protected readonly componentFactory: RailRunsWindowComponentFactory,
    protected readonly context: GameContext
  ) {
    super({
      noTicker: true,
      boxWidth: 2000,
      boxHeight: 700,
      overflowX: "none",
      stopPropagation: true,
      divWheel: context.app.view,
    });

    this.currentIndex = -1;
    this.currentExpandedPage = null;
    this.cachedExpandedPages = {};

    this.endOfListFiller = this.content.addChild(this.addInvisibleBox(EXPANDED_CONTENT_HEIGHT));
    this.fill(trainsData);
  }

  async fill(trainsData: RailRunsMyTrainsListRowData[]) {
    const cb = async (index: number) => {
      await this.toggleRowExpandedContent(index);
    };

    for (const row in trainsData) {
      if (this.destroyed) {
        return;
      }

      const rowIndex = +row;
      const tableRow = new RailRunsMyTrainsListBoxRow(
        this.boxWidth,
        trainsData[row],
        this.componentFactory,
        this.context,
        rowIndex,
        cb
      );
      this.tableRows.push(tableRow);
      this.content.addChild(tableRow);
      this.cachedExpandedPages[rowIndex] = this.createExpandedContent(rowIndex);

      this.updateContentPositions();
      this.update();

      await this.context.ticker.nextFrame();
    }
  }

  addInvisibleBox(px: number) {
    const box = new Sprite(Texture.EMPTY);
    box.width = this.boxWidth + 1;
    box.height = px;
    return box;
  }

  private async toggleRowExpandedContent(index: number) {
    const prevIndex = this.currentIndex;

    console.log(`Toggling expanded content for row ${index} from ${prevIndex}`);

    if (this.currentExpandedPage) {
      this.closeExpandedContent(this.currentIndex);
      this.currentIndex = -1;
    }

    if (index !== prevIndex) {
      console.log(`🥶 Current row changed from ${prevIndex} to ${index}`);
      this.currentIndex = index;
      this.openExpandedContent(index);
    }

    this.updateContentPositions();
  }

  private async scrollToRow(rowIndex: number) {
    await this.tweeener.to(this, {
      scrollTop: ROW_HEIGHT * rowIndex + 25,
      duration: AUTOSCROLL_ANIMATION_DURATION,
    });
  }

  private async moveUp(expandedPage: Container) {
    const removeMask = addOrGetCurrentMask(expandedPage);
    expandedPage.pivot.y = 0;

    await this.tweeener.to(expandedPage.pivot, {
      y: EXPANDED_CONTENT_HEIGHT,
      duration: EXPANSION_ANIMATION_DURATION,
      onComplete: removeMask,
      ease: EXPANSION_ANIMATION_EASE,
    });
  }

  private async moveDown(expandedPage: Container) {
    const removeMask = addOrGetCurrentMask(expandedPage);
    expandedPage.pivot.y = EXPANDED_CONTENT_HEIGHT;

    await this.tweeener.to(expandedPage.pivot, {
      y: 0,
      duration: EXPANSION_ANIMATION_DURATION,
      onComplete: removeMask,
      ease: EXPANSION_ANIMATION_EASE,
    });
  }

  private async openExpandedContent(index: number) {
    const row = this.tableRows[index];
    const newExpandedPage = this.cachedExpandedPages[row.index];

    if (!newExpandedPage) {
      return console.error("No cached page found");
    }

    this.currentExpandedPage = newExpandedPage;

    console.log({ page: this.currentExpandedPage });

    row.setExpandedState(true);
    this.scrollToRow(index);

    row.addChild(newExpandedPage);
    await this.moveDown(newExpandedPage);

    await newExpandedPage.afterShowAnimation();
  }

  private async closeExpandedContent(index: number) {
    const prevExpandedPage = this.currentExpandedPage;

    if (!prevExpandedPage) {
      return;
    }

    const row = this.tableRows[index];
    this.currentExpandedPage = null;

    row.setExpandedState(false);

    await prevExpandedPage.beforeHideAnimation();

    await this.moveUp(prevExpandedPage);
    row.removeChild(prevExpandedPage);
  }

  private createExpandedContent(index: number) {
    const row = this.tableRows[index];
    const expandedPage = new RailRunsMyTrainsListRowExpandedContent(row.train);

    expandedPage.x = 80;
    expandedPage.y = ROW_HEIGHT;
    expandedPage.name = "expandedPage";

    return expandedPage;
  }

  private async updateContentPositions() {
    let nextPositionY = 45;

    const tweens = this.tableRows.map(row => {
      const isExpanded = row.index === this.currentIndex;

      const tweeener = new TemporaryTweeener(row);
      const tween = tweeener.to(row, {
        y: nextPositionY,
        duration: EXPANSION_ANIMATION_DURATION,
        ease: EXPANSION_ANIMATION_EASE,
      });
      nextPositionY += ROW_HEIGHT + (isExpanded ? EXPANDED_CONTENT_HEIGHT : 0);
      return tween;
    });

    this.endOfListFiller.y = nextPositionY;

    await Promise.all(tweens);
  }
}
