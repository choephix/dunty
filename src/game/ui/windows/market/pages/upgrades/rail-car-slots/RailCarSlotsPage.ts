import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { FontIcon } from "@game/constants/FontIcon";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { TrainEntity } from "@game/data/entities/TrainEntity";
import { createValueAnimator_Counter } from "@game/ui/common/createValueAnimator_Counter";
import { Dropdown } from "@game/ui/components/Dropdown";
import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import * as WAX from "@sdk-integration/contracts";
import { TrainName } from "@sdk-integration/contracts";
import { MultiStateSprite } from "@sdk-pixi/display/MultiStateSprite";
import { buttonizeInstance } from "@sdk-ui/buttonize";
import { formatToMaxDecimals } from "@sdk-ui/utils/formatToMaxDecimals";
import { EventBus } from "@sdk/core/EventBus";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { range } from "@sdk/utils/range";
import { ReadonlyObjectDeep } from "type-fest/source/readonly-deep";
import { StaticComponentFactory } from "../../../components/StaticComponentFactory";

const ASSET_PREFIX = "ui-market-window/";

type UpgradesPane = ReturnType<RailCarSlotsPage["createUpgradesPane"]>;

export class RailCarSlotsPage extends EnchantedContainer {
  private readonly context: GameContext = GameSingletons.getGameContext();
  private readonly tweeener = new TemporaryTweeener(this);

  private pane!: UpgradesPane;
  private nextSlotCost: number;
  private maxRailCarsAllowed: number;
  private slotsBackground?: Sprite;

  private readonly dropdown: Dropdown;

  private selectedTrain: ReadonlyObjectDeep<TrainEntity>;

  constructor() {
    super();

    this.selectedTrain = [...this.context.userData.trains.values()][0];
    this.nextSlotCost = 2000;
    this.maxRailCarsAllowed = 1;

    const trainNames = [...this.context.userData.trains.keys()];

    this.dropdown = new Dropdown(
      trainNames.map(trainName => ({ value: trainName, text: `${FontIcon.LocoAlt}  ${trainName}` })),
      {
        // boxScale: 0.25,
        boxPadding: 21,
        labelPadding: [5, 5, 5, 15],
        horizontalAlignment: 0.0,
        width: 500,
        height: 100,
        labelStyle: {
          fontSize: 30,
        },
        optionsOffset: [0, -30],
        optionsStyle: {
          // boxScale: 0.25,
          horizontalAlignment: 0.0,
          boxPadding: 21,
          labelPadding: [5, 15],
          labelStyle: {
            fontSize: 30,
          },
        },
      }
    );
    this.dropdown.position.set(40, 170);
    this.dropdown.zIndex = 99;
    this.addChild(this.dropdown);

    const onTrainSelected = (trainName: TrainName) => {
      const train = this.context.userData.trains.get(trainName);
      if (!train) throw new Error("Train not found: " + trainName);
      this.selectedTrain = train;
      this.updateSlotStates();
      this.updateUpgradeCost();
    };

    this.dropdown.onOptionSelected = onTrainSelected;

    this.dropdown.playShowAnimation();
  }

  async loadAndInitialize() {
    const upgradePricesInfo = await this.context.contracts.market.greateUpgradePricesInformation();
    this.maxRailCarsAllowed = upgradePricesInfo.rc.limit + 1;

    this.pane = this.createUpgradesPane();
    this.pane.scale.set(0.88);
    this.pane.position.set(36, 270);
    this.pane.events.on(this.addEventHandling());

    this.updateSlotStates();
    this.updateUpgradeCost();

    this.sortChildren();
  }

