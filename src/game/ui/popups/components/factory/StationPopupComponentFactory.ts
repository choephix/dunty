import { GameSingletons } from "@game/app/GameSingletons";
import { CardType } from "@game/constants/CardType";
import { FontFamily } from "@game/constants/FontFamily";
import { Rarity } from "@game/constants/Rarity";
import { CardEntity } from "@game/data/entities/CardEntity";
import { StationEntity } from "@game/data/entities/StationEntity";
import { TrainEntity } from "@game/data/entities/TrainEntity";
import { createValueAnimator_OutInViaTimeline } from "@game/ui/common/createValueAnimator_OutInViaTimeline";
import { VerticalListOfObjects } from "@game/ui/common/VerticalListOfObjects";
import { createXButton } from "@game/ui/components/createXButton";
import { calculateCommodityRateHighlightLevel } from "@game/ui/formatters/calculateCommodityRateHighlightLevel";
import { formatCommodityRate } from "@game/ui/formatters/formatCommodityRate";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { ITextStyle, Text } from "@pixi/text";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { buttonizeInstance } from "@sdk-ui/buttonize";
import { formatToMaxDecimals } from "@sdk-ui/utils/formatToMaxDecimals";
import { IPoint, valueOrGetter } from "@sdk/core/common.types";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { Color } from "@sdk/utils/color/Color";
import { ReadonlyDeep } from "type-fest";
import { ReadonlyObjectDeep } from "type-fest/source/readonly-deep";
import { StationPopup } from "../../bases/StationPopup";
import { CardsInfoScrollBox } from "../CardsInfoScrollBox";
import { CommodityRateIconsRow } from "../CommodityRateIconsRow";
import { RailCarStatBox } from "../RailCarStatBox";

const commonLabelStyle = {
  fontSize: 26,
  fill: "#FFFFFF",
  stroke: "#080808",
  strokeThickness: 3,
  fontFamily: FontFamily.Default,
};

const titlePadding = 52;

const BOTTOM_BUTTON_PROPERTIES = {
  left: ["ui-popups/btn-sm-left-modal.png", 25, [0.53, 0.5], 20] as const,
  right: ["ui-popups/btn-sm-right-modal.png", 146, [0.47, 0.5], 20] as const,
  fill: ["ui-popups/btn-lg-modal.png", 25, [0.5, 0.5], 30] as const,
};

const COLORS_BY_RARITY: Record<Rarity, { iconTint: number; btnTint: number }> = {
  [Rarity.Common]: { iconTint: 0xd7f6f9, btnTint: 0x6f4f32 },
  [Rarity.Uncommon]: { iconTint: 0xf2deac, btnTint: 0x1d7a45 },
  [Rarity.Rare]: { iconTint: 0xf9be75, btnTint: 0x32871 },
  [Rarity.Epic]: { iconTint: 0xf8f7c3, btnTint: 0x2c0f54 },
  [Rarity.Legendary]: { iconTint: 0xffffff, btnTint: 0xc69b05 },
  [Rarity.Mythic]: { iconTint: 0xffd793, btnTint: 0x8f0404 },
};

export class StationPopupComponentFactory {
  protected readonly context = GameSingletons.getGameContext();

  constructor(protected readonly popup: StationPopup) {}

  createFloatyTitle(titleText: string, padWidth: number) {
    const SCALEFACTOR = 1.0;
    const SCALE = 1 / SCALEFACTOR;
    const maxWidth = (padWidth - titlePadding) * SCALEFACTOR;
    const titleStyle = {
      ...commonLabelStyle,
      fontSize: 20 * SCALEFACTOR,
      strokeThickness: 2 * SCALEFACTOR,
      wordWrapWidth: maxWidth,
      wordWrap: true,
    } as Partial<ITextStyle>;
    const title = new Text(titleText.toUpperCase(), titleStyle);
    title.anchor.set(0.5, 1.0);
    title.position.set(0.5 * padWidth, -10);
    title.scale.set(Math.min(SCALE, (SCALE * maxWidth) / title.width));

    // title.text = lipsum.line().toUpperCase();

    return title;
  }

