import { StakingAddonType } from "@game/asorted/StakingType";
import { FontFamily } from "@game/constants/FontFamily";
import { isUserOnVIPWhitelist } from "@game/data/staking/helpers";
import { StakingAddonStatusData_Unlocked } from "@game/data/staking/models";
import { Container } from "@pixi/display";
import { Text } from "@pixi/text";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { StationAddonPopup } from "./bases/StationAddonPopup";
import { ConductorLoungeData } from "./staking-addon-components/models";
import { StakingAddonsComponentFactory } from "./staking-addon-components/StakingAddonsComponentFactory";
import { StakedCardPreview } from "./station-dashboard-components/stakes/addon-subpages/components/StakedCardPreview";
import { getStakingAddonDisplayProperties } from "./station-dashboard-components/stakes/utils/getStakingAddonDisplayProperties";

const atlasTexturePrefix = "ui-staking-hub/rail-yard/";

/**
 * The the notes in base class `StationAddonPopup`'s definition.
 */
export class StationAddonRailYardPopup extends StationAddonPopup {
  public readonly addonType = StakingAddonType.RailYard;

  /**
   * Unlike the Conductor Lounge, the Rail Yard popup has a
   * regular looking station name and title, so we override the content
   * filling function and add those on here.
   */
  async fillContent_Default() {
    await super.fillContent_Default();

    const { station, addonType } = this;
    if (!station) {
      throw new Error("StationStakingHubPopup: station is not set");
    }
    const { addonDisplayName: displayName } = getStakingAddonDisplayProperties(addonType);
    const componentFactory = new StakingAddonsComponentFactory(this);
    componentFactory.addPageTitle(station.name);
    componentFactory.addPageSubtitle(displayName);
  }

  addPageContent_SelectSpotType(
    container: Container,
    data: StakingAddonStatusData_Unlocked,
    callbacks: { gotoPublic: () => void; gotoVIP: () => void }
  ) {
    const { simpleFactory: simpleFactory } = this.context;

    const userIsOnVipWhitelist: boolean = isUserOnVIPWhitelist(data);

    function createPortalSign(options: { textureSuffix: string; onClick: () => void; data: ConductorLoungeData }) {
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
      background.addChild(addSignLights(active));
      background.addChild(addSignText(commission, spotsAvailable));
      if (active) {
        background.addChild(addSignButton(isPublic));
      }

      if (assetsStaked) {
        background.addChild(addAssetsStakedCog(isPublic, assetsStaked));
      }

      return background;
    }

    const addSignLights = (isGreen: boolean) => {
      const lightContainer = new Container();
      lightContainer.name = "lightContainer";
      lightContainer.position.set(46, 214);

      const leftLight = simpleFactory.createSprite(
        `${atlasTexturePrefix}${isGreen ? "light-green.png" : "light-gray.png"}`
      );
      leftLight.name = "leftLight";
      lightContainer.addChild(leftLight);

      const rightLight = simpleFactory.createSprite(
        `${atlasTexturePrefix}${isGreen ? "light-gray.png" : "light-red.png"}`
      );
      rightLight.name = "rightLight";
      rightLight.position.set(177, -2);
      lightContainer.addChild(rightLight);

      return lightContainer;
    };

    const addSignText = (commission: number, numberOfSpots: number) => {
      const sign = new Container();
      sign.name = "sign";
      sign.position.set(89, 344);

      const textContentTop = `${commission}% commission`;
      const signTextTop = new Text(textContentTop.toUpperCase(), {
        fill: "#FFFFFF",
        fontFamily: FontFamily.Default,
        fontSize: 18,
      });
      signTextTop.name = "signTextTop";
      sign.addChild(signTextTop);

      const textContentBottom = `${numberOfSpots} spots open`;
      const signTextBottom = new Text(textContentBottom.toUpperCase(), {
        fill: "#00FFFF",
        fontFamily: FontFamily.Default,
        fontSize: 18,
      });
      signTextBottom.name = "signTextBottom";
      signTextBottom.position.set(9, 30);
      sign.addChild(signTextBottom);

      return sign;
    };

    const addSignButton = (isPublic: boolean) => {
      const needToSendRequest = !isPublic && !userIsOnVipWhitelist;

      const prefix = isPublic ? "pub" : "vip";

      const button = simpleFactory.createSprite(`${atlasTexturePrefix}button.png`);
      button.name = `${prefix}-button`;
      button.position.set(30, 455);

      const signButtonContent = !needToSendRequest ? "Choose Locomotive" : "Send Request";
      const signButtonText = new Text(signButtonContent.toUpperCase(), {
        fill: "#FFFFFF",
        fontFamily: FontFamily.Default,
        fontSize: 16,
      });
      button.addChild(signButtonText);

      if (!needToSendRequest) {
        signButtonText.position.set(39, 15);
      } else {
        signButtonText.position.set(93, 15);
        const envelopeIcon = simpleFactory.createSprite(`${atlasTexturePrefix}envelope-sm.png`);
        envelopeIcon.name = "envelope";
        envelopeIcon.position.set(7, -6);
        button.addChild(envelopeIcon);

        button.alpha = 0.2;
      }

      return button;
    };

    const addAssetsStakedCog = (isPublic: boolean, assetsStaked: number) => {
      const prefix = isPublic ? "public" : "vip";

      const cog = simpleFactory.createSprite(`${atlasTexturePrefix}gear-staked-${prefix}.png`);
      cog.name = `${prefix}-cog`;
      cog.position.set(106, -70);

      const assetsStakedText = new Text(`${assetsStaked}`, {
        fill: "#FFFFFF",
        fontFamily: FontFamily.Default,
        fontSize: 32,
        stroke: 0x303030,
        strokeThickness: 5,
      });
      assetsStakedText.name = "assetsStakedText";
      assetsStakedText.position.set(50, 34);

      cog.addChild(assetsStakedText);

      return cog;
    };

    // TODO: Fetch data
    const portalPublic = createPortalSign({
      textureSuffix: "1-public.png",
      onClick: callbacks.gotoPublic,
      data: {
        commission: data.commissionRate,
        spotsAvailable: data.publicSpotsMax - data.publicSpotsUsed,
        assetsStaked: data.publicStakedAssets.length,
      },
    });
    portalPublic.position.set(330, 114);
    container.addChild(portalPublic);

    // TODO: Fetch data
    const portalVip = createPortalSign({
      textureSuffix: "2-vip.png",
      onClick: callbacks.gotoVIP,
      data: {
        commission: data.commissionRateVip,
        spotsAvailable: data.vipSpotsMax - data.vipSpotsUsed,
        assetsStaked: data.vipStakedAssets.length,
      },
    });
    portalVip.position.set(520, 114);
    container.addChild(portalVip);

    const bottomBar = this.__createBottomBar_SINGULAR_MESSAGE_VERSION();
    bottomBar.setText(`Select public or VIP spots to stake.`);
    container.addChild(bottomBar);

    return container;
  }

