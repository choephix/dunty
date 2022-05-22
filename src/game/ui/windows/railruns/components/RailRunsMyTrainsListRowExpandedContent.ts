import { __DEBUG_SETTINGS__ } from "@debug/__DEBUG_SETTINGS__";
import { __DEBUG__ } from "@debug/__DEBUG__";
import { GameSingletons } from "@game/app/GameSingletons";
import { getLocomotiveCardAttributes } from "@game/asorted/data/getLocomotiveCardAttributes";
import { CardType } from "@game/constants/CardType";
import { FontFamily } from "@game/constants/FontFamily";
import { Rarity } from "@game/constants/Rarity";
import { TrainEntity } from "@game/data/entities/TrainEntity";
import { CardSprite } from "@game/ui/cards/CardSprite";
import { LocoBoostJar } from "@game/ui/components/LocoBoostJar";
import { SimpleCardsCarousel } from "@game/ui/components/SimpleCardsCarousel";
import { GlowFilterService } from "@game/ui/fx/GlowFilterService";
import { RailRunsMyTrainsLocoCardPlate } from "@game/ui/windows/railruns/components/RailRunsMyTrainsLocoCardPlate";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { formatToMaxDecimals } from "@sdk-ui/utils/formatToMaxDecimals";
import { CallbackList } from "@sdk/utils/callbacks/CallbackList";

const COLORS_BY_RARITY: Record<Rarity, { tint: number }> = {
  [Rarity.Common]: { tint: 0x6f4f32 },
  [Rarity.Uncommon]: { tint: 0x1d7a45 },
  [Rarity.Rare]: { tint: 0x32871 },
  [Rarity.Epic]: { tint: 0x2c0f54 },
  [Rarity.Legendary]: { tint: 0xc69b05 },
  [Rarity.Mythic]: { tint: 0x8f0404 },
};

const commodityCardsArea = {
  x: 1140,
  y: 0,
  width: 600,
  height: 360,
};

type TrainSpecsBarColumn = { header: string; value: string | number; tooltip?: string; glow?: boolean };

export class RailRunsMyTrainsListRowExpandedContent extends Container {
  private readonly selectedRailCarCardContainer = new Container();
  private readonly commodityCardsContainer = new Container();

  private readonly onRailCarSelected = new CallbackList<(index: number) => void>();
  private readonly jars = new Map<LocoBoostJar, { base: number; boost: number; total: number }>();
  private readonly context = GameSingletons.getGameContext();
  constructor(private readonly train: TrainEntity) {
    super();

    this.addSpecsBar();

    //add buttons
    const clearBtn = new Sprite(this.context.assets.getTexture("ui-railruns-window/btn-clear-expanded-row.png"));
    clearBtn.position.set(1800, 475);
    buttonizeDisplayObject(clearBtn, () => this.context.input.dispatch("clearAndVerifyTrain", this.train));
    this.addChild(clearBtn);

    this.context.main.hud.tooltips.registerTarget(clearBtn, "Clear and verify train");

    const locateBtn = new Sprite(this.context.assets.getTexture("ui-railruns-window/btn-locator-expanded-row.png"));
    locateBtn.position.set(1800, 345);
    buttonizeDisplayObject(locateBtn, () => this.locateTrain());
    this.addChild(locateBtn);

    this.context.main.hud.tooltips.registerTarget(locateBtn, "Locate train on the map");

    const editBtn = new Sprite(this.context.assets.getTexture("ui-railruns-window/btn-edit-train.png"));
    editBtn.position.set(1800, 410);
    buttonizeDisplayObject(editBtn, () => this.gotoEditTrainView());
    this.addChild(editBtn);

    this.context.main.hud.tooltips.registerTarget(editBtn, "Edit this train");

    //// Add pad bg
    const pad = new RailRunsMyTrainsLocoCardPlate();
    pad.position.set(-65, 0);
    this.addChild(pad);

    //locomotive card
    if (train.locomotive) {
      {
        const attributes = getLocomotiveCardAttributes(train.locomotive);
        for (const [index, [attributeName, attributeStats]] of Object.entries(attributes).entries()) {
          if (typeof attributeStats === "boolean") continue;

          const jar = LocoBoostJar.createSidewaysJar(attributeName);
          jar.position.set(45, -30 + index * 80);
          jar.scale.set(0.6);
          this.addChild(jar);
          this.jars.set(jar, attributeStats);
        }
      }

      const locomotive = new CardSprite(train.locomotive, true);
      locomotive.scale.set(0.5);
      locomotive.position.set(25, 0);

      this.addChild(locomotive);
    }

    //conductor card
    if (train.conductor) {
      const conductor = new CardSprite(train.conductor, true);
      conductor.scale.set(0.5);
      conductor.position.set(330, 0);
      this.addChild(conductor);
    }

    //rail cars
    const railCarsRarities = train.railCars.map(railCar => Rarity.fromNumberFromOne(railCar.rarity));
    const cars = this.addRailCarButtons(railCarsRarities);
    this.addChild(cars);

    this.addChild(this.selectedRailCarCardContainer);

    this.addChild(this.commodityCardsContainer);
    this.commodityCardsContainer.position.set(commodityCardsArea.x, commodityCardsArea.y);

    return this;
  }