  createFloatyFooter(titleText: string, padWidth: number, onClick?: () => void) {
    const maxWidth = padWidth - titlePadding;
    const style = {
      ...commonLabelStyle,
      fontSize: 13,
      strokeThickness: 2,
      wordWrapWidth: maxWidth,
      wordWrap: true,
      lineJoin: "bevel",
    } as Partial<ITextStyle>;
    const label = new Text(titleText.toUpperCase(), style);
    label.anchor.set(0.5, 1.0);
    label.position.set(0.5 * padWidth, this.popup.padHeight + 32);
    label.scale.set(Math.min(1, maxWidth / label.width));

    if (onClick) {
      const buttonized = buttonizeInstance(label);
      buttonized.behavior.on({
        down: () => (label.style.fill = 0x009090),
        up: () => (label.style.fill = 0x00ffe3),
        hoverIn: () => (label.style.fill = 0x00ffe3),
        hoverOut: () => (label.style.fill = 0xffffff),
        trigger: onClick,
      });
    }

    return label;
  }

  createTitle(titleText: string, padWidth: number) {
    const SCALEFACTOR = 2.0;
    const SCALE = 1 / SCALEFACTOR;
    const maxWidth = (padWidth - titlePadding) * SCALEFACTOR;
    const titleStyle = {
      ...commonLabelStyle,
      fontSize: 26 * SCALEFACTOR,
      dropShadow: true,
      dropShadowAngle: 1.57079632679,
      dropShadowColor: 0x010101,
      dropShadowDistance: 4,
      dropShadowAlpha: 0.75,
      wordWrapWidth: maxWidth,
      wordWrap: true,
    } as Partial<ITextStyle>;
    const title = new Text(titleText.toUpperCase(), titleStyle);
    title.anchor.set(0.0, 1.0);
    title.position.set(26, 138);
    title.scale.set(Math.min(SCALE, (SCALE * maxWidth) / title.width));

    // title.text = lipsum.line().toUpperCase();

    return title;
  }

  createLabel(
    labelText: string,
    padWidth: number,
    {
      style = {} as Partial<ITextStyle>,
      position = { x: 0, y: 0 } as IPoint,
      anchor = { x: 0, y: 0 } as IPoint,
      scaleFactor = 1.0,
      disabled = false,
      padding = 52,
    } = {},
    toUpperCase = true
  ) {
    if (toUpperCase) {
      labelText = labelText.toUpperCase();
    }
    const scale = 1 / scaleFactor;
    const maxWidth = (padWidth - padding) * scaleFactor;
    const labelStyle = {
      ...commonLabelStyle,
      wordWrapWidth: maxWidth,
      wordWrap: true,
      ...style,
    } as Partial<ITextStyle>;
    labelStyle.fontSize = +(labelStyle.fontSize || commonLabelStyle.fontSize) * scaleFactor;
    const label = new Text(labelText, labelStyle);
    label.anchor.copyFrom(anchor);
    label.position.copyFrom(position);
    label.scale.set(Math.min(scale, (scale * maxWidth) / label.width));
    label.alpha = disabled ? 0.4 : 1.0;

    // label.text = lipsum.line().toUpperCase();

    return label;
  }

  createDelimiter(
    width: number,
    { position = { x: 0, y: 0 } as IPoint, marginX = 8, thickness = 3, alpha = 1.0, color = 0x0 } = {}
  ) {
    const delimiter = new Sprite(Texture.WHITE);
    delimiter.width = width - marginX - marginX;
    delimiter.height = thickness;
    delimiter.position.set(position.x + marginX, position.y);
    delimiter.alpha = alpha;
    delimiter.tint = color;

    return delimiter;
  }

