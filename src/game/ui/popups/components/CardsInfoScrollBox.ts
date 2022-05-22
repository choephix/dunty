import { destroyChildren } from "@game/asorted/destroyChildren";
import { FontFamily } from "@game/constants/FontFamily";
import { CardEntity } from "@game/data/entities/CardEntity";
import { CardSprite } from "@game/ui/cards/CardSprite";
import { Renderer, Texture } from "@pixi/core";
import { Container, DisplayObject } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { IDimensions } from "@sdk/core/common.types";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { SafeScrollbox } from "@sdk-pixi/display/SafeScrollbox";

import { StationPopupComponentFactory } from "./factory/StationPopupComponentFactory";

export class CardsInfoScrollBox extends SafeScrollbox {
  public readonly tweeener = new TemporaryTweeener(this);

  static readonly SHADE_TEXTURE = Texture.from(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAADBQTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWj8cCwAAABB0Uk5T//bq3My7qJR/a1dEMyMVCUWNcMYAAAA7SURBVHicNcHBAAAhAADBVUghhRRSSCGFFFJIIYVTOIUUUqjPNgNPEFEkkUURVTTRxRBTfOIXS2xxdAGVlT/BTZcr7gAAAABJRU5ErkJggg=="
  );

  static readonly SHADE_TEXTURE_TOP = Texture.from(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALYAAAAEBAMAAADR3NhJAAAAHlBMVEUVFRUAAAAAAAAAAAAAAAAAAAASEhIAAAAAAAAAAACRWY21AAAACnRSTlPrJEsbDgRpQR8XxOQ4WQAAACZJREFUGNNjCGOgFUhlcCxSog1QF2EIaRSkDZBwZQiZbEwbYOkKAH3FJuugSkw8AAAAAElFTkSuQmCC"
  );

  readonly shadeTop = this.addChild(new Sprite(CardsInfoScrollBox.SHADE_TEXTURE));
  readonly shadeBottom = this.addChild(new Sprite(CardsInfoScrollBox.SHADE_TEXTURE));

  private __scrollHeight = 0;

  constructor(
    private readonly componentFactory: StationPopupComponentFactory,
    { width, height }: IDimensions,
    divWheel: HTMLElement
  ) {
    super({
      boxWidth: width,
      boxHeight: height,
      stopPropagation: true,
      divWheel: divWheel,
      // divWheel: context.app.view,
      // ticker: context.ticker,
      scrollbarBackground: 0x0,
      scrollbarBackgroundAlpha: 0.25,
      scrollbarOffsetHorizontal: 7,
      scrollbarOffsetVertical: 7,
      scrollbarSize: 5,
      noTicker: true,
      overflowX: "none",
    });

    this.shadeTop.width = this.boxWidth;
    this.shadeTop.height = 4;
    this.shadeTop.alpha = 0.6;

    this.shadeBottom.scale.y = -1;
    this.shadeBottom.width = this.boxWidth;
    this.shadeBottom.height = 4;
    this.shadeBottom.y = this.boxHeight;
    this.shadeBottom.alpha = 0.6;
  }

  render(renderer: Renderer) {
    this.updateShadeLines();
    super.render(renderer);
  }

  private updateShadeLines() {
    try {
      this.shadeTop.visible = this.scrollTop > 0;
      this.shadeBottom.visible = this.scrollTop < this.scrollHeight - this.boxHeight;
    } catch (e) {
      console.error(e);
    }
  }

  addContentAtPosition(content: DisplayObject, x: number, y: number) {
    content.position.set(x, y);
    this.content.addChild(content);
    this.__scrollHeight = content.getBounds(true).bottom;
    return content;
  }

  addContentToBottom(content: DisplayObject, spacingBefore: number = 0, spacingAfter: number = 0) {
    content.y = this.__scrollHeight + spacingBefore;
    this.content.addChild(content);
    this.__scrollHeight = super.scrollHeight + spacingAfter;
    return content;
  }

  addInvisibleBox(px: number) {
    const box = new Sprite(Texture.EMPTY);
    box.width = this.boxWidth + 1;
    box.height = px;
    return this.addContentToBottom(box);
  }

