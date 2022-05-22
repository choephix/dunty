import { GameSingletons } from "@game/app/GameSingletons";
import { formatDateTimeHumanReadable } from "@game/asorted/formatDateTimeHumanReadable";
import { FontFamily } from "@game/constants/FontFamily";
import { CardEntity } from "@game/data/entities/CardEntity";
import { SimpleCardsCarousel } from "@game/ui/components/SimpleCardsCarousel";
import { DashboardButton } from "@game/ui/popups/components/dash/DashboardButton";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { Point } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import { ITextStyle, Text } from "@pixi/text";
import { CardAssetId } from "@sdk-integration/contracts";
import { SafeScrollbox } from "@sdk-pixi/display/SafeScrollbox";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { nextFrame } from "@sdk/utils/promises";
import { GoldenRunCheckResult, GRSMembersData, MyGoldenRunSubmissionData } from "./models";

const EXPANDED_CONTENT_HEIGHT = 240;

const AUTOSCROLL_ANIMATION_DURATION = 0.5;
const EXPANSION_ANIMATION_DURATION = 0.55;
const EXPANSION_ANIMATION_EASE = "power3.inOut";
const rowXCoordinates = [70, 340, 398];

const commonLabelStyle: Partial<ITextStyle> = {
  fill: "#FFFFFF",
  fontFamily: FontFamily.DefaultThin,
};

const statusToDisplayProperties: Record<GoldenRunCheckResult, [text: string, style: Partial<ITextStyle>]> = {
  [GoldenRunCheckResult.GoldenRun]: ["GOLDEN RUN", { fill: "#ffd647" }],
  [GoldenRunCheckResult.LateGoldenRun]: ["Someone else found this", { fill: "#dfdfdf", fontStyle: "italic" }],
  [GoldenRunCheckResult.NotGoldenRun]: ["Not a golden run", { fill: "#787878", fontStyle: "italic" }],
};

function makeRect(width: number, height: number): Graphics {
  const rect = new Graphics();
  const color = ~~(Math.random() * 0xffffff);
  rect.beginFill(color, 0.5);
  rect.drawRect(0, 0, width, height);
  rect.endFill();
  return rect;
}