  createBottomButton(type: keyof typeof BOTTOM_BUTTON_PROPERTIES, labelText: string, yFromBottom: number = 61) {
    const [buttonTextureName, positionX, labelPositionFrac, fontSize] = BOTTOM_BUTTON_PROPERTIES[type];
    const buttonTexture = Texture.from(buttonTextureName);
    const pad = new Sprite(buttonTexture);
    pad.scale.set(0.5);
    pad.position.set(positionX, this.popup.padHeight - yFromBottom);

    const labelStyle = {
      ...commonLabelStyle,
      fontSize,
      strokeThickness: 1,
    } as Partial<ITextStyle>;
    const label = new Text(labelText.toUpperCase(), labelStyle);
    label.anchor.set(0.5, 0.5);
    label.position.set(labelPositionFrac[0] * buttonTexture.width, labelPositionFrac[1] * buttonTexture.height);
    pad.addChild(label);

    const methods = {
      setEnabled: (enabled: boolean) => {
        if (enabled) {
          pad.interactive = true;
          pad.buttonMode = true;
        } else {
          label.alpha = 0.27;
        }
      },
      onClick: () => console.warn("onClick not set"),
    };

    const button = Object.assign(pad, methods, { label });

    const labelOrigin = label.position.clone();
    function setButtonState(down: boolean) {
      pad.tint = down ? 0xc0c0c0 : 0xffffff;
      label.alpha = down ? 0.5 : 1.0;
      label.y = down ? labelOrigin.y + 3 : labelOrigin.y;
    }
    setButtonState(false);

    pad.on("pointerdown", () => this.context.sfx.play("clickRegularDown"));
    pad.on("pointerup", () => this.context.sfx.play("clickRegularUp"));

    buttonizeDisplayObject(pad, () => button.onClick?.());
    pad.on("pointerdown", () => setButtonState(true));
    pad.on("pointerup", () => setButtonState(false));
    pad.on("pointerout", () => setButtonState(false));
    pad.on("pointerupoutside", () => setButtonState(false));

    return button;
  }

  createInfoRibbon(
    labelText: Readonly<string | [string, string]>,
    padTextureId:
      | `ui-popups/idle-first-click-footer-bg.png`
      | `ui-popups/bg-lvl2-info.png`
      | `ui-popups/bg-lvl1-btm-info.png` = "ui-popups/bg-lvl2-info.png"
  ) {
    const container = new Container();

    const padding = 10;

    const updateText = (labelText: Readonly<string | [string, string]>, padScale = 0.6, color = 0xffffff) => {
      container.children.forEach(child => child.destroy());

      const padTexture = Texture.from(padTextureId);
      const pad = new Sprite(padTexture);
      pad.anchor.set(0.5, 0.5);
      pad.scale.set(padScale);
      container.addChild(pad);

      const addLabel = (text: string) => {
        const label = this.createLabel(text, pad.width, {
          style: {
            fontSize: 10,
            wordWrap: false,
            fill: color,
          },
          anchor: { x: 0.5, y: 0.5 },
          padding: 20,
          scaleFactor: 1.5,
        });
        label.y -= 1;
        container.addChild(label);
        return label;
      };

      if (typeof labelText === "string") {
        const label = addLabel(labelText);
        label.anchor.set(0.5, 0.5);
      } else {
        const [labelLeft, labelRight] = [addLabel(labelText[0]), addLabel(labelText[1])];

        labelLeft.anchor.set(0.0, 0.5);
        labelLeft.position.x = 0.5 * -pad.width + padding;

        labelRight.anchor.set(1, 0.5);
        labelRight.position.x = 0.5 * pad.width - padding;
      }
    };

    updateText(labelText);

    return Object.assign(container, { updateText });
  }

