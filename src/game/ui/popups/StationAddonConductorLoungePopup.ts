import { StakingAddonType } from "@game/asorted/StakingType";
import { FontFamily } from "@game/constants/FontFamily";
import { isUserOnVIPWhitelist } from "@game/data/staking/helpers";
import { StakingAddonStatusData_Unlocked } from "@game/data/staking/models";
import { Container } from "@pixi/display";
import { Text } from "@pixi/text";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { StationAddonPopup } from "./bases/StationAddonPopup";
import { ConductorLoungeCardPreview } from "./staking-addon-components/ConductorLoungeCardPreview";
import {
  ConductorLoungeNeonSign,
  createConductorLoungeNeonSign,
} from "./staking-addon-components/createConductorLoungeNeonSign";
import { ConductorLoungeData } from "./staking-addon-components/models";

const atlasTexturePrefix = "ui-staking-hub/conductor-lounge/";

/**
 * The the notes in base class `StationAddonPopup`'s definition.
 */
export class StationAddonConductorLoungePopup extends StationAddonPopup {
  public readonly addonType = StakingAddonType.ConductorLounge;

  public neonSign?: ConductorLoungeNeonSign;

  /**
   * The Neon Sign persists between pages, so we add it here.
   */
  async fillContent_Default() {
    super.fillContent_Default();

    this.neonSign = createConductorLoungeNeonSign(this.station?.name);
    this.neonSign.turnOff();
    this.enchantments.waitUntil(
      () => this.initialized,
      () => this.neonSign!.turnOn()
    );
    this.addChild(this.neonSign);
  }

  addPageContent_SelectSpotType(
    container: Container,
    data: StakingAddonStatusData_Unlocked,
    callbacks: { gotoPublic: () => void; gotoVIP: () => void }
  ) {
    const { simpleFactory } = this.context;

    const userIsOnVipWhitelist: boolean = isUserOnVIPWhitelist(data);

    function createPortalDoor(options: { textureSuffix: string; onClick: () => void; data: ConductorLoungeData }) {
      const {
        textureSuffix,
        onClick,
        data: { spotsAvailable, commission, assetsStaked },
      } = options;

      const active = spotsAvailable > 0;

      const background = simpleFactory.createSprite(atlasTexturePrefix + textureSuffix);
      background.scale.set(0.5);
      if (active) {
        buttonizeDisplayObject(background, onClick);
      }

      const isPublic = textureSuffix.includes("public");
      background.addChild(addDoorSign(isPublic, spotsAvailable, commission));
      if (active) {
        background.addChild(addDoorButton(isPublic));
      }
      if (assetsStaked) {
        background.addChild(addAssetsStakedOnDoor(assetsStaked));
      }
      return background;
    }

    const addAssetsStakedOnDoor = (assetsStaked: number) => {
      const container = new Container();
      container.position.set(144, 427);

      const assetsStakedIcon = simpleFactory.createSprite(`ui-icons/card-type/conductor.png`);
      assetsStakedIcon.anchor.set(0.5);
      assetsStakedIcon.position.set(-24, 0);
      container.addChild(assetsStakedIcon);

      const assetsStakedText = new Text(`${assetsStaked}`, {
        fill: "#FFFFFF",
        fontFamily: FontFamily.Default,
        fontSize: 32,
      });
      assetsStakedText.name = "assetsStakedText";
      assetsStakedText.anchor.set(0.0, 0.5);
      assetsStakedText.position.set(2, 0);
      container.addChild(assetsStakedText);

      return container;
    };

    const addDoorSign = (isPublic: boolean, numberOfSpots: number, commission: number) => {
      const prefix = isPublic ? "pub" : "vip";

      const sign = simpleFactory.createSprite(`${atlasTexturePrefix}${prefix}-sign.png`);
      sign.name = `${prefix}-sign`;
      sign.position.set(0, -85);

      const textContentTop = `${numberOfSpots} spots open`;
      const signTextTop = new Text(textContentTop.toUpperCase(), {
        fill: "#00FFFF",
        fontFamily: FontFamily.Default,
        fontSize: 18,
      });
      signTextTop.name = "signTextTop";
      signTextTop.position.set(70, 14);
      sign.addChild(signTextTop);

      const textContentBottom = `${commission}% commission`;
      const signTextBottom = new Text(textContentBottom.toUpperCase(), {
        fill: "#FFFFFF",
        fontFamily: FontFamily.Default,
        fontSize: 18,
      });
      signTextBottom.name = "signTextBottom";
      signTextBottom.position.set(60, 41);
      sign.addChild(signTextBottom);

      return sign;
    };

    const addDoorButton = (isPublic: boolean) => {
      const needToSendRequest = !isPublic && !userIsOnVipWhitelist;

      const prefix = isPublic ? "pub" : "vip";

      const button = simpleFactory.createSprite(`${atlasTexturePrefix}button.png`);
      button.name = `${prefix}-button`;
      button.position.set(32, 500);

      const doorButtonContent = !needToSendRequest ? "Choose Conductor" : "Send Request";
      const doorButtonText = new Text(doorButtonContent.toUpperCase(), {
        fill: "#FFFFFF",
        fontFamily: FontFamily.Default,
        fontSize: 16,
      });
      button.addChild(doorButtonText);

      if (!needToSendRequest) {
        doorButtonText.position.set(17, 17);
      } else {
        doorButtonText.position.set(60, 17);
        const envelopeIcon = simpleFactory.createSprite(`${atlasTexturePrefix}envelope-sm.png`);
        envelopeIcon.name = "envelope";
        envelopeIcon.position.set(7, -6);
        button.addChild(envelopeIcon);

        button.alpha = 0.2;
      }

      return button;
    };

    // TODO: Fetch data
    const portalPublic = createPortalDoor({
      textureSuffix: "public-door.png",
      onClick: callbacks.gotoPublic,
      data: {
        commission: data.commissionRate,
        spotsAvailable: data.publicSpotsMax - data.publicSpotsUsed,
        assetsStaked: data.publicStakedAssets.length,
      },
    });
    portalPublic.name = "portalPublic";
    portalPublic.position.set(360, 87);
    container.addChild(portalPublic);

    // TODO: Fetch data
    const portalVip = createPortalDoor({
      textureSuffix: "vip-door.png",
      onClick: callbacks.gotoVIP,
      data: {
        commission: data.commissionRateVip,
        spotsAvailable: data.vipSpotsMax - data.vipSpotsUsed,
        assetsStaked: data.vipStakedAssets.length,
      },
    });
    portalVip.name = "portalVip";
    portalVip.position.set(550, 87);
    container.addChild(portalVip);

    const bottomBar = this.__createBottomBar_SINGULAR_MESSAGE_VERSION();
    bottomBar.setText(`Select public or VIP spots to stake.`);
    container.addChild(bottomBar);
  }