function addOrGetCurrentMask(target: Container) {
  const mask = (target.mask as Graphics) || makeRect(target.width + 60, target.height);
  mask.position.copyFrom(target);
  mask.position.x -= 30;
  mask.renderable = false;
  target.parent.parent.addChild(mask);
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

class ExpandableRow extends Container {
  index: number;
  expandIcon: Container;

  constructor(index: string | number, rowPos: number) {
    super();
    this.index = Number(index);

    /// Add dropdown icon
    this.expandIcon = this.makeToolTipArrow();
    this.expandIcon.position.set(518, rowPos);
    this.addChild(this.expandIcon);
  }

  // TODO: track expanded state on the row and toggle the icon
  setExpandedState(expanded: boolean) {
    console.log("Icon toggled");
    this.expandIcon.scale.y = expanded ? -1 : 1;
    this.expandIcon.y += expanded ? 8 : -8;
  }

  makeToolTipArrow(color: number = 0xcccccc): Container {
    const container = new Container();

    const arr = new Graphics();
    arr.beginFill(color);
    arr.drawPolygon([new Point(0, 0), new Point(12, 0), new Point(6, 10)]);

    container.addChild(arr);
    return container;
  }
}

export class GoldenRunsList extends SafeScrollbox {
  private readonly assets = GameSingletons.getResources();
  private readonly tweeener = new TemporaryTweeener(this);

  /**
   * Makes sure you can scroll a bit beyond the bottom of the list.
   * Fixes animations when expanding rows on the last screen.
   */
  private endOfListFiller: Sprite;
  private tableRows: ExpandableRow[] = [];

  private currentIndex: number;
  private currentExpandedPage: Container | null;
  private cachedExpandedPages: Record<number, () => Container>;

  public onSubmitClick?: (trasactionId: string) => unknown;

  constructor() {
    super({
      noTicker: true,
      boxWidth: 555,
      boxHeight: 425,
      stopPropagation: true,
      divWheel: GameSingletons.getGameContext().app.view,
      overflowX: "none",
    });

    this.currentIndex = -1;
    this.currentExpandedPage = null;
    this.cachedExpandedPages = {};
    this.endOfListFiller = this.content.addChild(this.addInvisibleBox(EXPANDED_CONTENT_HEIGHT));
  }

  async addGRSMemebersRows(rowData: GRSMembersData[], fontSize: number) {
    let startY = 10;
    const GgRSMembersRowXCoords = [70, 370, 480];

    for (let row in rowData) {
      /// Row Container
      const rowContainer = new Container();

      const conductorLabel = new Text(rowData[row].conductor, {
        ...commonLabelStyle,
        fontSize: fontSize,
        ...(rowData[row].railroader ? { fill: "0xbca012" } : {}),
      });
      conductorLabel.position.set(GgRSMembersRowXCoords[0], startY);
      rowContainer.addChild(conductorLabel);

      const railroaderLabel = new Text(rowData[row].railroader, {
        ...commonLabelStyle,
        fontSize: fontSize,
        ...(rowData[row].railroader ? { fill: "0xbca012" } : {}),
      });
      railroaderLabel.position.set(GgRSMembersRowXCoords[1], startY);
      rowContainer.addChild(railroaderLabel);

      /// Row Underline
      const graphics = new Graphics()
        .lineStyle(1.5, 0x777777, 0.3)
        .moveTo(conductorLabel.x, startY + 30)
        .lineTo(GgRSMembersRowXCoords[2] + 10, startY + 30);

      rowContainer.addChild(graphics);

      this.content.addChild(rowContainer);
      startY += conductorLabel.height + 20;

      await nextFrame();
      this.update();
    }
    this.content.addChild(this.addInvisibleBox(426));
    this.update();
  }

  async addMySubmissionsRows(rowData: MyGoldenRunSubmissionData[], fontSize: number) {
    let startY = 10;

    this.content.removeChildren();

    for (let rowIndex in rowData) {
      const row = rowData[rowIndex];

      /// Row Container
      const rowContainer = new ExpandableRow(rowIndex, startY);
      this.tableRows.push(rowContainer);
      this.content.addChild(rowContainer);
      const rowY = startY;
      this.cachedExpandedPages[rowIndex] = () => this.addExpandedPage(row.cardAssetIds, rowY + rowContainer.height);

      /// Conductor head sprite
      const conductorHead = new Sprite(
        this.assets.getTexture(
          `ui-railroader-dashboard/page-golden-runs/conductor-heads/${rowData[rowIndex].conductorImg}`
        )
      );
      conductorHead.position.set(20, startY - 2);
      conductorHead.scale.set(0.2);
      conductorHead.name = `conductorHead-${startY}`;
      rowContainer.addChild(conductorHead);

      /// Train column
      const trainLabel = new Text(rowData[rowIndex].train, {
        ...commonLabelStyle,
        fontSize,
      });
      trainLabel.position.set(rowXCoordinates[0], startY);
      rowContainer.addChild(trainLabel);

      /// Arrival Time column
      const arrivalTimeLabelText = formatDateTimeHumanReadable(new Date(rowData[rowIndex].arrivalTime));
      const arrivalTimeLabel = new Text(arrivalTimeLabelText, { ...commonLabelStyle, fontSize });
      arrivalTimeLabel.anchor.set(1, 0);
      arrivalTimeLabel.position.set(rowXCoordinates[1], startY);
      rowContainer.addChild(arrivalTimeLabel);

      const rowClickBox = new Sprite(Texture.EMPTY);
      rowClickBox.position.set(0, startY - 10);
      rowClickBox.width = rowContainer.width + 50;
      rowClickBox.height = rowContainer.height + 10;

      buttonizeDisplayObject(rowClickBox, () => this.toggleRowExpandedContent(Number(rowIndex)));

      rowContainer.addChild(rowClickBox);

      /// GRS Action column
      const status = rowData[rowIndex].status;
      if (status == null) {
        // TODO: Once the submit button is clicked, need to remove button as child and add new text
        const gRSActionLabel = this.makeSubmitButton(rowData[rowIndex]);
        gRSActionLabel.position.set(rowXCoordinates[2] - 8, startY - 10);
        rowContainer.addChild(gRSActionLabel);
      } else {
        const [text, style] = statusToDisplayProperties[status];
        const gRSActionLabel = new Text(text, { ...commonLabelStyle, fontSize, ...style });
        gRSActionLabel.position.set(rowXCoordinates[2], startY);
        rowContainer.addChild(gRSActionLabel);
      }

      /// Row Underline
      const graphics = new Graphics()
        .lineStyle(1.5, 0x777777, 0.3)
        .moveTo(trainLabel.x - 25, startY + 24)
        .lineTo(rowXCoordinates[2] + 140, startY + 24);

      rowContainer.addChild(graphics);

      this.content.addChild(rowContainer);
      startY += trainLabel.height + 20;

      await nextFrame();
      this.update();
    }
    this.content.addChild(this.addInvisibleBox(426));
    this.update();
  }

  addExpandedPage(cardAssetIds: CardAssetId[], y: number): Container {
    const spinner = GameSingletons.getSpinner();
    const userData = GameSingletons.getDataHolders().userData;
    const container = new Container();

    async function loadCardEntities() {
      const cards = new Array<CardEntity>();
      for (const id of cardAssetIds) {
        try {
          // const card = userData.cards.get(id);
          const card = userData.cards.get(id) || (await CardEntity.fromAssetId(id));
          if (!card) throw new Error(`Card not found: ${id}`);
          cards.push(card);
        } catch (error) {
          console.warn(error);
          continue;
        }
      }
      return cards;
    }

    spinner.showDuring(loadCardEntities()).then(cards => {
      const carousel = this.createCardList(cards, { x: 85, y, width: 360, height: 205 });
      container.addChild(carousel);
    });

    return container;
  }

  makeSubmitButton({ transactionId }: MyGoldenRunSubmissionData) {
    // TODO: Once the submit button is clicked, need to remove button as child and add new text

    const button = new DashboardButton("ui-common/btn-green.png", "SUBMIT", 125, 32);

    buttonizeDisplayObject(button, () => this.onSubmitClick?.(transactionId));

    return button;
  }

  addInvisibleBox(px: number, debug = false) {
    if (debug) {
      const box = new Sprite(Texture.WHITE);
      box.width = this.boxWidth + 1;
      box.height = px;
      box.tint = 0xffffff;
      box.alpha = 0.5;
      return box;
    } else {
      const box = new Sprite(Texture.EMPTY);
      box.width = this.boxWidth + 1;
      box.height = px;
      return box;
    }
  }

  clearData() {
    const children = [...this.content.children];
    for (const child of children) {
      /**
       * The only exception is the invisible box, which we
       * don't want to destroy.
       */
      child.destroy({ children: true });
    }
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

  private createCardList(cards: CardEntity[], cardListArea: { x: number; y: number; width: number; height: number }) {
    const cardList = new SimpleCardsCarousel(cards, cardListArea.width, cardListArea.height, 9);
    cardList.position.copyFrom(cardListArea);
    cardList.events.on({
      scrollIndexChange: () => {
        console.log("--- Scrolling Cards ---");
      },
    });
    return cardList;
  }

  private async scrollToRow(rowIndex: number) {
    const row = this.tableRows[rowIndex];

    await this.tweeener.to(this, {
      scrollTop: row.y,
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

    const newExpandedPage = this.cachedExpandedPages[row.index](); // Opting to lazy load here due to poor loading performance

    if (!newExpandedPage) {
      return console.error("No cached page found");
    }

    this.currentExpandedPage = newExpandedPage;

    console.log({ page: this.currentExpandedPage });

    row.setExpandedState(true);

    this.scrollToRow(index);

    row.addChild(newExpandedPage);
    await this.moveDown(newExpandedPage);
  }

  private async closeExpandedContent(index: number) {
    const prevExpandedPage = this.currentExpandedPage;

    if (!prevExpandedPage) {
      return;
    }

    const row = this.tableRows[index];
    row.setExpandedState(false);
    this.currentExpandedPage = null;

    await this.moveUp(prevExpandedPage);
    row.removeChild(prevExpandedPage);
  }

  private async updateContentPositions() {
    let nextPositionY = 0;

    const tweens = this.tableRows.map(row => {
      const isExpanded = row.index === this.currentIndex;

      const tweeener = new TemporaryTweeener(row);
      const tween = tweeener.to(row, {
        y: nextPositionY,
        duration: EXPANSION_ANIMATION_DURATION,
        ease: EXPANSION_ANIMATION_EASE,
      });
      nextPositionY += isExpanded ? EXPANDED_CONTENT_HEIGHT : 0;
      return tween;
    });

    this.endOfListFiller.y = nextPositionY;

    await Promise.all(tweens);
  }
}