  createWarning(labelText: string) {
    const padTexture = Texture.WHITE;
    const pad = new Sprite(padTexture);
    pad.tint = 0x0;
    pad.alpha = 0.635;
    pad.width = this.popup.padWidth * 0.915;
    pad.height = 22;
    pad.anchor.set(0.5, 0.5);

    const label = this.createLabel(labelText, pad.width, {
      style: {
        fill: 0xff7373,
        fontSize: 15,
        fontWeight: "bolder",
        wordWrap: false,
      },
      anchor: { x: 0.5, y: 0.5 },
      padding: 20,
      scaleFactor: 1.5,
    });
    label.anchor.set(0.5, 0.5);

    const container = new Container();
    container.addChild(pad, label);
    container.position.x = 0.5 * this.popup.padWidth;

    return Object.assign(container, { pad, label });
  }

  addWarning_BackTracking() {
    const multiplier = formatToMaxDecimals(this.context.gameConfigData.backtrackingFuelCostMultiplier, 1);
    const labelText = `x${multiplier} Fuel (Backtracking)`;
    const label = this.createWarning(labelText);
    label.position.y = 85;
    return this.popup.addChild(label);
  }

  addTrainCardsInfoScrollBox(yFrom: number, yTo: number, train: ReadonlyDeep<TrainEntity>) {
    const { app, ticker } = this.context;

    const scrollboxMarginX = 35;
    const scrollboxPosition = [scrollboxMarginX, yFrom];
    const scrollboxSize = {
      width: this.popup.padWidth - scrollboxMarginX - scrollboxMarginX,
      height: yTo - scrollboxPosition[1],
    };
    const scrollbox = new CardsInfoScrollBox(this, scrollboxSize, app.view);
    scrollbox.position.set(...scrollboxPosition);
    this.popup.addChild(scrollbox);

    const getRailCarAndCommodityCards = () => {
      const cards = new Array<ReadonlyObjectDeep<CardEntity>>();
      for (const railCar of train.railCars) {
        cards.push(railCar);
        cards.push(...train.iterateLoadedCommodities(railCar));
      }
      return cards;
    };

    const cardGroups = [
      {
        type: CardType.Conductor,
        cards: train.conductors,
      },
      {
        type: CardType.Locomotive,
        cards: train.locomotives,
      },
      {
        type: CardType.Wagon,
        cards: getRailCarAndCommodityCards(),
      },
    ];
    scrollbox.addInvisibleBox(16);
    for (const { type, cards } of cardGroups) {
      if (cards && cards.length) {
        scrollbox.addHeading(CardType.stringify(type) + (cards.length > 1 ? "s" : ""));
        for (const card of cards || []) {
          if (!card) {
            console.error(`Empty card ref encountered, while constructing the cards info scrollbox.`, cardGroups);
            continue;
          }
          scrollbox.addCardInfoBlock(card);
        }
      }
    }
    scrollbox.addInvisibleBox(16);
    scrollbox.update();

    this.popup.onDestroy(() => scrollbox.destroy({ children: true }));
  }