  addPageContent_SelectCardToStake(container: Container, spotTypeIsVIP: boolean, callbacks: { goBack: () => void }) {
    const { station } = this;
    if (!station) {
      throw new Error("StationStakingHubPopup: station is not set");
    }

    const { simpleFactory } = this.context;

    //// BACKGROUND DECORATIONS

    // Add NFT back drop with cards
    const listPad = simpleFactory.createSprite(atlasTexturePrefix + "public-nft-backdrop.png");
    listPad.position.set(31, 129);
    listPad.scale.set(0.5);
    container.addChild(listPad);

    const backdropLabelContent = "My locomotives";
    const backdropLabel = simpleFactory.createText(backdropLabelContent.toUpperCase(), { fontSize: 28 });
    backdropLabel.position.set(351, 7);
    listPad.addChild(backdropLabel);

    // Add placeholder
    const placeholder = simpleFactory.createSprite(atlasTexturePrefix + "public-placeholder.png");
    placeholder.position.set(499, 128);
    placeholder.scale.set(0.5);
    container.addChild(placeholder);

    //// SELECTED CARD PREVIEW

    const selectedCardPreviewBox = new StakedCardPreview(spotTypeIsVIP);
    selectedCardPreviewBox.name = "selectedCardPreviewBox";
    selectedCardPreviewBox.position.set(501, 87);
    selectedCardPreviewBox.scale.set(0.48);
    container.addChild(selectedCardPreviewBox);

    //// CARD SELECTION

    const { cardListContainer, bottomBar, getFocusedCardInList, selectCard } = this.__createCardSelectionComponents(
      {
        x: 104,
        y: 165,
        width: 340,
        height: 135,
      },
      selectedCardPreviewBox,
      spotTypeIsVIP
    );
    container.addChild(cardListContainer, bottomBar);

    //// BACK ARROW BUTTON

    const backButton = this.__createBackArrow();
    container.addChild(backButton);
    buttonizeDisplayObject(backButton, callbacks.goBack);

    ////  Select current card by default
    selectCard(getFocusedCardInList());
  }
}
