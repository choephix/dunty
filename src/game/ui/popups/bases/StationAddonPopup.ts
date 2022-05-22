import { __window__ } from "@debug/__";
import { __DEBUG__ } from "@debug/__DEBUG__";
import { formatDateTimeHumanReadable } from "@game/asorted/formatDateTimeHumanReadable";
import { createPageObject } from "@game/asorted/functional-helpers/createPageObject";
import { PageObjectManager } from "@sdk-pixi/ui-helpers/PageObjectManager";
import { SpriteWithText } from "@game/asorted/SpriteWithText";
import { StakingAddonType } from "@game/asorted/StakingType";
import { getCardPreviewTextureUrl } from "@game/cards/getCardPreview";
import { CardType } from "@game/constants/CardType";
import { FontIcon } from "@game/constants/FontIcon";
import { getRarityColors } from "@game/constants/RarityColors";
import { ThemeColors } from "@game/constants/ThemeColors";
import { CardEntity } from "@game/data/entities/CardEntity";
import { StakingAddonStatusData_Unlocked } from "@game/data/staking/models";
import { StakingAddonDataHelper } from "@game/data/staking/StakingAddonDataHelper";
import { StakingAddonDataService } from "@game/data/staking/StakingAddonDataService";
import { markCardSpriteIfEquippedOnTrain } from "@game/ui/cards/markCardSpriteIfEquippedOnTrain";
import { SimpleCardsCarousel } from "@game/ui/components/SimpleCardsCarousel";
import { RailroaderDashPanelType } from "@game/ui/railroader-dash/panels/models";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { DashboardButton } from "../components/dash/DashboardButton";
import { DashboardTextBox } from "../components/dash/DashboardTextBox";
import { StationPopupBackgroundType } from "../components/StationPopupBackgroundType";
import { StakedCardPreview } from "../station-dashboard-components/stakes/addon-subpages/components/StakedCardPreview";
import { PopupPlacementFunction } from "../util/PopupPlacementFunction";
import { StationPopup } from "./StationPopup";

/**
 * .fillContent_Default() will be called by default when this popup is created by the popup manager
 *
 * Since both popups have this page structure:
 * - PAGE: Select Public or VIP spot
 * - PAGE: Select and stake card to Public Spot
 * - PAGE: Select and request to stake card to VIP Spot
 *
 * We can use the same logic to fill the content of the popup
 * and only override the functions that actually build out the contents of those pages.
 */
export abstract class StationAddonPopup extends StationPopup {
  public readonly placementFunc: PopupPlacementFunction = PopupPlacementFunction.topTooltip;

  public abstract readonly addonType: StakingAddonType;

  public readonly padWidth: number = 742;
  public readonly padHeight: number = 465;

  /** Becomes true when at least one page has been initialized. */
  initialized: boolean = false;