  addTrainLoadoutScrollBox(yFrom: number, yTo: number) {
    const { app, ticker } = this.context;

    const scrollboxMarginX = 30;
    const scrollboxPosition = [scrollboxMarginX, yFrom];
    const scrollboxSize = {
      width: this.popup.padWidth - scrollboxMarginX - scrollboxMarginX,
      height: yTo - scrollboxPosition[1],
    };
    const scrollbox = new CardsInfoScrollBox(this, scrollboxSize, app.view);
    scrollbox.position.set(...scrollboxPosition);
    this.popup.addChild(scrollbox);

    const tweeener = new TemporaryTweeener(scrollbox);

    const updateContent = (train: ReadonlyDeep<TrainEntity> | null) => {
      scrollbox.clear();
      scrollbox.addInvisibleBox(1);

      if (train) {
        const railCars = train.railCars;

        if (railCars.length > 0) {
          if (railCars.length === 1) {
            const box = new RailCarStatBox();
            box.apply(train.getRailCarLoadStats(0), true);
            box.scale.set(0.5);
            scrollbox.addContentAtPosition(box, scrollboxSize.width * 0.5, (scrollboxSize.height - box.height) * 0.5);
            scrollbox.addSpacing(-100);
          } else if (railCars.length <= 4) {
            for (const [i, rc] of railCars.entries()) {
              const box = new RailCarStatBox();
              box.apply(train.getRailCarLoadStats(rc), i === 0);
              box.scale.set(0.31);
              const row = (i / 2) | 0;
              const side = i % 2 || -1;
              scrollbox.addContentAtPosition(box, scrollboxSize.width * (0.5 + side * 0.22), 13 + row * 110);
              scrollbox.addSpacing(-15);
            }
          } else {
            for (const [i, rc] of railCars.entries()) {
              const box = new RailCarStatBox();
              box.apply(train.getRailCarLoadStats(rc), i === 0);
              box.scale.set(0.28);
              const row = (i / 3) | 0;
              const side = (i % 3) - 1;
              scrollbox.addContentAtPosition(box, scrollboxSize.width * (0.5 + side * 0.32), 10 + row * 105);
              scrollbox.addSpacing(-20);
            }
          }
        }
      }

      scrollbox.update();
    };

    this.popup.onDestroy(() => scrollbox.destroy({ children: true }));

    return Object.assign(scrollbox, {
      updateContent,
      playShowAnimation() {
        return tweeener.from(scrollbox.content.children, {
          pixi: {
            alpha: 0,
            pivotY: 88,
          },
          duration: 0.38,
          ease: "back.out",
          stagger: 0.087,
        });
      },
    });
  }

  addCommodityRateIcons = (station: StationEntity) => {
    const x = 158;
    const y = 100;
    const commodityIconsCount = 5;
    const iconContainer = new CommodityRateIconsRow(station, commodityIconsCount);
    iconContainer.position.set(x, y);
    return this.popup.addChild(iconContainer);
  };

  // private createCommodityRateBit(icon: string, rateMultiplier: number, highlightLevel: number = 0) {}