  addSpecsBar() {
    //// ADD SPECS BAR BACKGROUND

    const bg = new Sprite(this.context.assets.getTexture("ui-railruns-window/footer-bg-expanded-row.png"));
    bg.y = 400;
    this.addChild(bg);

    //// ADD SPECS BAR CONTENT

    const buildHintString = (components: [string, any][]) => {
      return components
        .filter(([_, v]) => v > 0)
        .map(([source, value]) => `${formatToMaxDecimals(value, 1)} (${source})`)
        .join(` + `);
    };

    const specs = this.train.getSpecs();

    const specValuesArray: TrainSpecsBarColumn[] = [
      {
        header: "MAX DISTANCE",
        value: formatToMaxDecimals(specs.maxDistance.total, 1),
        glow: specs.maxDistance.locomotiveBoost > 0,
        tooltip: buildHintString([
          [`Loco Base`, specs.maxDistance.locomotiveBase],
          [`Loco Boost`, specs.maxDistance.locomotiveBoost],
        ]),
      },
      {
        header: "HAULING POWER",
        //// We're using MAX WEIGHT here for the user's comforts,
        //// since at least as of writing this, it's just X10 the HP anyway.
        value: formatToMaxDecimals(specs.maxWeight.total, 1),
        glow: specs.haulingPower.locomotiveBoost > 0,
        tooltip: buildHintString([
          [`Loco Base`, specs.haulingPower.locomotiveBase],
          [`Loco Boost`, specs.haulingPower.locomotiveBoost],
          [`Conductor Perk`, specs.haulingPower.conductorBoost],
        ]),
      },
      {
        header: "SPEED",
        value: formatToMaxDecimals(specs.speed.total, 1),
        glow: specs.speed.locomotiveBoost > 0,
        tooltip: buildHintString([
          [`Loco Base`, specs.speed.locomotiveBase],
          [`Loco Boost`, specs.speed.locomotiveBoost],
          [`Conductor Perk`, specs.speed.conductorBoost],
        ]),
      },
      {
        header: "LUCK",
        value: formatToMaxDecimals(specs.luck.total, 1) + "%",
        glow: specs.luck.locomotiveBoost > 0,
        tooltip: buildHintString([
          [`Global Base`, specs.luck.globalBase],
          [`Loco Boost`, specs.luck.locomotiveBoost],
          [`Conductor Perk`, specs.luck.conductorBoost],
        ]),
      },
      {
        header: "HAUL WEIGHT",
        value: this.train.currentTotalWeight.toString(),
        glow: false,
      },
    ];
    const specsRow = this.addSpecsRow(specValuesArray);
    this.addChild(specsRow);
  }

  addSpecsRow(dataArr: TrainSpecsBarColumn[]) {
    const container = new Container();
    let startX = 275;

    const glowService = new GlowFilterService({
      color: 0x1090ff,
      distance: 8,
      outerStrength: 5,
      quality: 1,
    });

    for (const { header, value, tooltip, glow } of dataArr) {
      const textHeader = new Text(header, {
        fill: 0xffffff,
        fontFamily: FontFamily.Default,
        fontSize: 26,
      });
      textHeader.anchor.set(0.5);
      textHeader.x = startX;
      textHeader.y = 450;
      this.addChild(textHeader);

      const text = new Text(String(value), {
        fill: 0xffffff,
        fontFamily: FontFamily.Default,
        fontSize: 26,
      });
      text.anchor.set(0.5);
      text.x = startX;
      text.y = 500;
      container.addChild(text);

      if (glow) {
        glowService.addFilter(text);
      }

      if (tooltip) {
        this.context.main.hud.tooltips.registerTarget(text, tooltip);
      }

      startX += 300;
    }
    return container;
  }

