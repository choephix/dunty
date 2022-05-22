import { GameContext } from "@game/app/app";
import { TextInput } from "@game/asorted/TextInput";
import { NPCEncounterReward } from "@game/cinematics/NPCEncounterReward";
import { FontFamily } from "@game/constants/FontFamily";
import { FontIcon } from "@game/constants/FontIcon";
import { PotentialRailRunStats } from "@game/data/entities/PotentialRailRunStats";
import { RailRunEntity } from "@game/data/entities/RailRunEntity";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { GlowFilter } from "@pixi/filter-glow";
import { Graphics } from "@pixi/graphics";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { PassengerTipsData } from "@sdk-integration/contracts/WaxContractsGateway";
import * as WAX from "@sdk-integration/contracts";
import { formatToMaxDecimals } from "@sdk-ui/utils/formatToMaxDecimals";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { extendDestroyMethod } from "@sdk/pixi/extendDestroyMethod";
import { CallbackList } from "@sdk/utils/callbacks/CallbackList";
import capitalize from "capitalize";
import { LiteralUnion } from "type-fest";
import { ReadonlyObjectDeep } from "type-fest/source/readonly-deep";
import { CardSprite } from "../cards/CardSprite";
import { formatPotentialRunStats } from "../formatters/formatRailRunStats";
import { makeParticlesExplosion } from "../fx/makeParticlesExplosion";
import { GreenButton } from "../railroader-dash/panels/settings/components/GreenButton";
import { StakedAssetEntity, StakedAssetsDataService } from "../railroader-dash/panels/staking/StakedAssetsDataService";
import { CTPartThumbnail } from "../windows/market/pages/ct-parts/components/CTPartThumbnail";
import { createDataTable, DataTableOptions } from "./createDataTableComponent";
import { createRailRunReportTable } from "./createRailRunReportTable";
import {
  GenericModalBase,
  GenericModalBaseCornerDetailType,
  GenericModalBaseOptions,
  GenericModalBaseTextureId,
} from "./GenericModalBase";
import { modifyPivotWithoutChangingPosition } from "@game/asorted/centerPivotWithoutChangingPosition";
import { GameSingletons } from "@game/app/GameSingletons";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";

export const GenericModalBackgroundOptions = {
  GREEN: {
    textureId: GenericModalBaseTextureId.Standard,
    slicing: [80, 88, 96, 90],
  },
  GREY: {
    textureId: GenericModalBaseTextureId.Grey,
    slicing: [80, 88, 96, 90],
  },
  RRR: {
    textureId: GenericModalBaseTextureId.RailRunReport,
    slicing: [150, 150, 150, 150],
  },
} as const;

export class GenericModalFactory {
  private readonly context = GameSingletons.getGameContext();

  #addAndShowModal<T extends GenericModalBase<any>>(modal: T, preventClicksBehind = true) {
    const { viewSize, stageContainers } = this.context;

    if (preventClicksBehind) {
      const dimmer = new Sprite(Texture.WHITE);
      dimmer.width = viewSize.width;
      dimmer.height = viewSize.height;
      dimmer.renderable = false;
      dimmer.interactive = true;
      extendDestroyMethod(modal, () => dimmer.destroy());
      stageContainers._modals.addChild(dimmer);
    }

