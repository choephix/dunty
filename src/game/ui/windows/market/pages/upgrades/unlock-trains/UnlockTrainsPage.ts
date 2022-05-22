import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { tweenTintProperty } from "@game/asorted/animations/tweenTintProperty";
import { assureTrainNameValid } from "@game/asorted/assureTrainNameValid";
import { FontIcon } from "@game/constants/FontIcon";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { GlowFilterService } from "@game/ui/fx/GlowFilterService";
import { GreenButton } from "@game/ui/railroader-dash/panels/settings/components/GreenButton";
import { Container } from "@pixi/display";
import { Text } from "@pixi/text";
import { formatToMaxDecimals } from "@sdk-ui/utils/formatToMaxDecimals";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { UnlockTrainsDataService } from "./UnlockTrainsDataService";

export class UnlockTrainsPage extends EnchantedContainer {
  private readonly context: GameContext = GameSingletons.getGameContext();

  private readonly glowService = new GlowFilterService();
  private readonly dataService = new UnlockTrainsDataService();

  private cleared = true;

  private playCenterMessagePulseAnimation?: () => unknown;

  async loadAndInitialize() {
    this.cleared = false;

    const data = await this.dataService.getTrainsData();

    const costDelta = this.context.userData.tocium - data.nextTrainCost;
    const errorHint =
      data.missingExtraRailCarSlots > 0
        ? `You need ${data.missingExtraRailCarSlots} more extra rail car slots to unlock the next train.`
        : costDelta < 0
        ? `You need ${FontIcon.Tocium}${formatToMaxDecimals(Math.abs(costDelta))} before you can unlock the next train.`
        : null;

    const existingTrainSlot = this.createExistingTrainSlot();
    existingTrainSlot.position.set(100, 100);
    //// Add variable text
    this.setText(
      existingTrainSlot,
      data.trainName,
      data.totalRailruns,
      data.distanceTraveled,
      data.trainNumber + "",
      errorHint
    );
    this.addChild(existingTrainSlot);

    this.addUnlockedCars(existingTrainSlot, data.unlockedCars);

    const canUnlockNextTrain = !errorHint;
    const createNextTrainSlot = () =>
      canUnlockNextTrain ? this.createUnlockableTrainSlot() : this.createLockedTrainSlot();

    const nextTrainSlot = createNextTrainSlot();
    nextTrainSlot.position.set(80, 100);
    this.addChild(nextTrainSlot);

    this.addPriceAndUnlockButtonTo(data.nextTrainCost, canUnlockNextTrain, nextTrainSlot);
  }

  async purchaseNewTrain() {
    try {
      const trainName = await this.context.modals.unlockTrain();
      const trainNameValidated = assureTrainNameValid(trainName);
      const promise = Promise.all([this.dataService.unlockNextTrain(trainNameValidated), this.clear()]);
      await this.context.spinner.showDuring(promise);
      await this.context.spinner.showDuring(this.context.userDataCtrl.updateAll());
    } catch (error) {
      await this.context.modals.warning("" + error);
    } finally {
      if (this.cleared) {
        await this.loadAndInitialize();
        await this.playShowAnimation();
      }
    }
  }

  createExistingTrainSlot() {
    const container = new Container();
    //// Add background
    const bg = this.context.simpleFactory.createSprite("ui-market-window-unlock-trains/bg-unlocked-train.png");
    container.addChild(bg);
    //// Add badge
    const badge = this.context.simpleFactory.createSprite("ui-market-window-unlock-trains/badge-train-name.png", {
      x: 816.5,
    });
    badge.anchor.set(0.5);
    container.addChild(badge);
    //// Add train number slot
    const trainNumberSlot = this.context.simpleFactory.createSprite("ui-market-window-unlock-trains/Train Number.png", {
      x: -70,
      y: 35,
    });
    container.addChild(trainNumberSlot);
    //// Total railruns text
    const totalRailrunsText = this.context.simpleFactory.createText(
      "TOTAL RAILRUNS:",
      {
        fontSize: 32,
      },
      {
        x: 545.5,
        y: 150,
      }
    );
    container.addChild(totalRailrunsText);
    //// Total distance traveled text
    const distanceTraveledText = this.context.simpleFactory.createText(
      "DISTANCE TRAVELED:",
      {
        fontSize: 32,
      },
      {
        x: 545.5,
        y: 208,
      }
    );
    container.addChild(distanceTraveledText);
    return container;
  }

  createLockedTrainSlot() {
    const container = new Container();

    //// Add background
    const bg = this.context.simpleFactory.createSprite("ui-market-window-unlock-trains/bg-not-unlockable.png", {
      y: 450,
    });
    container.addChild(bg);

    //// Add left side car slots
    this.addCarSlots(100, 495, 0, container, 0.5);

    //// Add right side car slots
    this.addCarSlots(1200, 495, 0, container, 0.5);

    return container;
  }

  createUnlockableTrainSlot() {
    const container = new Container();

    //// Add background
    const bg = this.context.simpleFactory.createSprite("ui-market-window-unlock-trains/bg-not-unlockable.png", {
      y: 450,
    });
    container.addChild(bg);

    //// Add background glow
    const glow = this.context.simpleFactory.createSprite("ui-market-window-unlock-trains/bg-unlockable.png", {
      y: 450,
    });
    container.addChild(glow);

    //// Add left side car slots
    this.addCarSlots(100, 500, 1, container);

    //// Add right side car slots
    this.addCarSlots(1200, 500, 0, container);

    return container;
  }