  private createUpgradesPane() {
    const events = new EventBus<{
      clickSlot: (index: number) => void;
    }>();

    this.slotsBackground = this.context.assets.makeSprite(ASSET_PREFIX + "rc-slot-bg.png");
    this.slotsBackground.name = "slotsBackground";
    this.addChild(this.slotsBackground);

    const titleBox = this.context.assets.makeSprite(ASSET_PREFIX + "Large RC Box - Left.png");
    titleBox.name = "titleBox";
    titleBox.position.set(53, 40);
    this.slotsBackground.addChild(titleBox);

    const slotStateTextures = {
      available: this.context.assets.getTexture(ASSET_PREFIX + "slot-available.png"),
      equipped: this.context.assets.getTexture(ASSET_PREFIX + "slot-equipped.png"),
      outline: this.context.assets.getTexture(ASSET_PREFIX + "slot-outline.png"),
    };
    const slots = range(8).map(slotIndex => {
      const slot = new MultiStateSprite(slotStateTextures);
      slot.setStateKey("available");
      slot.anchor.set(0.5, 0.5);

      const highlight = this.context.assets.makeSprite(ASSET_PREFIX + "slot-selected.png");
      highlight.name = "glow";
      highlight.anchor.set(0.5, 0.5);
      highlight.visible = false;
      slot.addChild(highlight);

      const x = 730 + (slotIndex % 4) * 250;
      const y = slotIndex < 4 ? 140 : 370;
      slot.position.set(x, y);

      const slotButton = buttonizeInstance(slot, {
        name: `slot-${slotIndex}`,
        highlight,
        purchaseable: false,
      });
      slotButton.behavior.on({
        hoverIn: () => slotButton.purchaseable && (highlight.visible = true),
        hoverOut: () => slotButton.purchaseable && (highlight.visible = false),
        trigger: () => events.dispatch("clickSlot", slotIndex),
      });

      return slotButton;
    });
    this.slotsBackground.addChild(...slots);

    {
      const costDescriptionLabel = this.context.assets.makeSprite(ASSET_PREFIX + "Cost.png");
      costDescriptionLabel.name = "costDescriptionLabel";
      this.slotsBackground.addChild(costDescriptionLabel);

      const costIconTexture = Texture.from(ASSET_PREFIX + "tocium-sm.png");
      const costIcon = new Sprite(costIconTexture);
      costIcon.anchor.set(0.5);
      costIcon.scale.set(0.6);
      this.slotsBackground.addChild(costIcon);

      const costOnScreen = createValueAnimator_Counter(() => this.nextSlotCost);
      costOnScreen.animationDuration = 0.45;
      const costValueLabel = StaticComponentFactory.createLabel({
        fontSize: 36,
        anchor: [1.0, 0.5],
        getText: () => formatToMaxDecimals(Math.round(costOnScreen.valueOnScreen), 4, true),
        getDangerState: () => costOnScreen.valueOnScreen > this.context.userData.tocium,
      });
      this.slotsBackground.addChild(costValueLabel);

      costIcon.position.set(1770, 320);
      costValueLabel.position.set(1925, 320);

      costDescriptionLabel.name = "costDescriptionLabel";
      costDescriptionLabel.position.set(1760, 150);
      this.slotsBackground.addChild(costDescriptionLabel);
    }

    return Object.assign(this.slotsBackground, {
      slots,
      events,
    });
  }

  private updateSlotStates() {
    for (const [slotIndex, slot] of this.pane.slots.entries()) {
      slot.setStateKey(
        slotIndex <= this.selectedTrain.extraSlots.rc || 0
          ? "equipped"
          : slotIndex < this.maxRailCarsAllowed
          ? "available"
          : "outline"
      );
      slot.purchaseable = slotIndex === this.selectedTrain.extraSlots.rc + 1;
      slot.buttonMode = slot.purchaseable;
    }
  }

  private updateUpgradeCost() {
    this.nextSlotCost = this.context.contracts.market.calculateUpgradeSlotPrice(
      WAX.MarketTrainUpgradeType.RailCar,
      this.selectedTrain.extraSlots.rc
    );
  }

  private getNextSlotIndex(): number {
    return this.selectedTrain.extraSlots.rc + 1;
  }

  private addEventHandling() {
    const { contracts, modals, spinner, ticker, userDataCtrl, userData } = this.context;

    return {
      clickSlot: async (index: number) => {
        if (index < this.getNextSlotIndex()) {
          return await modals.warning(`You've already purchased this slot.`);
        }
        if (index > this.getNextSlotIndex()) {
          return await modals.warning(`You must purchase the previous slot(s) first.`);
        }

        const cost = this.nextSlotCost;
        if (cost > userData.tocium) {
          return await modals.warning(
            `You have ${FontIcon.Tocium}${userData.tocium} but this expansion slot costs ${FontIcon.Tocium}${cost}.`
          );
        }

        const choice = await modals.confirm({
          title: "Purchase Railcar Slot",
          content: `Are you sure you want to upgrade to ${index} extra slots?\nCost: ${formatToMaxDecimals(
            cost,
            4,
            true
          )} Tocium`,
        });
        if (!choice) return;

        /**
         * The train entity object will be recreated as a new instance once the user data updates,
         * so we save the name of the train, as an identifier to find the new instance of the selected train
         * a few lines down.
         */
        const trainName = this.selectedTrain.name;

        await spinner.showDuring(
          contracts.market.purchaseUpgrade(this.selectedTrain.name, WAX.MarketTrainUpgradeType.RailCar, index)
        );
        await spinner.showDuring(ticker.delay(0.5));
        await spinner.showDuring(userDataCtrl.updateAll());

        this.selectedTrain = userDataCtrl.userData.trains.get(trainName)!;
        this.updateSlotStates();
        this.updateUpgradeCost();
      },
    };
  }

  public async playShowAnimation() {
    const slotsBackground = await this.enchantments.waitUntil(() => this.slotsBackground);
    slotsBackground.children.forEach(child => (child.alpha = 0));

    await this.tweeener.from(slotsBackground, {
      pixi: {
        pivotX: -100,
        alpha: 0,
      },
      duration: 0.19,
      ease: "power2.in",
      stagger: 0.07,
    });

    await this.tweeener.fromTo(
      slotsBackground.children,
      {
        pixi: {
          // scale: 0,
          alpha: 0,
        },
      },
      {
        pixi: { scale: 1, alpha: 1 },
        stagger: 0.04,
        duration: 0.71,
        ease: "power2.out",
      }
    );
  }

  public async playHideAnimation() {
    if (!this.slotsBackground) return;
    await this.tweeener.to([this.slotsBackground, this.dropdown], {
      pixi: {
        pivotX: -100,
        alpha: 0,
      },
      duration: 0.19,
      ease: "power2.in",
      stagger: 0.07,
    });
  }
}
