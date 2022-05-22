import { GameSingletons } from "@game/app/GameSingletons";
import { StakingAddonType } from "@game/asorted/StakingType";
import { getCardPreviewTextureUrl } from "@game/cards/getCardPreview";
import { CardEntity } from "@game/data/entities/CardEntity";
import { StakedCardInfo } from "@game/data/staking/models";
import { StakingAddonDataHelper } from "@game/data/staking/StakingAddonDataHelper";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { EventBus } from "@sdk/core/EventBus";
import { BaseStakingAddonPage } from "./BaseStakingAddonPage";
import { BottomBarTripple } from "./components/BottomBarTripple";
import { StakedCardPreview, StakedCardPreviewData } from "./components/StakedCardPreview";
import { StakedCardsList } from "./components/StakedCardsList";

export abstract class BaseStakedAssetsListAddonPage extends BaseStakingAddonPage {
  protected abstract readonly isVIP: boolean;
  protected abstract readonly titlePrefix: string;
  public subpageTitle = "Public Spots";

  public readonly events = new EventBus<{
    stakedCardSelected: (card: StakedCardInfo) => void;
    bootStakedAsset: (cardData: CardEntity) => void;
  }>();

  protected bottomBar!: BottomBarTripple;
  protected previewBox!: StakedCardPreview;
  protected cardListBox!: StakedCardsList;

  async initialize(): Promise<void> {
    this.cardListBox = this.addCardListBox();
    this.previewBox = this.addCardPreviewBox();

    this.bottomBar = new BottomBarTripple();
    this.addChild(this.bottomBar);

    this.enchantments.watch(
      () => this.cardListBox.selectedCardSlot,
      slot => {
        if (slot) {
          this.cardListBox.content.scale.set(1);
          this.cardListBox.boxWidth = 725;
          this.previewBox.visible = true;
        } else {
          this.cardListBox.content.scale.set(1.5);
          this.cardListBox.boxWidth = 1080;
          this.previewBox.visible = false;

          const schema = this.addonType === StakingAddonType.ConductorLounge ? "conductor" : "locomotive";
          this.bottomBar.setSingularTextBoxMessage(`Select a ${schema} for more information`);
        }
      },
      true
    );

    await super.initialize();
  }

  async updateTitle(reloadData: boolean) {
    this.subpageTitle = this.titlePrefix + ` ...`;

    if (reloadData) {
      await this.refreshAddonData();
    }

    const getOpenSpots = () => {
      if (this.isVIP) {
        return this.addonData.vipSpotsMax - this.addonData.vipSpotsUsed;
      } else {
        return this.addonData.publicSpotsMax - this.addonData.publicSpotsUsed;
      }
    };
    const openSpots = getOpenSpots();

    this.subpageTitle = this.titlePrefix + ` - ${openSpots} open`;
  }

  getCardPreviewData(info: StakedCardInfo): StakedCardPreviewData {
    return {
      texturePath: getCardPreviewTextureUrl(info.card),
      tociumPerHour: StakingAddonDataHelper.getCardCommissionRate(info.card),
      cardEntity: info.card,
      owned: info.owned,
    };
  }

  async startAddingCards() {
    if (!this.cardListBox) throw new Error("No card list set");
    this.cardListBox.setCardsAsync(this.iterateStakedCardInfos());
  }

  async *iterateStakedCardInfos() {
    const apiPromise = this.addonDataService.getStakedCardsData(this.station.assetId, this.isVIP);
    const stakedAssets = await this.spinner.showDuring(apiPromise);
    for (const tableData of stakedAssets) {
      const cardEntity = await CardEntity.fromAssetId(tableData.asset_id);
      cardEntity.data.owner = tableData.owner;

      yield {
        tableData: tableData,
        card: cardEntity,
        owned: tableData.owner === GameSingletons.getDataHolders().userData.name,
      };
    }
  }

  addCardListBox() {
    const cardListBox = new StakedCardsList(this.events);
    cardListBox.name = "previewBox";
    cardListBox.scale.set(0.5);
    cardListBox.position.set(65, 125);
    return this.addChild(cardListBox);

    // this.scale.set(0.5);
  }

  addCardPreviewBox() {
    const previewBox = new StakedCardPreview(this.isVIP);
    previewBox.name = "previewBox";
    previewBox.scale.set(0.425);
    previewBox.position.set(440, 100);
    previewBox.onClickBoot = cardEntity => this.events.dispatch("bootStakedAsset", cardEntity);
    return this.addChild(previewBox);
  }

  addBackArrow() {
    const container = new Container();
    const arr = new Sprite(this.assets.getTexture("ui-station-dashboard/staking/manage-tab/manage-home/btn-back.png"));
    container.addChild(arr);
    container.position.set(40, 230);
    container.scale.set(0.5);
    container.interactive = true;
    container.buttonMode = true;
    this.addChild(container);
  }

  clearChildren(container: Container) {
    const children = [...container.children];
    for (const child of children) {
      child.destroy({ children: true });
    }
  }
}
