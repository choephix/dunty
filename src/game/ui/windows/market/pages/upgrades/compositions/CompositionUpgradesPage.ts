import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { addBoostedLocoGlow } from "@game/asorted/fx/addBoostedLocoGlow";
import { CardType } from "@game/constants/CardType";
import { CardEntity } from "@game/data/entities/CardEntity";
import { CardSprite } from "@game/ui/cards/CardSprite";
import { markCardSpriteIfEquippedOnTrain } from "@game/ui/cards/markCardSpriteIfEquippedOnTrain";
import { SimpleCardsCarousel } from "@game/ui/components/SimpleCardsCarousel";
import { Container } from "@pixi/display";
import { CardAssetData_Locomotive } from "@sdk-integration/contracts";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { CallbackList } from "@sdk/utils/callbacks/CallbackList";
import { CardUpgradeSlot } from "../../../components/CardUpgradeSlot";
import { CompositionUpgradesInfoPanel } from "./CompositionUpgradesInfoPanel";
import { CompositionUpgradesService, createCompositionUpgradesService } from "./CompositionUpgradesService";

export class CompositionUpgradesPage extends Container {
  private readonly context: GameContext = GameSingletons.getGameContext();
  private readonly tweeener = new TemporaryTweeener(this);

  public service?: CompositionUpgradesService;
  public initialized: boolean = false;

  async loadAndInitialize() {
    const { spinner } = this.context;

    this.service = await spinner.showDuring(createCompositionUpgradesService());

    this.initialize();
  }