    stageContainers._modals.addChild(modal);
    modal.scale.set(0.6);
    modal.position.set(0.5 * viewSize.width, 0.5 * viewSize.height);
    return modal.playShowAnimation?.();
  }

  __createModalAndPromise<TResult = void>(
    options: GenericModalBaseOptions,
    callbacks: {
      initialize?: (loadedStuff: any) => void;
      load?: () => Promise<unknown>;
    } = {}
  ) {
    type ChoiceResultCallback = (choice: TResult) => void;
    const onResult = new CallbackList<ChoiceResultCallback>();

    const modal = new GenericModalBase<TResult>(options);
    modal.emitResult = (choice: TResult) => onResult.callAllAndClear(choice);

    const modalResultPromise = {
      then: (callback: ChoiceResultCallback) => {
        onResult.push(callback);
      },
    };

    const loadPromise = Promise.resolve(callbacks.load?.());

    return Object.assign(modalResultPromise, {
      modal,
      modalResultPromise,
      showModal: async (preventClicksBehind = true) => {
        const loadedStuff = await this.context.spinner.showDuring(loadPromise);
        callbacks.initialize?.(loadedStuff);
        if (!modal.parent) {
          await this.#addAndShowModal(modal, preventClicksBehind);
        } else {
          await modal.playShowAnimation?.();
        }
        return await modalResultPromise;
      },
      hideAndDestroyModal: async () => {
        await modal.hideAndDestroy();
        onResult.callAllAndClear(undefined!);
      },
    });
  }

  //// Absolutely Generic ////

  alert(
    options: Partial<GenericModalBaseOptions> & {
      readonly title: string;
      readonly okButtonText?: string;
    }
  ) {
    const onClose = new CallbackList();

    const modal = new GenericModalBase({
      cornerDetailType: GenericModalBaseCornerDetailType.Gears,
      background: GenericModalBackgroundOptions.GREEN,
      content: "",
      ...options,
      buttons: [
        {
          labelText: options.okButtonText ?? "OK",
          onClick: async function (this: GenericModalBase) {
            await this.hideAndDestroy();
            return onClose.callAllAndClear();
          },
        },
      ],
    });

    this.#addAndShowModal(modal);

    return {
      modal,
      then: (callback: () => void) => {
        onClose.push(callback);
      },
    };
  }

  async confirm(
    options: Partial<GenericModalBaseOptions> & {
      readonly title: string;
      readonly content: string;
      readonly acceptButtonText?: string;
      readonly cancelButtonText?: string;
    }
  ) {
    type ChoiceResultCallback = (choice: boolean) => void;
    const onClose = new CallbackList<ChoiceResultCallback>();

    const modal = new GenericModalBase({
      cornerDetailType: GenericModalBaseCornerDetailType.Gears,
      background: GenericModalBackgroundOptions.GREEN,
      ...options,
      buttons: [
        {
          labelText: options.acceptButtonText ?? "Accept",
          onClick: async function (this: GenericModalBase) {
            await this.hideAndDestroy();
            return onClose.callAllAndClear(true);
          },
        },
        {
          labelText: options.cancelButtonText ?? "Cancel",
          onClick: async function (this: GenericModalBase) {
            await this.hideAndDestroy();
            return onClose.callAllAndClear(false);
          },
        },
      ],
    });

    this.#addAndShowModal(modal);

    return {
      modal,
      then: (callback: ChoiceResultCallback) => {
        onClose.push(callback);
      },
    };
  }

  warning(message: string, title: string = "") {
    return this.alert({
      title,
      content: message,
      cornerDetailType: GenericModalBaseCornerDetailType.Warning,
      background: GenericModalBackgroundOptions.GREEN,
    });
  }

  //// Gameplay Specific ////

  claimRailRunTocium(trainName: string, stationName: string) {
    return this.alert({
      title: "Claim that sweet Tocium!",
      content: `
      Nice work, Railroader!
      ${capitalize(trainName)} has arrived at ${stationName}
      `,
      cornerDetailType: GenericModalBaseCornerDetailType.Tocium,
    });
  }

  claimPassengerTips(data: PassengerTipsData) {
    const { contracts, spinner } = this.context;

    const onClose = new CallbackList();

    async function createTableOptions() {
      type PassengerTemplateData = {
        criterion: string;
        desc: string;
        home_region: string;
        home_regionid: number;
        img: string;
        name: string;
        rarity: string;
        threshold: number;
        tip: number;
      };
      const passengersData = {} as Record<WAX.AssetTemplateId, PassengerTemplateData>;
      for (const tip of data.tips) {
        passengersData[tip.passengerTemplateId] = await contracts.assets.getAssetTemplateData<PassengerTemplateData>(
          tip.passengerTemplateId
        );
      }

      const tableOptions: DataTableOptions = {
        columns: [
          { header: "NAME", width: 350, align: "left" },
          { header: "CRITERION", width: 350, align: "center" },
          { header: "TIP %", width: 200, align: "center" },
          { header: "TIP AMOUNT", width: 200, align: "center" },
        ],
        rows: [
          ...data.tips.map(tip => {
            const passengerName = passengersData[tip.passengerTemplateId].name;
            return {
              cells: [
                passengerName,
                tip.criterion,
                `${formatToMaxDecimals(tip.percentage, 1)}`,
                `${formatToMaxDecimals(tip.amount, 2)}`,
              ],
              bgColor: undefined,
              marginTop: undefined,
            };
          }),
          {
            cells: [
              "TOTAL",
              "",
              `${formatToMaxDecimals(data.totalTipPercentage, 1)}%`,
              `${formatToMaxDecimals(data.totalTipAmount, 2)}`,
            ],
            bgColor: 0x03272e,
            marginTop: 50,
          },
        ],
      };

      return tableOptions;
    }

    spinner.showDuring(createTableOptions()).then(tableOptions => {
      const modal = new GenericModalBase({
        title: "Those Are Some Happy Passengers!",
        content: () => {
          const table = createDataTable(tableOptions);

          const tweeener = new TemporaryTweeener(table);
          const behavior = {
            show: async () => {
              const textInstances = table.children.filter(child => child instanceof Text);
              return tweeener.from(textInstances, {
                pixi: { scale: 0.0, alpha: 0.0 },
                stagger: 0.033,
                duration: 0.3,
                ease: "back.out",
              });
            },
          };

          return Object.assign(table, behavior);
        },
        cornerDetailType: GenericModalBaseCornerDetailType.Tocium,
        background: GenericModalBackgroundOptions.GREEN,
        buttons: [
          {
            labelText: "THANKS!",
            onClick: async function (this: GenericModalBase) {
              await this.hideAndDestroy();
              return onClose.callAllAndClear();
            },
          },
        ],
        width: 1600,
        breathingRoom: 200,
      });

      this.#addAndShowModal(modal);
    });

    return {
      then: (callback: () => void) => {
        onClose.push(callback);
      },
    };
  }

  railRunReport(stats: ReadonlyObjectDeep<{ reward: number } & RailRunEntity>) {
    const onClose = new CallbackList();

    const potentialRun = new PotentialRailRunStats();
    potentialRun.update(
      this.context.userData.trains.get(stats.waxData.train),
      this.context.mapData.stations.get(stats.waxData.depart_station),
      this.context.mapData.stations.get(stats.waxData.arrive_station)
    );
    const formattedStats = formatPotentialRunStats(potentialRun);

    const modal = new GenericModalBase({
      title: "Railrun Report",
      content: () => {
        const table = createRailRunReportTable(
          formattedStats,
          stats,
          this.context.assets.getTexture("ui-general-modal/hr.png")
        );

        const tweeener = new TemporaryTweeener(table);
        const behavior = {
          show: async () => {
            const textInstances = table.children.filter(child => child instanceof Text);
            return tweeener.fromTo(
              textInstances,
              {
                pixi: { scale: 0.5, alpha: 0.0 },
              },
              {
                pixi: { scale: 1.0, alpha: 1.0 },
                stagger: 0.033,
                duration: 0.3,
                ease: "back.out",
              }
            );
          },
        };

        return Object.assign(table, behavior);
      },
      cornerDetailType: null,
      background: GenericModalBackgroundOptions.RRR,
      breathingRoom: 200,
      buttons: [
        {
          labelText: "Claim",
          onClick: async function (this: GenericModalBase) {
            await this.hideAndDestroy();
            return onClose.callAllAndClear();
          },
        },
      ],
    });

    this.#addAndShowModal(modal);

    return {
      modal,
      then: (callback: () => void) => {
        onClose.push(callback);
      },
    };
  }

  goldenRunSuccess() {
    // FIXME: Should these modals go here?
    console.log("TODO: Modal - success");
  }

  goldenRunSorry() {
    return this.alert({
      title: "Sorry!",
      content: "That was not a Golden Run... Don't give up!".toUpperCase(),
      cornerDetailType: null,
      okButtonText: "Dismiss",
    });
  }

  verifyOrClearTrain(trainName: string) {
    type ChoiceResultCallback = (choice: "verify" | "clear") => void;
    const onClose = new CallbackList<ChoiceResultCallback>();

    const modal = new GenericModalBase({
      title: "Verify/Clear Train",
      content: `
      Uh oh!
      It looks like ${trainName} has been tampered with...
      `,
      cornerDetailType: GenericModalBaseCornerDetailType.Warning,
      background: GenericModalBackgroundOptions.GREEN,
      buttons: [
        {
          labelText: "Verify Train",
          onClick: async function (this: GenericModalBase) {
            await this.hideAndDestroy();
            return onClose.callAllAndClear("verify");
          },
        },
        {
          labelText: "Clear Train",
          onClick: async function (this: GenericModalBase) {
            await this.hideAndDestroy();
            return onClose.callAllAndClear("clear");
          },
        },
      ],
    });

    this.#addAndShowModal(modal);

    return {
      then: (callback: ChoiceResultCallback) => {
        onClose.push(callback);
      },
    };
  }

  strangerReward_Tocium(reward: NPCEncounterReward) {
    type ChoiceResultCallback = () => void;
    const onClose = new CallbackList<ChoiceResultCallback>();

    const modal = new GenericModalBase({
      title: "Mysterious Stranger's Reward",
      content: `You've been gifted ${FontIcon.Tocium} ${reward}!`,
      cornerDetailType: GenericModalBaseCornerDetailType.Tocium,
      background: GenericModalBackgroundOptions.GREEN,
      buttons: [
        {
          labelText: "Claim",
          onClick: async function (this: GenericModalBase) {
            await this.hideAndDestroy();
            return onClose.callAllAndClear();
          },
        },
      ],
    });

    this.#addAndShowModal(modal, false);

    const promise = {
      then: (callback: ChoiceResultCallback) => {
        onClose.push(callback);
      },
    };

    return Object.assign(promise, { modal, promise });
  }

  strangerReward_CenturyVial(amount: LiteralUnion<1 | 2 | 6 | 12 | 18, number>) {
    type ChoiceResultCallback = () => void;
    const onClose = new CallbackList<ChoiceResultCallback>();

    const modal = new GenericModalBase({
      title: "Whoa... A Century Vial!",
      content: () => {
        const container = new Container();

        const message1 = this.context.simpleFactory.createText(`+${amount}`, { fontSize: 80 }, { y: -130 });
        message1.anchor.set(0.5);
        const message2 = this.context.simpleFactory.createText(
          "Anomatic Particles".toUpperCase(),
          { fontSize: 48 },
          { y: -40 }
        );
        message2.anchor.set(0.5);
        container.addChild(message1);
        container.addChild(message2);

        return container;
      },
      cornerDetailType: null,
      background: GenericModalBackgroundOptions.GREEN,
      buttons: [
        {
          labelText: "Safely Syphon",
          onClick: async function (this: GenericModalBase) {
            await this.hideAndDestroy();
            return onClose.callAllAndClear();
          },
        },
      ],
    });

    const getCenturyVialTextureId = (ampAmount: number) => {
      const textureIds = {
        1: "century-vials/1.png",
        2: "century-vials/2.png",
        6: "century-vials/3.png",
        12: "century-vials/4.png",
        18: "century-vials/5.png",
      };

      for (const propertyName in textureIds) {
        const key = Number(propertyName) as keyof typeof textureIds;
        if (key >= amount) {
          return textureIds[key];
        }
      }

      if (ampAmount > 1) {
        return textureIds[18];
      }

      return "century-vials/amp.png";
    };

    const spraySomeParticles = () => {
      const particles = makeParticlesExplosion({ x: vialSprite.x, y: vialSprite.y });
      particles.scale.set(2);
      modal.addChildAt(particles, modal.children.indexOf(vialSprite));
      return particles.emmitAndDestroy();
    };

    const animationDuration = 0.87 + amount * 0.03;
    const tweeener = new TemporaryTweeener(modal);
    const vialTextureId = getCenturyVialTextureId(amount);
    const vialTexture = this.context.assets.getTexture(vialTextureId);
    const vialSprite = Object.assign(new Sprite(vialTexture), {
      show() {
        // tweeener.delay(0.25 * animationDuration).then(spraySomeParticles);
        return tweeener.from(vialSprite, {
          pixi: { scale: 3, alpha: 0, angle: -15 },
          duration: animationDuration,
          ease: "bounce.out",
        });
      },
      hide() {
        return tweeener.to(vialSprite, {
          pixi: { scale: 0, angle: 225 },
          duration: 0.3 * animationDuration,
          ease: "back.in",
        });
      },
    });
    vialSprite.name = "vialSprite";
    vialSprite.anchor.set(0.5);
    vialSprite.position.set(1000 + vialSprite.width * 0.35, 428);
    vialSprite.angle = 5;
    modal.addChild(vialSprite);

    this.#addAndShowModal(modal, false);

    const promise = {
      then: (callback: ChoiceResultCallback) => {
        onClose.push(callback);
      },
    };

    return Object.assign(promise, { modal, promise });
  }

  newStoryEncounterUnlocked() {
    type ChoiceResultCallback = (choice: "begin" | "skip") => void;
    const onClose = new CallbackList<ChoiceResultCallback>();

    const modal = new GenericModalBase({
      title: "Story Encounter Available",
      content: () => {
        const container = new Container();

        const message1 = this.context.simpleFactory.createText(
          "YOU'VE UNLOCKED THE NEXT PART OF THE MODERN CENTURY STORY.",
          { fontSize: 34 },
          { y: -130 }
        );
        message1.anchor.set(0.5);
        const message2 = this.context.simpleFactory.createText(
          "WOULD YOU LIKE TO VIEW IT NOW?",
          { fontSize: 34 },
          { y: -80 }
        );
        message2.anchor.set(0.5);
        const message3 = this.context.simpleFactory.createText(
          "(SKIPPED ENCOUNTERS CAN BE VIEWED FROM THE RAILROADER DASHBOARD)",
          { fontSize: 22 },
          { y: -30 }
        );
        message3.anchor.set(0.5);
        container.addChild(message1);
        container.addChild(message2);
        container.addChild(message3);

        return container;
      },
      cornerDetailType: null,
      background: GenericModalBackgroundOptions.GREEN,
      buttons: [
        {
          labelText: "BEGIN",
          onClick: async function (this: GenericModalBase) {
            await this.hideAndDestroy();
            return onClose.callAllAndClear("begin");
          },
        },
        {
          labelText: "SKIP",
          onClick: async function (this: GenericModalBase) {
            await this.hideAndDestroy();
            return onClose.callAllAndClear("skip");
          },
          color: "grey",
        },
      ],
    });

    this.#addAndShowModal(modal, false);

    const promise = {
      then: (callback: ChoiceResultCallback) => {
        onClose.push(callback);
      },
    };

    return Object.assign(promise, { modal, promise });
  }

  ottoReward(reward: NPCEncounterReward) {
    type ChoiceResult = "buy" | "dismiss";
    type ChoiceResultCallback = (choice: ChoiceResult) => void;
    const onClose = new CallbackList<ChoiceResultCallback>();

    const modal = new GenericModalBase({
      title: "Otto's got a deal for you!",
      content: () => {
        const colorRedStrikeThrough = 0x953b3a;
        const colorDiscountedPrice = 0x35ebb3;

        const container = new Container();
        const part = this.context.gameConfigData.getCenturyPartMarketData(reward.type as any);

        if (part) {
          //// Fuel Symbol
          const thumbnail = new CTPartThumbnail(part, true);
          thumbnail.position.set(-600, -100);

          //// Fuel quantity
          const quantityText = new Text("x1", {
            fontFamily: FontFamily.Default,
            fill: 0xffffff,
            fontSize: 24,
          });
          quantityText.anchor.set(0.5);
          quantityText.position.set(thumbnail.x + thumbnail.width / 2, thumbnail.y + thumbnail.height * 0.77);

          //// Previous amount
          const previousAmountText = new Text(formatToMaxDecimals(part.cost, 4, true) + " TOCIUM", {
            fontFamily: FontFamily.Default,
            fill: 0xffffff,
            fontSize: 24,
          });
          previousAmountText.anchor.set(0.5);
          previousAmountText.position.set(thumbnail.x + thumbnail.width / 2, thumbnail.y + thumbnail.height + 30);

          ////Red line
          const redLine = new Graphics()
            .lineStyle(3, colorRedStrikeThrough)
            .moveTo(previousAmountText.x - previousAmountText.width / 2 - 20, previousAmountText.y)
            .lineTo(previousAmountText.x + previousAmountText.width / 2 + 20, previousAmountText.y);

          //// New amount
          const newAmountText = new Text(formatToMaxDecimals(part.getCostWithDiscountApplied(), 4, true) + " TOCIUM", {
            fontFamily: FontFamily.Default,
            fill: colorDiscountedPrice,
            fontSize: 24,
          });
          newAmountText.anchor.set(0.5);
          newAmountText.position.set(
            thumbnail.x + thumbnail.width / 2,
            previousAmountText.y + previousAmountText.height + 10
          );

          //// Add Buttons
          const createButton = (text: string, choice: ChoiceResult) => {
            const container = new Container();
            //// Adding the button background
            const buttonSprite = new Sprite(this.context.assets.getTexture("meshPad"));
            buttonSprite.anchor.set(0.5);
            buttonSprite.position.set(7.5, 7.5);
            container.addChild(buttonSprite);
            //// Adding the button text
            const buttonText = new Text(text, {
              fontFamily: FontFamily.Default,
              fill: 0xffffff,
              fontSize: 36,
            });
            buttonText.anchor.set(0.5);
            container.addChild(buttonText);

            buttonizeDisplayObject(buttonSprite, async () => {
              await modal.hideAndDestroy();
              onClose.callAllAndClear(choice);
            });

            return container;
          };

          const discountPercent = part.discountPercent ?? 40;
          const buyNowBtn = createButton(`Buy Now (${discountPercent}% Off)`, "buy");
          const marketBtn = createButton("Send to Market", "dismiss");
          marketBtn.position.set(0, buyNowBtn.height + 40);
          const discountTimer = new Text("(Discounted for " + "10" + " min)", {
            fontFamily: FontFamily.Default,
            fill: 0xffffff,
            fontSize: 24,
          });
          discountTimer.anchor.set(0.5);
          discountTimer.position.set(0, marketBtn.y + marketBtn.height / 2 + 5);

          container.addChild(thumbnail);
          container.addChild(quantityText);
          container.addChild(previousAmountText);
          container.addChild(redLine);
          container.addChild(newAmountText);
          container.addChild(buyNowBtn);
          container.addChild(marketBtn);
          container.addChild(discountTimer);
        }

        return container;
      },
      cornerDetailType: null,
      background: GenericModalBackgroundOptions.GREEN,
      breathingRoom: 0,
      width: 1500,
    });

    this.#addAndShowModal(modal, false);

    const promise = {
      then: (callback: ChoiceResultCallback) => {
        onClose.push(callback);
      },
    };

    return Object.assign(promise, { modal, promise });
  }

  unlockTrain() {
    type ChoiceResultCallback = (input: string) => void;
    const onConfirm = new CallbackList<ChoiceResultCallback>();

    const modal = new GenericModalBase({
      title: "Name Your Train",
      content: () => {
        const container = new Container();
        const message = "What shall we name this beast?";
        const text = this.context.simpleFactory.createText(message.toUpperCase(), { fontSize: 32 });
        text.anchor.set(0.5);
        text.position.set(0, -200);

        const bar = this.context.simpleFactory.createSprite("ui-staking-hub/conductor-lounge/request-slider-bar.png");
        bar.anchor.set(0.5);
        bar.y -= 100;

        const textInput = new TextInput({
          input: {
            fontSize: "32px",
            fontWeight: "bold",
            align: "center",
            color: "#ffffff",
            width: `${bar.width - 15}px`,
          },
        });
        textInput.text = "";
        textInput.placeholder = "Train name";
        textInput.pivot.y = textInput.height / 2;
        textInput.position.set(-345, -100);

        const confirmBtn = new GreenButton(
          "CONTINUE",
          async () => {
            await modal.hideAndDestroy();
            onConfirm.callAllAndClear(textInput.text);
          },
          400
        );
        confirmBtn.x = -180;

        container.addChild(text);
        container.addChild(bar);
        container.addChild(confirmBtn);
        container.addChild(textInput);
        return container;
      },
      cornerDetailType: null,
      background: GenericModalBackgroundOptions.GREEN,
      breathingRoom: 0,
      width: 1500,
    });

    this.#addAndShowModal(modal, false);

    const promise = {
      then: (callback: ChoiceResultCallback) => {
        onConfirm.push(callback);
      },
    };

    return Object.assign(promise, { modal, promise });
  }

  inputVIPWhitelistEntryInfo() {
    type ChoiceResultCallback = (choice: [string, number] | null) => void;
    const onClose = new CallbackList<ChoiceResultCallback>();

    const input = {
      railroader: "",
      spotsCount: "",
    };

    const modal = new GenericModalBase({
      title: "Add to VIP Whitelist",
      content: () => {
        const container = new Container();
        //// Railroader input
        const hintRailroader = this.context.simpleFactory.createText("Name of the railroader", { fontSize: 32 });
        hintRailroader.anchor.set(0.5);
        hintRailroader.position.set(0, -200);

        const barRailroader = this.context.simpleFactory.createSprite(
          "ui-staking-hub/conductor-lounge/request-slider-bar.png"
        );
        barRailroader.anchor.set(0.5);
        barRailroader.y -= 125;

        const textInputRailroader = new TextInput({
          input: {
            fontSize: "32px",
            fontWeight: "bold",
            align: "center",
            color: "#ffffff",
            width: `${barRailroader.width - 15}px`,
          },
        });
        textInputRailroader.text = "";
        textInputRailroader.placeholder = "Railroader name";
        textInputRailroader.pivot.y = textInputRailroader.height / 2;
        textInputRailroader.position.set(-345, -125);
        textInputRailroader.on("input", val => {
          input.railroader = val;
        });

        container.addChild(hintRailroader);
        container.addChild(barRailroader);
        container.addChild(textInputRailroader);

        //// VIP spots input
        const hintSpotsCount = this.context.simpleFactory.createText("Number of VIP spots", { fontSize: 32 });
        hintSpotsCount.anchor.set(0.5);
        hintSpotsCount.position.set(0, -50);

        const barVIP = this.context.simpleFactory.createSprite(
          "ui-staking-hub/conductor-lounge/request-slider-bar.png"
        );
        barVIP.anchor.set(0.5);
        barVIP.y += 20;

        const textInputSpotsCount = new TextInput({
          input: {
            fontSize: "32px",
            fontWeight: "bold",
            align: "center",
            color: "#ffffff",
            width: `${barVIP.width - 15}px`,
          },
        });
        textInputSpotsCount.text = "";
        textInputSpotsCount.placeholder = "VIP spots";
        textInputSpotsCount.pivot.y = textInputSpotsCount.height / 2;
        textInputSpotsCount.position.set(-345, 25);
        textInputSpotsCount.on("input", val => {
          input.spotsCount = val;
        });

        container.addChild(hintSpotsCount);
        container.addChild(barVIP);
        container.addChild(textInputSpotsCount);

        return container;
      },
      cornerDetailType: null,
      background: GenericModalBackgroundOptions.GREEN,
      breathingRoom: 0,
      width: 1500,
      buttons: [
        {
          labelText: "Cancel",
          onClick: async function (this: GenericModalBase) {
            await this.hideAndDestroy();
            return onClose.callAllAndClear(null);
          },
        },
        {
          labelText: "Add",
          onClick: async function (this: GenericModalBase) {
            await this.hideAndDestroy();
            return onClose.callAllAndClear([input.railroader, parseInt(input.spotsCount)]);
          },
        },
      ],
    });
    this.#addAndShowModal(modal, false);

    const promise = {
      then: (callback: ChoiceResultCallback) => {
        onClose.push(callback);
      },
    };

    return Object.assign(promise, { modal, promise });
  }

  successfulClaim(reward?: string | null) {
    const { simpleFactory } = this.context;

    let rewardGlowyText: (() => Sprite) | undefined;
    if (reward) {
      rewardGlowyText = () => {
        const sprite = simpleFactory.createText(` ${reward} `, {
          fontSize: 56,
        });
        const filter = new GlowFilter({
          outerStrength: 1.6,
          distance: 20,
          color: 0x00ffcf,
        });
        filter.padding = 20;
        sprite.filters = [filter];
        sprite.anchor.set(0.5);
        return sprite;
      };
    }

    return this.alert({ title: `Successful Claim`, content: rewardGlowyText, okButtonText: "CONTINUE" });
  }

  //// Unstake Modal ////

  async unstakeAsset(
    stakedAsset: StakedAssetEntity,
    options: Partial<GenericModalBaseOptions> & {
      readonly title: string;
      readonly content: string;
      readonly acceptButtonText?: string;
      readonly cancelButtonText?: string;
    }
  ) {
    type ChoiceResultCallback = (choice: boolean) => void;
    const onClose = new CallbackList<ChoiceResultCallback>();

    let willUnstake = false;

    const modal = new GenericModalBase({
      cornerDetailType: null,
      background: GenericModalBackgroundOptions.GREEN,
      ...options,
      buttons: [
        {
          labelText: options.acceptButtonText ?? "Accept",
          onClick: async function (this: GenericModalBase) {
            willUnstake = true;
            await this.hideAndDestroy();
            return onClose.callAllAndClear(true);
          },
        },
        {
          labelText: options.cancelButtonText ?? "Cancel",
          onClick: async function (this: GenericModalBase) {
            await this.hideAndDestroy();
            return onClose.callAllAndClear(false);
          },
        },
      ],
    });

    const tweeener = new TemporaryTweeener(modal);
    const stakedNFTSprite = Object.assign(new CardSprite(stakedAsset.card, true), {
      show() {
        const tween = tweeener.from(stakedNFTSprite, {
          pixi: { scale: 0, angle: -5 },
          duration: 0.4,
          ease: "power4.out",
        });
        if ("kill" in tween) {
          onClose.add(() => tween.kill());
        }
      },
      hide() {
        if (willUnstake) {
          return tweeener.to(stakedNFTSprite, {
            pixi: { scale: 2.0, angle: -15 },
            duration: 0.31,
            ease: "back.in",
            overwrite: true,
          });
        } else {
          return tweeener.to(stakedNFTSprite, {
            pixi: { scale: 0.0, angle: 0 },
            duration: 0.21,
            ease: "back.in",
            overwrite: true,
          });
        }
      },
    });
    stakedNFTSprite.name = "stakedNFTSprite";
    stakedNFTSprite.position.set(1200, 360);
    stakedNFTSprite.scale.set(0.46);
    stakedNFTSprite.angle = 15;
    stakedNFTSprite.setPivotFraction(0.5);
    modal.addChild(stakedNFTSprite);

    this.#addAndShowModal(modal, false);

    const promise = {
      then: (callback: ChoiceResultCallback) => {
        onClose.push(callback);
      },
    };

    return Object.assign(promise, { modal, promise });
  }

  ////

  //// Using an arrow function here, so that we can easily pass the method around without losing the reference to this.
  readonly handleError = async (error: any) => {
    return this.warning(error + "");
  };

  //// Using an arrow function here, so that we can easily pass the method around without losing the reference to this.
  readonly tryCatch = <T extends (...args: any[]) => unknown>(fn: T, $this = null) => {
    const handleError = this.handleError;
    return function (...args: Parameters<T>): ReturnType<T> | void {
      try {
        return fn.apply($this, args) as ReturnType<T>;
      } catch (error) {
        handleError(error);
      }
    };
  };
}