  addPageContent_SelectCardToStake(container: Container, spotTypeIsVIP: boolean, callbacks: { goBack: () => void }) {
    const { station } = this;
    if (!station) {
      throw new Error("StationStakingHubPopup: station is not set");
    }

    const { simpleFactory } = this.context;

    //// SELECTED CARD PREVIEW

    const selectedCardPreviewBox = new ConductorLoungeCardPreview(spotTypeIsVIP);
    selectedCardPreviewBox.name = "selectedCardPreviewBox";
    selectedCardPreviewBox.position.set(488, 103);
    selectedCardPreviewBox.scale.set(0.48);
    container.addChild(selectedCardPreviewBox);

    //// CARD SELECTION

    const { cardListContainer, bottomBar, getFocusedCardInList, selectCard } = this.__createCardSelectionComponents(
      {
        x: 85,
        y: 190,
        width: 320,
        height: 155,
      },
      selectedCardPreviewBox,
      spotTypeIsVIP
    );
    container.addChild(cardListContainer, bottomBar);

    //// BACKGROUND DECORATIONS

    const rope = simpleFactory.createSprite(atlasTexturePrefix + "rope.png");
    rope.name = "listPad";
    rope.scale.set(0.5);
    rope.position.set(25, 274);

    /** Make sure the rope is above the cards. */
    container.addChild(rope);

    //// BACK ARROW BUTTON

    const backButton = this.__createBackArrow();
    container.addChild(backButton);
    buttonizeDisplayObject(backButton, callbacks.goBack);

    ////  Select current card by default
    selectCard(getFocusedCardInList());
  }
}
