import { GameSingletons } from "@game/app/GameSingletons";
import { getLocomotiveCardAttributes } from "@game/asorted/data/getLocomotiveCardAttributes";
import { CardType } from "@game/constants/CardType";
import { FontIcon } from "@game/constants/FontIcon";
import { CardEntity } from "@game/data/entities/CardEntity";
import { SimpleCardsCarousel } from "@game/ui/components/SimpleCardsCarousel";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { ContractName } from "@sdk-integration/contracts";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { Ease } from "@sdk/time/Ease";
import { CenturyTrainPartEntity } from "../data/CenturyTrainPartEntity";
import { FusionCTPartSlot } from "./FusionCTPartSlot";
import { FusionImpactAttributesPane } from "./FusionImpactAttributesPane";

const MINIMUM_AMP_COST = 5;

const distMax = 60;
const luckMax = 15;
const haulMax = 40;
const speedMax = 25;

export class FusionChooseLocoSection extends Container {
  private readonly context = GameSingletons.getGameContext();

  public backButtonClick?: () => void;

  constructor(public readonly selectedPartEntity: CenturyTrainPartEntity) {
    super();

    let selectedLoco = null as null | CardEntity;
    let choiceIfMaxed: Promise<boolean>;

    const performFusion = async () => {
      const { contracts, userData, modals } = this.context;

      if (!selectedLoco) throw new Error("No locomotive selected");

      if (selectedLoco.data.asset_schema_type !== "locomotive") throw new Error("Selected card is not a locomotive");

      if (userData.anomaticParticles < MINIMUM_AMP_COST) {
        modals.alert({
          title: "Oops!",
          content: `At least ${FontIcon.AnomaticParticles}5 (AMP) is required to perform a fusion.`,
        });
        return;
      }
      let locoStats = getLocomotiveCardAttributes(selectedLoco);
      if (locoStats.distance.boost >= distMax) {
        choiceIfMaxed = this.createFusionWarning("distance");
      } else if (locoStats.haul.boost >= haulMax) {
        choiceIfMaxed = this.createFusionWarning("hauling power");
      } else if (locoStats.speed.boost >= speedMax) {
        choiceIfMaxed = this.createFusionWarning("speed");
      } else if (locoStats.luck.boost >= luckMax) {
        choiceIfMaxed = this.createFusionWarning("luck");
      }

      if ((await choiceIfMaxed) == true || choiceIfMaxed == undefined) {
        await contracts.actions.performActionTransactions([
          [
            "fusepart",
            {
              railroader: contracts.currentUserName,
              part: `1 ${selectedPartEntity.tokenSymbol}`,
              century: contracts.currentCenturyName,
              loco_id: selectedLoco.assetId,
            },
            ContractName.M,
          ],
        ]);

        // console.log(`----`, selectedLoco);

        await this.context.modals.warning(
          "YOU UPGRADED YOUR LOCOMOTIVE!\nCHECK OUT ITS SHINY NEW MUTABLE ATTRIBUTES",
          "Successful Fusion"
        );
      } else {
        return;
      }
      this.backButtonClick?.();
    };

    //// Selected component
    const componentSlot = new FusionCTPartSlot();
    componentSlot.position.set(825, 350);
    componentSlot.setSelectedPartEntity(this.selectedPartEntity);
    this.addChild(componentSlot);

    //// Attribute panel
    const attributePanel = new FusionImpactAttributesPane();
    attributePanel.addCenterButton(`Fuse for ${FontIcon.AnomaticParticles}5`, performFusion);
    attributePanel.setAttributeValues(this.selectedPartEntity);
    attributePanel.position.set(180, 830);

    //// Cards
    const cards = [...this.context.userData.iterateAllCards(CardType.Locomotive)];
    const setSelectedCard = (card: CardEntity) => {
      cardsCarousel.setHighlightedCards([card.assetId]);
      selectedLoco = card;
      attributePanel.setMaxAttributeValues(getLocomotiveCardAttributes(selectedLoco));
    };

    const cardsCarousel = new SimpleCardsCarousel(cards, 1050, 380, 9);
    cardsCarousel.options.verticalAlignment = 1.0;
    cardsCarousel.options.scaleEase = Ease.InCubic;
    cardsCarousel.options.scaleMin = 0.85;
    cardsCarousel.position.set(400, 540);
    cardsCarousel.events.on({
      scrollIndexChange(cardIndex: number): void {
        setSelectedCard(cards[cardIndex]);
      },
    });
    this.addChild(cardsCarousel);

    this.addChild(attributePanel);

    ////

    this.addBackButton();

    ////

    if (cards.length) {
      setSelectedCard(cardsCarousel.getCurrentCardData());
    }
  }

  private async createFusionWarning(boost: string) {
    const choice = await this.context.modals.confirm({
      title: "Stat Boost Maxed",
      content: `The ${boost} boost (and maybe more) will not\nbe applied due to reaching the maximum limit.\nCheck to make sure you wish to fuse this part!`,
      acceptButtonText: "Fuse it!",
      cancelButtonText: "Wait!",
      cornerDetailType: null,
    });
    return choice;
  }
  private addBackButton(): void {
    const backButton = new Sprite(this.context.assets.getTexture("ui-market-window-ct-parts/back-btn.png"));
    backButton.name = "backButton";
    buttonizeDisplayObject(backButton, () => this.backButtonClick?.());
    backButton.anchor.set(0.5);
    backButton.position.set(250, 700);
    this.addChild(backButton);
  }
}