  addRailCarButtons(rarities: Array<Rarity>) {
    const unlockedSlotsCount = this.train.extraSlots.rc + 1;

    const container = new Container();
    let startX = 605;
    let startY = 10;
    for (let i = 0; i < 8; i++) {
      const rarity = rarities[i];
      const icon = this.addRailCarButtonIcon(rarity);
      icon.position.set(startX, startY);
      container.addChild(icon);
      startY += icon.height * 1.25;
      if (startY == icon.height * 1.25 * 4 + 10) {
        startX += icon.width * 1.25;
        startY = 10;
      }

      if (rarity) {
        buttonizeDisplayObject(icon, () => this.selectRailCarIndex(i));
      }

      if (i === 0) {
        const goldenRunIndicator = new Sprite(this.context.assets.getTexture("golden-badge-lg.png"));
        goldenRunIndicator.anchor.set(0.5);
        goldenRunIndicator.scale.set(0.25);
        goldenRunIndicator.position.set(icon.x + 7, icon.y + 7);
        container.addChild(goldenRunIndicator);
      }

      this.onRailCarSelected.add(selectionIndex => {
        icon.highlight.visible = i === selectionIndex;
      });

      if (unlockedSlotsCount <= i) {
        icon.alpha = 0.4;
      }
    }
    this.selectRailCarIndex(0);
    return container;
  }

  addRailCarButtonIcon(type: Rarity) {
    const container = new Container();
    container.interactive = true;
    const bg = new Sprite(this.context.assets.getTexture("ui-railruns-window/rc-slot-multply.png"));
    const frame = new Sprite(this.context.assets.getTexture("ui-railruns-window/rc-slot-frame.png"));
    if (type) {
      bg.tint = COLORS_BY_RARITY[type].tint;
    } else {
      bg.tint = 0x000000;
    }
    container.addChild(bg);
    container.addChild(frame);
    const icon = new Sprite(this.context.assets.getTexture("ui-railruns-window/rc-slot-icon.png"));
    container.addChild(icon);
    icon.position.set(20, 22.5);

    const highlight = new Sprite(this.context.assets.getTexture("ui-railruns-window/rc-slot-selected.png"));
    highlight.position.set(-10, -10);
    highlight.visible = false;
    container.addChild(highlight);

    return Object.assign(container, { highlight });
  }

  selectRailCarIndex(index: number) {
    /**
     * Clear any previously added objects from the containers we'll be using
     */
    this.selectedRailCarCardContainer.removeChildren();
    this.commodityCardsContainer.removeChildren();

    const rcCard = this.train.railCars[index];
    if (!rcCard) {
      return;
    }

    this.onRailCarSelected.callAll(index);

    // Add RAIL CAR card
    {
      const rcCardSprite = new CardSprite(rcCard, true);
      rcCardSprite.scale.set(0.5);
      rcCardSprite.position.set(805, 0);
      this.selectedRailCarCardContainer.addChild(rcCardSprite);
    }

    // Add COMMODITY cards box
    {
      const { width, height } = commodityCardsArea;
      const commodityCards = [...this.train.iterateLoadedCommodities(rcCard)];

      if (__DEBUG__ && __DEBUG_SETTINGS__["Many-Cards"]) {
        const __fillerCards__ = this.context.userData.iterateAllCards(CardType.Loadable) as any;
        commodityCards.push(...__fillerCards__);
      }

      if (commodityCards.length > 0) {
        const commodityCardsBox = new SimpleCardsCarousel(commodityCards, width, height);
        this.commodityCardsContainer.addChild(commodityCardsBox);
      }
    }
  }

  async locateTrain() {
    await this.context.input.dispatch("locateOnMap", this.train);
  }

  async gotoEditTrainView() {
    const stations = this.context.mapData.stations;
    const station = stations.get(this.train.currentStationId!) || null;
    if (!station) {
      throw new Error(`Station ${this.train.currentStationId} not found`);
    }

    this.context.input.dispatch("closeRailRunsWindow");
    await this.context.ticker.delay(0.35);
    await this.context.world.moveViewportTo(this.train);
    await this.context.ticker.delay(0.15);
    this.context.input.dispatch("enterEditTrainView", this.train);
  }

  async afterShowAnimation() {
    const { ticker } = this.context;
    for (const [jar, attributeStats] of this.jars) {
      if (!attributeStats.boost) continue;
      await ticker.delay(0.11);
      jar.setImpactValue(attributeStats.boost);
    }
  }

  async beforeHideAnimation() {
    for (const [jar] of this.jars) {
      jar.setExpanded(false);
    }
  }
}