  async fillContent_Default() {
    const { station, addonType } = this;
    if (!station) {
      throw new Error("StationStakingHubPopup: station is not set");
    }

    this.setStakingHubBackground(addonType);

    //////

    const pageManager = new PageObjectManager(
      {
        stakeToPublicSpot: () => {
          const container = createPageObject({
            initialize: () => {
              this.addPageContent_SelectCardToStake(container, false, {
                goBack: () => goBack(),
              });
            },
          });
          return container;
        },

        stakeToVipSpot: () => {
          const container = createPageObject({
            initialize: () => {
              this.addPageContent_SelectCardToStake(container, true, {
                goBack: () => goBack(),
              });
            },
          });
          return container;
        },

        selectSpotType: () => {
          const { addonType, station } = this;
          const container = createPageObject({
            load: async () => {
              const addonDataService = new StakingAddonDataService(addonType);
              const data = await addonDataService.getAddonStatusData(station!.assetId);
              if (!data.unlocked) {
                throw new Error("The Conductor Lounge is locked.");
              }
              return data;
            },
            initialize: data => {
              this.addPageContent_SelectSpotType(container, data, {
                gotoPublic: () => {
                  pageManager.setCurrentPage("stakeToPublicSpot");
                },
                gotoVIP: () => {
                  if (userIsOnVipWhitelist) {
                    pageManager.setCurrentPage("stakeToVipSpot");
                  } else {
                    this.context.modals.alert({
                      title: "VIP Staking",
                      content: `You must be on this station's VIP whitelist to stake to its VIP spots.\nRequesting VIP spots is an upcoming feature.\n${FontIcon.CenturyTrain} Stay tuned! ${FontIcon.CenturyTrain}`,
                    });

                    ////TODO: Request VIP spots
                    // pageManager.setCurrentPage("requestVipSpot");
                  }
                },
              });
            },
          });
          return container;
        },

        noTrainWarning: () => this.createPage_NoAccessWarning(),
      },
      this
    );
    pageManager.events.on({
      afterChange: () => {
        this.initialized = true;
      },
    });

    const goBack = () => {
      pageManager.setCurrentPage("selectSpotType");
    };

    const addonDataService = new StakingAddonDataService(addonType);
    const vipList = await this.context.spinner.showDuring(addonDataService.getVIPWhitelist(station.assetId));
    const userIsOnVipWhitelist = vipList.some(row => row.railroader === this.context.contracts.currentUserName);
    const hasTrainsHere = this.context.main.faq.hasIdleTrainsAtStation(station);

    if (__DEBUG__ && __window__.__MIDDLE_MOUSE_BUTTON__) {
      return await pageManager.setCurrentPage("selectSpotType");
    }

    if (!hasTrainsHere && userIsOnVipWhitelist) {
      // user is on VIP list but has no train at station
      await pageManager.setCurrentPage("stakeToVipSpot");
    } else if (hasTrainsHere) {
      await pageManager.setCurrentPage("selectSpotType");
    } else {
      await pageManager.setCurrentPage("noTrainWarning");
    }
  }

  abstract addPageContent_SelectSpotType(
    container: Container,
    data: StakingAddonStatusData_Unlocked,
    callbacks: { gotoPublic: () => void; gotoVIP: () => void }
  ): void;

  abstract addPageContent_SelectCardToStake(
    container: Container,
    spotTypeIsVIP: boolean,
    callbacks: { goBack: () => void }
  ): void;

  private createPage_NoAccessWarning() {
    const container = new Container();

    const message = `You need to have a train here or be on the VIP whitelist to stake.`;
    const bottomBar = this.__createBottomBar_SINGULAR_MESSAGE_VERSION();
    bottomBar.setText(message.toUpperCase(), { fill: ThemeColors.DANGER_COLOR.toInt(), fontWeight: `bold` });
    container.addChild(bottomBar);

    return container;
  }

  /**
   * @returns A data service wrapper object, which can only either stake a card,
   * or retrieve info about the potential staking of a card.
   */
  protected createMiniDataService() {
    const { context, station, addonType } = this;
    if (!station) {
      throw new Error("StationStakingHubPopup: station is not set");
    }

    const addonDataService = new StakingAddonDataService(addonType);

    /**
     * @returns `true` if popup should reload its data
     */
    const performStake = async (card: CardEntity, vip: boolean) => {
      const { input, modals, spinner } = context;
      try {
        console.log({ vip });

        const actionPromise = addonDataService.stakeCard(card.assetId, station.assetId, vip);
        await spinner.showDuring(actionPromise);

        function showSuccessModal() {
          const cardSchemaName = card.schemaType.toUpperCase();
          const flavorPhrase =
            addonType === StakingAddonType.ConductorLounge
              ? `Your ${cardSchemaName} is chillin' in the LOUNGE!`
              : `Your ${cardSchemaName} is in the RAIL YARD!`;

          const acceptButtonText = `Railroader Dash`;
          const cancelButtonText =
            addonType === StakingAddonType.ConductorLounge ? `Back to Lounge` : `Back to Rail Yard`;

          if (vip) {
            return modals.confirm({
              title: "Success",
              content:
                `${flavorPhrase}\n` +
                `This stake expires only when you or the Station owner say it does.\n\n` +
                `(unstaking can be managed from the railroader dash)`,
              acceptButtonText,
              cancelButtonText,
            });
          } else {
            return modals.confirm({
              title: "Success",
              content:
                `${flavorPhrase}\n` +
                `Public stakes expire after 14 days and will stop earning tocium.\n\n` +
                `(unstaking can be managed from the railroader dash)`,
              acceptButtonText,
              cancelButtonText,
            });
          }
        }
        const choice = await showSuccessModal();
        if (choice) {
          context.main.popups.clear();
          input.dispatch("openRailRoaderDashboard", RailroaderDashPanelType.Staking);
          return false;
        }

        return true;
      } catch (error) {
        return false;
      }
    };

    let _stationInfo: null | Awaited<ReturnType<typeof addonDataService.getContractData_StationInfo>> = null;
    addonDataService.getContractData_StationInfo(station.assetId).then(info => (_stationInfo = info));

    const getStationAddonCommissionPercent = async (vip: boolean) => {
      const stationInfo = await this.enchantments.waitUntil(() => _stationInfo);
      if (addonType === StakingAddonType.RailYard) {
        if (vip) {
          return stationInfo.railyard_comm_vip;
        } else {
          return stationInfo.railyard_comm;
        }
      }
      if (addonType === StakingAddonType.ConductorLounge) {
        if (vip) {
          return stationInfo.lounge_comm_vip;
        } else {
          return stationInfo.lounge_comm;
        }
      }
    };

    return {
      performStake,
      getStationAddonCommissionPercent,
    };
  }