  addSpacing(px: number) {
    this.__scrollHeight += px;
  }

  addHeading(headerText: string) {
    const headerLabel = this.componentFactory.createLabel(headerText, this.boxWidth, {
      style: {
        fontSize: 9,
        strokeThickness: 0,
      },
      position: {
        x: 8,
        y: 2,
      },
      scaleFactor: 1.0,
    });
    this.addContentToBottom(headerLabel);

    const delimiter = this.componentFactory.createDelimiter(this.boxWidth, {
      marginX: 8,
      color: 0xffffff,
      thickness: 1,
    });
    return this.addContentToBottom(delimiter, 2, 2);
  }

  addCardInfoBlock(card: CardEntity, width: number = this.boxWidth) {
    const container = new Container();

    function createCardStatsParagraph() {
      if (CardEntity.isTypeLocomotive(card)) {
        const stats = card.stats;
        const formatBoostable = (base: number, boost: number | undefined) => base + (boost ? ` (+${boost})` : "");
        return (
          `${card.title}` +
          `\nComposition: ${card.stats.composition}` +
          `\nFuel Type: ${card.stats.fuel}` +
          `\nHauling Power: ${formatBoostable(stats.hauling_power, stats.haul_boost)}` +
          `\nSpeed: ${formatBoostable(stats.speed, stats.speed_boost)}` +
          `\nMax Distance: ${formatBoostable(stats.distance, stats.distance_boost)}` +
          `\nConductor Threshold: ${card.stats.conductor_threshold}`
        );
      }
      if (CardEntity.isTypeConductor(card)) {
        const formatPerkBoost = (perk: string, boost: number | undefined) =>
          perk ? `Perk 1: ${perk}\n` + `Perk 1 Boost: ${boost}\n` : ``;
        return (
          `${card.title}\n` +
          `Conductor Level: ${card.stats.conductor_level}\n` +
          formatPerkBoost(card.stats.perk, card.stats.perk_boost) +
          formatPerkBoost(card.stats.perk2, card.stats.perk_boost2)
        );
      }
      if (CardEntity.isTypeCommodityWagon(card)) {
        return (
          `${card.title}\n` +
          `Capacity: ${card.stats.capacity}\n` +
          `size: ${card.stats.size}\n` +
          `type: ${card.stats.type}\n` +
          `Commodity Type 1: ${card.stats.commodity_type}\n` +
          `Commodity Type 2: ${card.stats.commodity_type2}\n`
        );
      }
      if (CardEntity.isTypeCommodityLoadable(card)) {
        return (
          `${card.title}\n` +
          `Type: ${card.stats.type}\n` +
          `Volume: ${card.stats.volume}\n` +
          `Weigth: ${card.stats.weight}\n`
        );
      }
      if (CardEntity.isTypePassengerWagon(card)) {
        return `${card.title}\n` + `Seats: ${card.stats.seats}\n` + `Weight: ${card.stats.weight}\n`;
      }
      if (CardEntity.isTypePassengerLoadable(card)) {
        return (
          `${card.title}\n` +
          // `Bio: ${card.stats.desc}\n` +
          `Region: ${card.stats.home_region}\n` +
          `Criterion: ${card.stats.criterion}\n` +
          `Tip: ${card.stats.tip}\n`
        );
      }
      throw new Error(`Unknown card type: ${card.type}`);
    }

    const infoText = createCardStatsParagraph();
    const infoLabel = this.componentFactory.createLabel(infoText.toUpperCase(), width, {
      style: {
        fontFamily: FontFamily.DefaultThin,
        fontSize: 9,
        strokeThickness: 0,
      },
      position: {
        x: 16,
        y: 0,
      },
      scaleFactor: 1.5,
    });
    container.addChild(infoLabel);

    const cardSprite = new CardSprite(card, true);
    cardSprite.width = 43;
    cardSprite.height = 63;
    cardSprite.x = width - cardSprite.width - 6;
    container.addChild(cardSprite);

    return this.addContentToBottom(container, 4, 4);
  }

  clear() {
    destroyChildren(this.content);
    this.__scrollHeight += 0;
  }

  // @ts-ignore
  // get scrollHeight() {
  //   return this.__scrollHeight;
  // }
}