  addCommodityRatesInfoBox(yFrom: number, yTo: number) {
    const { station } = this.popup;
    if (station == null) {
      throw new Error("Station data not set");
    }

    const popup = this.popup;
    const { app, ticker, animator } = this.context;

    const bestRateMultiplier = this.context.mapData.miscInfo.bestCommodityRateMultiplierEver;
    const commodityTypeRates = [...station.waxRRContractData.type_rates];

    const scrollboxMarginX = 35;
    const scrollboxPosition = [scrollboxMarginX, yFrom];
    const scrollboxSize = {
      width: popup.padWidth - scrollboxMarginX - scrollboxMarginX,
      height: yTo - scrollboxPosition[1],
    };
    const scrollbox = new CardsInfoScrollBox(this, scrollboxSize, app.view);
    scrollbox.position.set(...scrollboxPosition);
    popup.addChild(scrollbox);

    const commodityRateFieldPadTexture = Texture.from("ui-popups/bevel-md.png");
    const commodityRateFieldHighlightTexture = Texture.from("ui-popups/bevel-md-highlight.png");

    const FIELD_PAD_SCALE = 0.68;
    const COLUMNS = 2;
    const columnWidth = scrollbox.boxWidth / COLUMNS;
    const rowHeight = commodityRateFieldPadTexture.height * FIELD_PAD_SCALE + 2;
    for (const [i, { type: commodityName, multiplier: rateMultiplier }] of commodityTypeRates.entries()) {
      const lineIndex = Math.floor(i / 2);
      const columnIndex = i % COLUMNS;

      const x = (columnIndex + 0.5) * columnWidth;
      const y = 4 + (lineIndex + 0.5) * rowHeight;

      const pad = new Sprite(commodityRateFieldPadTexture);
      pad.position.set(x, y);
      pad.anchor.set(0.5, 0.5);
      pad.scale.set(FIELD_PAD_SCALE);
      scrollbox.content.addChild(pad);

      const highlightLevel = calculateCommodityRateHighlightLevel(rateMultiplier);
      const highlight = new Sprite(commodityRateFieldHighlightTexture);
      highlight.position.set(x, y);
      highlight.anchor.set(0.5, 0.5);
      highlight.scale.set(FIELD_PAD_SCALE);
      highlight.alpha = highlightLevel;
      scrollbox.content.addChild(highlight);

      const iconTextureName = `ui-icons/commodity/${commodityName}.png`;
      const iconTexture = Texture.from(iconTextureName);
      const icon = new Sprite(iconTexture);
      icon.position.set(x + 0.5 * (pad.height - pad.width) + 6, y);
      icon.anchor.set(0.5, 0.5);
      icon.scale.set((pad.height - 2) / Math.max(iconTexture.width, iconTexture.height));
      scrollbox.content.addChild(icon);

      const rateString = formatCommodityRate(rateMultiplier);
      const label = this.createLabel(rateString, pad.width, {
        style: {
          fontSize: 16,

          dropShadow: true,
          dropShadowBlur: 4,
          dropShadowAngle: 1.57079632679,
          dropShadowColor: 0x0c0c0c,
          dropShadowDistance: 2,
          dropShadowAlpha: 0.6,
        },
        position: { x: x + 0.5 * pad.width - 12, y },
        anchor: {
          x: 1.0,
          y: 0.6,
        },
        scaleFactor: 1.75,
      });
      scrollbox.content.addChild(label);

      this.context.main.hud.tooltips.registerTarget(pad, commodityName.replace(/_/g, " ").toUpperCase());
    }

    scrollbox.addInvisibleBox(4);
    scrollbox.update();

    popup.onDestroy(() => scrollbox.destroy({ children: true }));

    return Object.assign(scrollbox, {
      playShowAnimation() {
        const children = scrollbox.content.children;
        return popup.tweeener.from(children, {
          pixi: {
            scale: 0,
            alpha: 0,
          },
          duration: 0.1,
          ease: "power.in",
          stagger: 0.009,
        });
      },
    });
  }