  protected __createCardSelectionComponents(
    cardListArea: { x: number; y: number; width: number; height: number },
    cardPreviewBox: Pick<StakedCardPreview, "setPreviewCard">,
    spotTypeIsVIP: boolean,
    onCardSelected?: (card: CardEntity) => void
  ) {
    const { userDataCtrl, modals, spinner } = this.context;

    function getCardCommissionRate(card: CardEntity) {
      try {
        return StakingAddonDataHelper.getCardCommissionRate(card);
      } catch (error) {
        console.error(error);
        return NaN;
      }
    }

    let selectedCard: CardEntity | null = null;
    const selectCard = modals.tryCatch((card: CardEntity) => {
      selectedCard = card;
      if (selectedCard) {
        const selectedCardId = selectedCard.assetId;
        cardList.setHighlightedCards([selectedCardId]);

        cardPreviewBox.setPreviewCard({
          texturePath: getCardPreviewTextureUrl(selectedCard),
          tociumPerHour: getCardCommissionRate(selectedCard),
          cardEntity: selectedCard,
          owned: true,
        });

        const expireTime = new Date().getTime() + 1209600 * 1000;
        const expireTimeString = formatDateTimeHumanReadable(expireTime);
        bottomBar.setExpiration(spotTypeIsVIP ? `Subject to station owner` : expireTimeString);
      }
    });

    //// CARD LIST

    const cardType = this.addonType == StakingAddonType.RailYard ? CardType.Locomotive : CardType.Conductor;
    const cards = [...this.context.userData.iterateAllCards(cardType)];

    const cardListContainer = new Container();
    const addCardList = () => {
      const cardList = new SimpleCardsCarousel(cards, cardListArea.width, cardListArea.height, 9);
      cardList.position.copyFrom(cardListArea);
      cardListContainer.addChild(cardList);

      for (const cardSprite of cardList.sprites) {
        markCardSpriteIfEquippedOnTrain(cardSprite);
      }

      cardList.events.on({
        scrollIndexChange: () => {
          selectCard(cardList.getCurrentCardData());
        },
      });

      return cardList;
    };
    let cardList = addCardList();

    for (const cardSprite of cardList.sprites) {
      markCardSpriteIfEquippedOnTrain(cardSprite);
    }

    cardList.events.on({
      scrollIndexChange: () => {
        selectCard(cardList.getCurrentCardData());
        onCardSelected?.(cardList.getCurrentCardData());
      },
    });

    //// BOTTOM BAR

    const { performStake, getStationAddonCommissionPercent } = this.createMiniDataService();
    const bottomBar = this.__createBottomBar_STAKE_VERSION(async () => {
      const card = selectedCard;

      if (!card) {
        throw new Error("No card selected");
      }

      const reload = await performStake(card, spotTypeIsVIP);

      if (reload) {
        const selectedCardIndex = cards.findIndex(c => c.assetId === card.assetId);
        if (selectedCardIndex > -1) {
          cards.splice(selectedCardIndex, 1);
        }

        const prevCardList = cardList;
        prevCardList.playHideAnimation().then(() => prevCardList.destroy());

        console.log({ selectedCardIndex });

        cardList = addCardList();
        cardList.setScrollIndex(selectedCardIndex, false);
        cardList.playShowAnimation();
      }
    });

    getStationAddonCommissionPercent(spotTypeIsVIP).then(commission => {
      bottomBar.setCommission(commission ?? NaN);
    });

    ////

    return {
      cardListContainer,
      bottomBar,
      selectCard,
      getFocusedCardInList: () => cardList.getCurrentCardData(),
    };
  }

