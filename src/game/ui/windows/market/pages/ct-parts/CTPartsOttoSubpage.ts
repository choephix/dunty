import { GameSingletons } from "@game/app/GameSingletons";
import { PageObjectManager } from "@sdk-pixi/ui-helpers/PageObjectManager";
import { FontIcon } from "@game/constants/FontIcon";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { CTPartsListBackground, CTPartsListSection, NoCtPartsSection, SelectedPartSection } from "./components";
import { MarketCharacter } from "./components/MarketCharacter";
import { CenturyTrainPartsDataService } from "./CTPartsDataService";
import { CenturyTrainPartEntity } from "./data/CenturyTrainPartEntity";
import { formatToMaxDecimals } from "@sdk-ui/utils/formatToMaxDecimals";

export enum CTPartsOttoSubpageSectionKey {
  DiscoveredPartsList = "discoveredPartsList",
  ViewSelectedPart = "viewSelectedPart",
}

export class CTPartsOttoSubpage extends EnchantedContainer {
  private readonly context = GameSingletons.getGameContext();

  private readonly dataService = new CenturyTrainPartsDataService();
  private readonly partsList: CenturyTrainPartEntity[] = [];

  private characterSprite?: MarketCharacter;
  private listBackground?: CTPartsListBackground;

  private selectedPartEntity: CenturyTrainPartEntity | null = null;
  private pageManager = new PageObjectManager(
    {
      [CTPartsOttoSubpageSectionKey.DiscoveredPartsList]: () => this.createPartsListSection(),
      [CTPartsOttoSubpageSectionKey.ViewSelectedPart]: () => this.createSelectedPartSection(),
    },
    this
  );

  public onSwitchShopkeeperClick?: () => void;

  async load() {
    await this.refreshData();
  }

  async initialize() {
    this.listBackground = this.addChild(new CTPartsListBackground());
    this.pageManager.setCurrentPage(CTPartsOttoSubpageSectionKey.DiscoveredPartsList);

    this.characterSprite = this.addChild(new MarketCharacter());
    this.characterSprite.addSwitchShopkeeperArrow(false, () => this.onSwitchShopkeeperClick?.());
    this.characterSprite.setCharacterPose(MarketCharacter.OttoPose.Idle);
    this.characterSprite.setCharacterName("Otto");
  }

  async refreshData() {
    const data = await this.dataService.getMyDiscoveredPartsList();

    this.partsList.length = 0;
    this.partsList.push(...data);
  }

  private createPartsListSection() {
    if (this.partsList.length < 1) {
      return new NoCtPartsSection();
    }

    const section = new CTPartsListSection(this.partsList);
    section.onPartSelected = partData => {
      this.selectedPartEntity = partData;
      this.pageManager.setCurrentPage(CTPartsOttoSubpageSectionKey.ViewSelectedPart);
    };
    return section;
  }

  private createSelectedPartSection() {
    const selectedPart = this.selectedPartEntity;
    if (!selectedPart) throw new Error("No selected part to view");

    const goBack = () => {
      this.selectedPartEntity = null;
      this.pageManager.setCurrentPage(CTPartsOttoSubpageSectionKey.DiscoveredPartsList);
    };

    const getButtonTextAndActionCallback = () => {
      if (selectedPart.canPurchase()) {
        return {
          labelText: `Purchase for  ${FontIcon.Tocium} ${formatToMaxDecimals(
            selectedPart.getCostWithDiscountApplied()
          )}`,
          actionCallback: () => this.performPurchase(selectedPart),
        };
      }
      if (selectedPart.canRedeem()) {
        return {
          labelText: `Redeem`,
          actionCallback: () => this.performPurchase(selectedPart, true),
        };
      }
      if (selectedPart.inventoryCount > 0) {
        return {
          labelText: `Go to The Mechanic`,
          actionCallback: () => this.onSwitchShopkeeperClick?.(),
        };
      }
    };

    const section = new SelectedPartSection(selectedPart);
    section.addSpeechBubble();
    section.onBackButtonClick = goBack;

    const buttonProperties = getButtonTextAndActionCallback();
    if (buttonProperties) {
      const { labelText, actionCallback } = buttonProperties;
      section.addActionButton(labelText, async () => {
        await actionCallback();
        goBack();
      });
    }

    return section;
  }

  private async performPurchase(partData: CenturyTrainPartEntity, redeemOnly: boolean = false) {
    const showSpinnerDuring = this.context.spinner.showDuring.bind(this.context.spinner);
    if (redeemOnly) {
      await showSpinnerDuring(this.dataService.redeemBetaBarrel());
    } else {
      await showSpinnerDuring(this.dataService.performPurchase(partData));
    }
    const updatePromise = Promise.all([this.refreshData(), this.context.userDataCtrl.updateAll()]);
    await this.context.modals.alert({ title: "Purchase Successful" });
    await showSpinnerDuring(updatePromise);
  }

  public async playShowAnimation() {
    await Promise.all([this.characterSprite?.playShowAnimation(), this.listBackground?.playShowAnimation()]);
  }

  public async playHideAnimation() {
    await this.pageManager.setCurrentPage(null);
    await Promise.all([this.characterSprite?.playHideAnimation(), this.listBackground?.playHideAnimation()]);
  }
}