  createStatsColumn() {
    const { app, ticker, animator } = this.context;
    const popup = this.popup;

    const DEFAULT_COLOR = Color.frozen(0xffffff);

    const container = new VerticalListOfObjects();
    container.scale.set(0.7);

    const tweeener = new TemporaryTweeener(container);

    type DynamicString = valueOrGetter<string | number | null>;
    type DynamicColor = valueOrGetter<Color>;
    type DynamicNumber = valueOrGetter<number>;

    function activateTextPoppingAnimation(target: Text, text: DynamicString) {
      if (typeof text === "function") {
        const cleanup = createValueAnimator_OutInViaTimeline(
          {
            howToApplyValue: (value: string | number | null) => {
              if (value == null) value = "";
              value = "" + value;
              target.text = value.toString();
            },
            howToShow: tl => {
              tl.to(target, {
                pixi: { scale: 1.0 },
                alpha: 1,
                duration: 0.21,
                ease: "power3.out",
              });
            },
            howToHide: tl => {
              tl.to(target, {
                pixi: { scale: 0.0 },
                alpha: 0,
                duration: 0.13,
                ease: "power1.out",
              });
            },
          },
          text()
        ).attachToGetter(text);
        popup.onDestroy(cleanup);
      } else {
        return (target.text = "" + (text || ""));
      }
    }

    function activateIconPoppingAnimation(target: Sprite, textureId: DynamicString): void {
      const SIZE = 40;
      const apply = (value: string | number | null) => {
        if (value != null && typeof value === "string") {
          target.texture = Texture.from(value.toString());
        } else {
          target.texture = Texture.EMPTY;
        }
        target.scale.set(SIZE / target.texture.height);
      };

      if (typeof textureId === "function") {
        const cleanup = createValueAnimator_OutInViaTimeline(
          {
            howToApplyValue: apply,
            howToShow: tl => {
              tl.to(target, {
                // pixi: { scale: originScale },
                alpha: 1,
                duration: 0.21,
                ease: "power3.out",
              });
            },
            howToHide: tl => {
              tl.to(target, {
                // pixi: { scale: 0.0 },
                alpha: 0,
                duration: 0.13,
                ease: "power1.out",
              });
            },
          },
          textureId()
        ).attachToGetter(textureId);
        popup.onDestroy(cleanup);
      } else {
        apply(textureId);
      }
    }

    function activateTextCounterAnimation(target: Text, number: DynamicNumber, format: (n: number) => string) {
      if (typeof number === "function") {
        const valueOnScreen = { current: number() };
        const cleanupAni = popup.enchantments.watch(
          () => valueOnScreen.current,
          value => (target.text = format(value)),
          true
        );
        popup.onDestroy(cleanupAni);
        const cleanupVal = popup.enchantments.watch(number, value =>
          animator.tween.to(valueOnScreen, {
            current: value,
            duration: 0.3,
            ease: "power3.out",
          })
        );
        popup.onDestroy(cleanupVal);
      } else {
        target.text = format(number);
      }
    }

    function activateTintAnimation(target: Text | Sprite, color: DynamicColor) {
      if (typeof color === "function") {
        const cleanup = createValueAnimator_OutInViaTimeline(
          {
            howToApplyValue:
              target instanceof Text
                ? (color: Color | null, tl) => {
                    color != null &&
                      tl.to(target.style, {
                        fill: color.toHex(),
                        duration: 0.36,
                        ease: "power3.out",
                      });
                  }
                : (color: Color | null, tl) => {
                    color != null &&
                      tl.to(target, {
                        pixi: { tint: color.toInt() },
                        duration: 0.5,
                        ease: "power3.out",
                      });
                  },
          },
          color()
        ).attachToGetter(color);
        popup.onDestroy(cleanup);
      } else {
        if (target instanceof Text) {
          target.style.fill = color?.toHex() || "#FFFFFF";
        } else {
          target.tint = color?.toInt() || 0xffffff;
        }
      }
    }

    return Object.assign(container, {
      appendIcon(textureName: string, color: DynamicColor = DEFAULT_COLOR, scale = 1) {
        const iconTexture = Texture.from(textureName);
        const icon = new Sprite(iconTexture);
        icon.anchor.set(0.5, 0.5);
        icon.scale.set((scale * 40) / icon.texture.height);
        activateTintAnimation(icon, color);
        container.append(icon);
      },

      appendPoppingIcon(textureName: DynamicString, color: DynamicColor = DEFAULT_COLOR, scale = 1) {
        const icon = new Sprite();
        icon.anchor.set(0.5, 0.5);
        // icon.scale.set((scale * 40) / icon.texture.height);
        activateIconPoppingAnimation(icon, textureName);
        activateTintAnimation(icon, color);
        container.append(icon);
      },

      appendSmallLabel(text: string, color: DynamicColor = DEFAULT_COLOR) {
        const label = new Text(text.toUpperCase(), {
          fontSize: 12,
          fontFamily: FontFamily.Default,
        });
        label.anchor.set(0.5, 0.5);
        activateTintAnimation(label, color);
        container.append(label, 7, -3);
      },

      appendBigHugeFontIcon(text: DynamicString, color: DynamicColor = DEFAULT_COLOR) {
        const label = new Text("", {
          fontSize: 36,
          fontFamily: FontFamily.Default,
          stroke: "#080808",
          strokeThickness: 3,
        });
        label.anchor.set(0.5, 0.5);
        activateTextPoppingAnimation(label, text);
        activateTintAnimation(label, color);
        container.append(label);
      },

      appendBigHugeNumber(
        number: DynamicNumber,
        color: DynamicColor = DEFAULT_COLOR,
        format: (n: number) => string = n => "" + n
      ) {
        const label = new Text("", {
          fontSize: 36,
          fontFamily: FontFamily.Default,
          stroke: "#080808",
          strokeThickness: 3,
        });
        label.anchor.set(0.5, 0.5);
        activateTextCounterAnimation(label, number, format);
        activateTintAnimation(label, color);
        container.append(label);
      },

      appendBigHugePoppingNumber(text: DynamicString, color: DynamicColor = DEFAULT_COLOR) {
        const label = new Text("", {
          fontSize: 36,
          fontFamily: FontFamily.Default,
          stroke: "#080808",
          strokeThickness: 3,
        });
        label.anchor.set(0.5, 0.5);
        activateTextPoppingAnimation(label, text);
        activateTintAnimation(label, color);
        container.append(label);
      },

      playShowAnimation() {
        return tweeener.from(container, {
          pixi: {
            scale: 0.5,
            alpha: 0,
            pivotY: 10,
          },
          duration: 0.51,
          ease: "power3.out",
        });
      },
    });
  }