  //// Component Factory Functions
  //// TODO: Move to own factory module
  protected __createBottomBar_SINGULAR_MESSAGE_VERSION() {
    const box = new SpriteWithText("ui-staking-hub/rail-yard/text-field.png", undefined, { fontSize: 40 });
    box.scale.set(0.5);
    box.position.set(59, 398);
    return box;
  }

  //// Component Factory Functions
  //// TODO: Move to own factory module
  protected __createBottomBar_STAKE_VERSION(onClickStake: () => unknown) {
    const container = new Container();

    const boxLeft = new DashboardTextBox("ui-staking-hub/rail-yard/selected-public-text-commission.png");
    boxLeft.scale.set(0.5);
    boxLeft.position.set(59, 400);
    container.addChild(boxLeft);

    const boxRight = new DashboardTextBox("ui-staking-hub/rail-yard/selected-public-text-expiration.png");
    boxRight.scale.set(0.5);
    boxRight.position.set(250, 400);
    container.addChild(boxRight);

    const button = new DashboardButton("ui-railroader-dashboard/btn-green.png", "STAKE", 110, 38);
    button.onClick = onClickStake;
    button.position.set(580, 398);
    container.addChild(button);

    const setCommission = (commission: number) => {
      boxLeft.setTexts("COMMISSION:", isNaN(commission) ? "--" : commission.toString().toUpperCase() + "%");
    };

    const setExpiration = (expiration: string | number) => {
      boxRight.setTexts("STAKE EXPIRATION", !expiration ? "--" : expiration.toString().toUpperCase());
    };

    const bottomBar = Object.assign(container, { setCommission, setExpiration });

    bottomBar.setCommission(NaN);
    bottomBar.setExpiration(NaN);

    return bottomBar;
  }

  protected __createBackArrow() {
    const textureId = "ui-station-dashboard/staking/manage-tab/manage-home/btn-back.png";
    const texture = this.context.assets.getTexture(textureId);
    const sprite = new Sprite(texture);
    sprite.addChild(sprite);
    sprite.position.set(40, 230);
    sprite.scale.set(0.5);
    sprite.interactive = true;
    sprite.buttonMode = true;
    return sprite;
  }

  protected async setStakingHubBackground(stakingHubType: StakingAddonType) {
    const { station, context } = this;

    if (!station) {
      throw new Error("StationPopup.station is not set");
    }

    const { simpleFactory: primitives } = context;

    //HACK: This fixes a bounds issue, which should be properly fixed in the future
    this.setPadBackground(StationPopupBackgroundType.MY_STATION_DASHBOARD);
    this.pad.visible = false;

    const backdropTextureId =
      stakingHubType === StakingAddonType.ConductorLounge
        ? `ui-staking-hub/conductor-lounge/bg.png`
        : `ui-staking-hub/rail-yard/bg.png`;
    const backdrop = primitives.createSprite(backdropTextureId);
    backdrop.scale.set(0.5);
    this.addChild(backdrop);

    const frameTextureId = `assets/images/ui-staking-hub/bg-rim.png`;
    const frame = primitives.createSprite(frameTextureId);
    frame.scale.set(0.5);
    this.addChild(frame);

    const stationRarity = station.rarityLevel;
    const rarityColor = getRarityColors(stationRarity);
    frame.tint = rarityColor.main.toInt();

    const tracks = primitives.createSprite("ui-staking-hub/rail-yard/tracks.png");
    tracks.position.set(26, 366);
    tracks.scale.set(0.5);
    this.addChild(tracks);

    this.updateSizeToPadTexture(frame);
  }
}