  async initialize() {
    if (this.initialized) {
      return console.warn("CompositionUpgradesPage aalready initialized");
    }

    if (!this.service) {
      throw new Error("CompositionUpgradesPage service is not initialized");
    }

    this.initialized = true;

    const service = this.service;

    const { userData, userDataCtrl, ticker, spinner, modals } = this.context;

    const onContentClear = new CallbackList();

    const clearPage = () => {
      onContentClear.callAllAndClear();
    };

    const fillPage = (cardIndex?: number) => {
      clearPage();

      //// //// //// //// //// //// //// //// ////
      //// Input & Output Slots
      //// //// //// //// //// //// //// //// ////

      const inputCardSlot = new CardUpgradeSlot("left");
      inputCardSlot.position.set(90, 45);
      this.addChild(inputCardSlot);
      onContentClear.push(() => inputCardSlot.destroy());

      const outputCardSlot = new CardUpgradeSlot("right");
      outputCardSlot.position.set(560, 45);
      this.addChild(outputCardSlot);
      onContentClear.push(() => outputCardSlot.destroy());

      //// //// //// //// //// //// //// //// ////
      //// Right Side Panel
      //// //// //// //// //// //// //// //// ////

      const rightSidePanel = new CompositionUpgradesInfoPanel();
      rightSidePanel.position.set(1175, 55);
      rightSidePanel.setData(null);
      this.addChild(rightSidePanel);
      onContentClear.push(() => rightSidePanel.destroy());

      //// //// //// //// //// //// //// //// ////
      //// Scrollable Locomotive Cards List
      //// //// //// //// //// //// //// //// ////

      const isCardUpgradeable = (c: CardEntity) => service.inputTemplateIds.includes(+c.templateId as any);
      const allLocomotiveCards = [...userData.iterateAllCards<CardAssetData_Locomotive>(CardType.Locomotive)];
      const upgradableLocomotiveCards = allLocomotiveCards.filter(isCardUpgradeable);
      const locomotiveCardsList = new SimpleCardsCarousel(upgradableLocomotiveCards, 850, 340, 9);
      locomotiveCardsList.position.set(108, 589);
      this.addChild(locomotiveCardsList);
      onContentClear.push(() => locomotiveCardsList.destroy());

      for (const cardSprite of locomotiveCardsList.sprites) {
        markCardSpriteIfEquippedOnTrain(cardSprite);
      }

      if (cardIndex != null) {
        locomotiveCardsList.setScrollIndex(cardIndex);
      }

      //// //// //// //// //// //// //// //// ////
      //// ... ... Business Logic ... ...
      //// //// //// //// //// //// //// //// ////

      async function performUpgrade(card: CardEntity<CardAssetData_Locomotive>) {
        await service.performUpgrade(card);
        clearPage();
        await ticker.delay(3.0);
        await userDataCtrl.updateAll();
        await ticker.delay(0.5);
        fillPage(0);
      }

      let selectedLocomotiveCard: CardEntity<CardAssetData_Locomotive> | null = null;
      const resetState = () => {
        selectedLocomotiveCard = null;
        inputCardSlot.setCard(null);
        outputCardSlot.setCard(null);
        rightSidePanel.setData(null);
      };

      rightSidePanel.events.on({
        onUpgradeButtonClick: async () => {
          if (!selectedLocomotiveCard) {
            return console.error("No locomotive card selected");
          }

          const templateId = selectedLocomotiveCard.templateId;
          const upgradeInfo = service.getUpgradeInfo(templateId);
          if (!upgradeInfo) {
            resetState();
            return console.error("No upgrade info found for selected locomotive card");
          }

          for (const priceConstituent of upgradeInfo.priceConstituents) {
            const currentBalance = userData.getBalance(priceConstituent.currency);
            const cost = priceConstituent.amount;
            if (currentBalance < cost) {
              const price = priceConstituent.formatted;
              return await modals.warning(`Upgrade cost is ${price} but you only have ${currentBalance}`);
            }
          }

          await spinner.showDuring(performUpgrade(selectedLocomotiveCard));
        },
      });

      const onLocomotiveCardSelected = async (card: CardEntity<CardAssetData_Locomotive> | null) => {
        selectedLocomotiveCard = card;

        locomotiveCardsList.setHighlightedCards(card ? [card.assetId] : []);

        if (selectedLocomotiveCard == null) {
          resetState();
          return;
        }

        const templateId = selectedLocomotiveCard.templateId;
        const upgradeInfo = service.getUpgradeInfo(templateId);
        if (upgradeInfo == null) {
          resetState();
          return console.warn("No upgrade info found for locomotive card", selectedLocomotiveCard);
        }

        const inputTemplate = upgradeInfo.inputTemplate;
        const outputTemplate = upgradeInfo.outputTemplate;

        {
          const inputCard = new CardEntity({
            ...inputTemplate,
            asset_template: inputTemplate as any,
            asset_id: -1 as any,
          });
          const inputCardSprite = new CardSprite(inputCard, true);
          if (card?.data.boosted) addBoostedLocoGlow(inputCardSprite);

          inputCardSlot.setCard(inputCardSprite);

          const outputCard = new CardEntity({
            ...outputTemplate,
            asset_template: outputTemplate as any,
            asset_id: -1 as any,
          });
          const outputCardSprite = new CardSprite(outputCard, true);
          outputCardSlot.setCard(outputCardSprite);
          if (card?.data.boosted) addBoostedLocoGlow(outputCardSprite);
        }

        rightSidePanel.setData({
          distance: outputTemplate.distance - inputTemplate.distance,
          haulingPower: outputTemplate.hauling_power - inputTemplate.hauling_power,
          speed: outputTemplate.speed - inputTemplate.speed,
          priceConstituents: upgradeInfo.priceConstituents,
          nextComposition: outputTemplate.composition,
        });
      };

      locomotiveCardsList.events.on({
        scrollIndexChange: () => {
          const card = locomotiveCardsList.getCurrentCardData() as CardEntity<CardAssetData_Locomotive>;
          onLocomotiveCardSelected(card);
        },
      });

      if (upgradableLocomotiveCards.length === 1) {
        const card = locomotiveCardsList.getCurrentCardData() as CardEntity<CardAssetData_Locomotive>;
        onLocomotiveCardSelected(card);
      }
    };

    fillPage();
  }

  public playShowAnimation() {
    return this.tweeener.from(this.children, {
      pixi: {
        alpha: 0,
      },
      stagger: 0.04,
      duration: 0.37,
      ease: "power.out",
    });
  }

  public playHideAnimation() {
    return this.tweeener.to(this.children, {
      pixi: {
        alpha: 0,
      },
      duration: 0.19,
      ease: "power.in",
    });
  }
}
