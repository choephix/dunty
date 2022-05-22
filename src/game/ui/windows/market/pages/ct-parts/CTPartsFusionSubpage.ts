import { GameSingletons } from "@game/app/GameSingletons";
import { PageObjectManager } from "@sdk-pixi/ui-helpers/PageObjectManager";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { CTPartsListBackground, CTPartsListSection, NoCtPartsSection, SelectedPartSection } from "./components";
import { FusionChooseLocoSection } from "./components/FusionChooseLocoSection";
import { MarketCharacter } from "./components/MarketCharacter";
import { CenturyTrainPartsDataService } from "./CTPartsDataService";
import { CenturyTrainPartEntity } from "./data/CenturyTrainPartEntity";

export enum CTPartsFusionSubpageSectionKey {
  OwnedPartsList = "discoveredPartsList",
  ViewSelectedPart = "viewSelectedPart",
  ChooseLocomotive = "chooseLocomotive",
}

export class CTPartsFusionSubpage extends EnchantedContainer {
  private readonly assets = GameSingletons.getResources();

  private readonly dataService = new CenturyTrainPartsDataService();
  private readonly partsList: CenturyTrainPartEntity[] = [];

  private characterSprite?: MarketCharacter;
  private listBackground?: CTPartsListBackground;

  private selectedPartEntity: CenturyTrainPartEntity | null = null;
  private pageManager = new PageObjectManager(
    {
      [CTPartsFusionSubpageSectionKey.OwnedPartsList]: () => this.createPartsListSection(),
      [CTPartsFusionSubpageSectionKey.ViewSelectedPart]: () => this.createSelectedPartSection(),
      [CTPartsFusionSubpageSectionKey.ChooseLocomotive]: () => this.createChooseLocoSection(),
    },
    this
  );

  public onSwitchShopkeeperClick?: () => void;

  async load() {
    await this.refreshData();
  }

  async initialize() {
    this.listBackground = this.addChild(new CTPartsListBackground());
    this.pageManager.setCurrentPage(CTPartsFusionSubpageSectionKey.OwnedPartsList);

    this.characterSprite = this.addChild(new MarketCharacter());
    this.characterSprite.addSwitchShopkeeperArrow(true, () => this.onSwitchShopkeeperClick?.());
    this.characterSprite.setCharacterPose(MarketCharacter.TheMechanicPose.Idle);
    this.characterSprite.setCharacterName("The Mechanic");

    this.load();
  }

  async refreshData() {
    const data = await this.dataService.getMyOwnedPartsList();

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
      this.pageManager.setCurrentPage(CTPartsFusionSubpageSectionKey.ViewSelectedPart);
    };
    return section;
  }

  private createSelectedPartSection() {
    const selectedPart = this.selectedPartEntity;
    if (!selectedPart) throw new Error("No selected part to view");

    const goBack = () => {
      this.selectedPartEntity = null;
      this.pageManager.setCurrentPage(CTPartsFusionSubpageSectionKey.OwnedPartsList);
    };

    const section = new SelectedPartSection(selectedPart);
    section.onBackButtonClick = goBack;
    section.addActionButton("Choose Loco", async () => {
      return this.pageManager.setCurrentPage(CTPartsFusionSubpageSectionKey.ChooseLocomotive);
    });

    return section;
  }

  private createChooseLocoSection() {
    if (!this.selectedPartEntity) throw new Error("No selected part entity defined");

    //// Loco selection
    const chooseLocomotiveSection = new FusionChooseLocoSection(this.selectedPartEntity);
    chooseLocomotiveSection.backButtonClick = async () => {
      await GameSingletons.getSpinner().showDuring(this.refreshData());

      this.selectedPartEntity = null;
      this.pageManager.setCurrentPage(CTPartsFusionSubpageSectionKey.OwnedPartsList);

      this.characterSprite?.setSpeechBubbleText(null);
      this.characterSprite?.setCharacterPose(this.assets.getTexture("ui-market-window-character/mechanic.png"));
    };

    this.characterSprite?.setSpeechBubbleText("That's a damn\n  fine Loco...");
    this.characterSprite?.setCharacterPose(
      this.assets.getTexture("ui-market-window-character/mechanic-loco select view.png")
    );
    return chooseLocomotiveSection;
  }

  public async playShowAnimation() {
    await Promise.all([this.characterSprite?.playShowAnimation(), this.listBackground?.playShowAnimation()]);
  }

  public async playHideAnimation() {
    await this.pageManager.setCurrentPage(null);
    await Promise.all([this.characterSprite?.playHideAnimation(), this.listBackground?.playHideAnimation()]);
  }
}