  createStatsColumn_Static() {
    const DEFAULT_COLOR = Color.frozen(0xffffff);

    const container = new VerticalListOfObjects();
    container.scale.set(0.7);

    const tweeener = new TemporaryTweeener(container);

    return Object.assign(container, {
      appendIcon(textureName: string, color: Color = DEFAULT_COLOR, scale = 1) {
        const iconTexture = Texture.from(textureName);
        const icon = new Sprite(iconTexture);
        icon.anchor.set(0.5, 0.5);
        icon.scale.set((scale * 30) / icon.texture.height);
        icon.tint = color.toInt();
        container.append(icon);
      },

      appendSmallLabel(text: string, color: Color = DEFAULT_COLOR) {
        const label = new Text(text.toUpperCase(), {
          fontSize: 12,
          fontFamily: FontFamily.Default,
          fill: color.toHex(),
        });
        label.anchor.set(0.5, 0.5);
        container.append(label, 6, -2);
      },

      appendBigHugeNumber(number: number, color: Color = DEFAULT_COLOR) {
        const label = new Text(formatToMaxDecimals(number), {
          fontSize: 24,
          fontFamily: FontFamily.Default,
          fill: color.toHex(),
          stroke: "#080808",
          strokeThickness: 1,
        });
        label.scale.set(1.2);
        label.anchor.set(0.5, 0.5);
        container.append(label, -1, -1);
      },

      appendPlaceholderNA() {
        const label = new Text(`N/A`, {
          fontSize: 24,
          fontFamily: FontFamily.Default,
          fill: DEFAULT_COLOR.toHex(),
          stroke: "#080808",
          strokeThickness: 3,
        });
        label.anchor.set(0.5, 0.5);
        label.alpha = 0.25;
        container.append(label, -1, -1);
      },

      playShowAnimation() {
        return tweeener.from(container.children, {
          pixi: {
            scale: 0,
            alpha: 0,
          },
          duration: 0.19,
          ease: "back.out",
          stagger: 0.017,
        });
      },
    });
  }

  addXCloseButton() {
    const { sfx } = this.context;
    const popup = this.popup;

    const buttonTint = popup.station ? new Color(COLORS_BY_RARITY[popup.station.rarity].btnTint).toInt() : undefined;
    const button = createXButton(buttonTint);
    button.scale.set(0.55);
    button.position.set(button.width * 0.25);
    button.behavior.on({
      trigger: () => {
        popup.events.dispatch("onClick_Close");
      },
      down: () => {
        sfx.play("clickRegularDown");
      },
      up: () => {
        sfx.play("clickRegularUp");
      },
    });
    popup.addChild(button);

    return button;
  }
}
