import { GameContext } from "@game/app/app";
import { FontFamily } from "@game/constants/FontFamily";
import { TextureId } from "@game/constants/paths/TextureId";
import { createValueAnimator_Counter } from "@game/ui/common/createValueAnimator_Counter";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Rectangle } from "@pixi/math";
import { NineSlicePlane } from "@pixi/mesh-extras";
import { Sprite } from "@pixi/sprite";
import * as WAX from "@sdk-integration/contracts";
import { FuelProductPriceInformation } from "@sdk-integration/contracts/WaxContractMarketService";
import { Buttonized, buttonizeInstance } from "@sdk-ui/buttonize";
import { formatToMaxDecimals } from "@sdk-ui/utils/formatToMaxDecimals";
import { CallbackList } from "@sdk/utils/callbacks/CallbackList";
import { clamp } from "@sdk/utils/math";
import { StaticComponentFactory } from "../../components/StaticComponentFactory";

const ASSET_PREFIX = "ui-market-window/";

export function makeItemCard(
  context: GameContext,
  productType: WAX.MarketFuelType,
  fuelPricesInfo: Record<WAX.MarketFuelType, FuelProductPriceInformation>
) {
  const { assets, contracts, animator, userData, userDataCtrl, spinner, modals } = context;

  const { price } = fuelPricesInfo[productType];

  const amount = {
    onChange: new CallbackList<(state: any) => unknown>(),
    options: [10, 20, 50, 100, 200, 500, 1_000, 2_000, 5_000, 10_000, 20_000, 50_000, 100_000, 200_000, 400_000],
    currentIndex: 0,
    get current() {
      return this.options[this.currentIndex];
    },
    next() {
      this.currentIndex = clamp(this.currentIndex + 1, 0, this.options.length - 1);
      this.onChange.callAll(this);
      return this.current;
    },
    prev() {
      this.currentIndex = clamp(this.currentIndex - 1, 0, this.options.length - 1);
      this.onChange.callAll(this);
      return this.current;
    },
    emitChangeEvent() {
      this.onChange.callAll(this);
    },

    hasNext() {
      return this.currentIndex < this.options.length - 1;
    },
    hasPrev() {
      return this.currentIndex > 0;
    },
  };

  const productName = productType.toLowerCase();

  const container = new Container();
  container.name = "item-card-" + productName.toLowerCase();

  const bgTexture = Texture.from(ASSET_PREFIX + "bg-sale-item.png");
  const bg = new Sprite(bgTexture);
  container.addChild(bg);

  const { width, height } = bg;

  //// //// //// //// //// //// //// //// ////
  //// Icon & Name
  {
    const iconPadTexture = Texture.from(ASSET_PREFIX + "bg-icon.png");
    const iconPad = new Sprite(iconPadTexture);
    iconPad.anchor.set(0.5);
    iconPad.position.set(0.5 * width, 311);
    container.addChild(iconPad);

    const iconName = productType.toLowerCase();
    const iconTexture = Texture.from(ASSET_PREFIX + iconName + ".png");
    const icon = new Sprite(iconTexture);
    icon.anchor.set(0.5);
    icon.position.set(0.5 * width, 270);
    container.addChild(icon);

    const iconLabel = StaticComponentFactory.createLabel({
      text: productName.toUpperCase(),
      fontSize: 72,
      anchor: [0.5, 0.5],
      position: [0.5 * width, 430],
    });
    container.addChild(iconLabel);
  }

  //// //// //// //// //// //// //// //// ////
  //// Cost
  {
    const Y = 660;
    const costLabelsPadding = 125;

    const costPadTexture = Texture.from(ASSET_PREFIX + "bg-cost.png");
    const costPad = new Sprite(costPadTexture);
    costPad.anchor.set(0.5);
    costPad.position.set(0.5 * width, Y);
    container.addChild(costPad);

    const costIconTexture = Texture.from(ASSET_PREFIX + "tocium-sm.png");
    const costIcon = new Sprite(costIconTexture);
    costIcon.anchor.set(0.5);
    costIcon.position.set(0.5 * width, Y);
    container.addChild(costIcon);

    const costLabel = StaticComponentFactory.createLabel({
      text: "Cost",
      fontSize: 50,
      styleOverrides: {
        fontFamily: FontFamily.DefaultThin,
      },
      anchor: [0.0, 0.5],
      position: [costLabelsPadding, Y],
    });
    container.addChild(costLabel);

    const costOnScreen = createValueAnimator_Counter(() => price * amount.current);
    costOnScreen.animationDuration = 0.45;

    const costValueLabel = StaticComponentFactory.createLabel({
      fontSize: 50,
      anchor: [1.0, 0.5],
      position: [width - costLabelsPadding, Y],
      getText: () => formatToMaxDecimals(Math.round(costOnScreen.valueOnScreen), 4, true),
      getDangerState: () => costOnScreen.valueOnScreen > userData.tocium,
    });

    container.addChild(costValueLabel);
  }

  //// //// //// //// //// //// //// //// ////
  //// Amount
  {
    function setupButtonAnimations(button: Buttonized) {
      button.behavior.on({
        down: () => {
          animator.tween.to(button, {
            pixi: { scale: 0.8 },
            duration: 0.15,
            ease: "power3.out",
            overwrite: true,
          });
        },
        up: () => {
          animator.tween.to(button, {
            pixi: { scale: 1.0 },
            duration: 0.75,
            ease: "elastic(2).out",
            overwrite: true,
          });
        },
      });
    }

    const amountLabel = StaticComponentFactory.createLabel({
      fontSize: 64,
      anchor: [0.5, 0.5],
      position: [0.5 * width, 775],
      getText: () => formatToMaxDecimals(Math.round(amount.current), 4, true),
    });
    container.addChild(amountLabel);

    const STEPPER_BUTTON_SIZE = 80;
    const STEPPER_BUTTON_HITAREA = new Rectangle(
      -0.5 * STEPPER_BUTTON_SIZE,
      -0.5 * STEPPER_BUTTON_SIZE,
      STEPPER_BUTTON_SIZE,
      STEPPER_BUTTON_SIZE
    );

    const btnDecrease = buttonizeInstance(
      StaticComponentFactory.createLabel({
        text: "-",
        fontSize: 64,
        anchor: [0.5, 0.5],
        position: [0.25 * width, 775],
      })
    );
    btnDecrease.behavior.on({
      trigger: () => amount.prev(),
    });
    setupButtonAnimations(btnDecrease);
    container.addChild(btnDecrease);
    btnDecrease.hitArea = STEPPER_BUTTON_HITAREA;

    const btnIncrease = buttonizeInstance(
      StaticComponentFactory.createLabel({
        text: "+",
        fontSize: 64,
        anchor: [0.5, 0.5],
        position: [0.75 * width, 775],
      })
    );
    btnIncrease.behavior.on({
      trigger: () => amount.next(),
    });
    setupButtonAnimations(btnIncrease);
    container.addChild(btnIncrease);
    btnIncrease.hitArea = STEPPER_BUTTON_HITAREA;

    function updateButtonStates() {
      btnDecrease.visible = amount.hasPrev();
      btnIncrease.visible = amount.hasNext();
    }
    updateButtonStates();
    amount.onChange.push(updateButtonStates);
  }

  //// //// //// //// //// //// //// //// ////
  //// PURCHASE Button
  {
    const btnPadTexture = assets.getTexture(TextureId.MeshyTitlePad);
    const btnPadTextureSlices = [56, 35, 56, 35] as [number, number, number, number];
    const btnPad = new NineSlicePlane(btnPadTexture, ...btnPadTextureSlices);
    btnPad.width = width - 52;
    btnPad.pivot.set(0.51 * btnPad.width, 0.5 * btnPad.height);

    const btnLabel = StaticComponentFactory.createLabel({
      text: `Purchase`.toUpperCase(),
      fontSize: 36,
      anchor: [0.5, 0.5],
    });

    const btnContainer = buttonizeInstance(new Container());
    btnContainer.position.set(0.5 * width, 885);
    btnContainer.addChild(btnPad, btnLabel);
    container.addChild(btnContainer);

    btnContainer.behavior.on({
      down: () => {
        btnPad.tint = 0xcecece;
        animator.tween.to(btnContainer, {
          pixi: { pivotY: -4 },
          duration: 0.05,
        });
      },
      up: () => {
        btnPad.tint = 0xffffff;
        animator.tween.to(btnContainer, {
          pixi: { pivotY: 0 },
          duration: 0.25,
        });
      },

      trigger: async () => {
        const productAmount = amount.current;
        const costOnScreen = createValueAnimator_Counter(() => price * amount.current);
        if (costOnScreen.valueOnScreen > userData.tocium) {
          return await modals.warning(
            `Fuel cost is ${costOnScreen.valueOnScreen} but you only have ${userData.tocium}`
          );
        }
        await spinner.showDuring(contracts.market.purchaseFuel(productType, productAmount));
        await spinner.showDuring(userDataCtrl.updateAll());
      },
    });
  }
  container.pivot.set(0.5 * bgTexture.width, 0.5 * bgTexture.height);

  return container;
}