  addPriceAndUnlockButtonTo(cost: number, canUnlock: boolean, container: Container) {
    //// Add tocium value
    const tociumCostText = this.context.simpleFactory.createText(
      `${FontIcon.Tocium} ` + formatToMaxDecimals(cost),
      {
        fontSize: 42,
      },
      {
        x: 841,
        y: 550,
      }
    );
    tociumCostText.anchor.set(0.5);
    container.addChild(tociumCostText);

    const button = new GreenButton(
      "UNLOCK ADDITIONAL TRAIN",
      async () => {
        if (canUnlock) {
          await this.purchaseNewTrain();
        } else {
          this.playCenterMessagePulseAnimation?.();
        }
      },
      500
    );
    button.position.set(591.5, 594);
    if (canUnlock) {
      this.glowService.addFilter(button);
    } else {
      button.alpha = 0.4;
    }
    container.addChild(button);
  }

  addUnlockedCars(parent: Container, unlockedCars: number) {
    const carNumbers1 = unlockedCars <= 4 ? unlockedCars : 4;
    const carNumbers2 = carNumbers1 == 4 ? unlockedCars - 4 : 0;

    //// Add left side car slots
    this.addCarSlots(100, 25, carNumbers1, parent);

    //// Add right side car slots
    this.addCarSlots(1200, 25, carNumbers2, parent);
  }

  //// Counting starts at 1, so if no cars are unlocked pass 0 to the unlocked parameter
  addCarSlots(x: number, y: number, unlocked: number, parent: Container, alpha: number = 1) {
    let startX = x;
    let startY = y;
    for (let i = 1; i < 5; i++) {
      let car;
      //// Check for unlocked cars
      if (i <= unlocked) {
        car = this.context.simpleFactory.createSprite("ui-market-window-unlock-trains/slot-purchased.png");
      } else {
        car = this.context.simpleFactory.createSprite("ui-market-window-unlock-trains/slot-unpurchased.png");
      }
      car.position.set(startX, startY);
      car.alpha = alpha;
      startY += car.height + 10;
      if (i % 2 == 0) {
        startX += car.width + 10;
        startY = y;
      }

      parent.addChild(car);
    }
  }

  setText(
    parent: Container,
    traiName: string,
    totalRailrunValue: string,
    distanceTraveledValue: string,
    trainNumber: string,
    hint: string | null
  ) {
    //// Add train name
    const trainNameText = this.context.simpleFactory.createText(
      traiName.toUpperCase(),
      {
        fontSize: 32,
      },
      {
        x: 816.5,
        y: 0,
      }
    );
    trainNameText.anchor.set(0.5);
    parent.addChild(trainNameText);
    this.resizeText(trainNameText, 542);

    //// Add total railruns value
    const totalRailrunsValueText = this.context.simpleFactory.createText(
      totalRailrunValue,
      {
        fontSize: 32,
      },
      {
        x: 1050,
        y: 150,
      }
    );
    totalRailrunsValueText.anchor.x = 1;
    parent.addChild(totalRailrunsValueText);

    //// Add distance traveled value
    const tdistanceTraveledValueText = this.context.simpleFactory.createText(
      distanceTraveledValue,
      {
        fontSize: 32,
      },
      {
        x: 1050,
        y: 208,
      }
    );
    tdistanceTraveledValueText.anchor.x = 1;
    parent.addChild(tdistanceTraveledValueText);

    //// Add train index
    const trainIndexText = this.context.simpleFactory.createText(
      trainNumber,
      {
        fontSize: 40,
      },
      {
        x: 0,
        y: 160,
      }
    );
    trainIndexText.anchor.set(0.5);
    parent.addChild(trainIndexText);

    //// Add coditional text
    if (hint) {
      const hintLabel = this.context.simpleFactory.createText(
        hint.toUpperCase(),
        {
          fontSize: 28,
        },
        {
          x: 816.5,
          y: 400,
        }
      );
      hintLabel.anchor.set(0.5);
      parent.addChild(hintLabel);

      this.playCenterMessagePulseAnimation = () => {
        hintLabel.tint = 0xff0000;
        return tweenTintProperty(hintLabel, 0xffffff);
      };
    }
  }

  resizeText(text: Text, maxWidth: number) {
    if (text.width > maxWidth) {
      text.scale.set(text.scale.x - 0.1);
      this.resizeText(text, maxWidth);
    }
  }

  async clear() {
    this.cleared = true;
    const children = [...this.children];
    await this.playHideAnimation();
    children.forEach(c => c.destroy());
  }

  public async playShowAnimation() {
    const tweeener = new TemporaryTweeener(this);
    this.children.forEach(c => (c.cacheAsBitmap = true));
    await tweeener.fromTo(
      this.children,
      {
        pixi: { pivotX: -50, alpha: 0 },
      },
      {
        pixi: { pivotX: 0, alpha: 1 },
        duration: 0.22,
        stagger: 0.1,
        ease: "power.in",
      }
    );
    this.children.forEach(c => (c.cacheAsBitmap = false));
  }

  public async playHideAnimation() {
    const tweeener = new TemporaryTweeener(this);
    this.children.forEach(c => (c.cacheAsBitmap = true));
    await tweeener.to(this.children, {
      pixi: { pivotX: -50, alpha: 0 },
      duration: 0.22,
      stagger: 0.1,
      ease: "power.in",
    });
    this.children.forEach(c => (c.cacheAsBitmap = false));
  }
}
