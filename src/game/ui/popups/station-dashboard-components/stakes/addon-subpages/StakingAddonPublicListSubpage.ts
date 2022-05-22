import { GameSingletons } from "@game/app/GameSingletons";
import { calculateRelativeTimeDiffFromNow } from "@game/asorted/calculateRelativeTimeDiff";
import { formatTimeDurationHumanReadable } from "@game/asorted/formatTimeDurationHumanReadable";
import { CardEntity } from "@game/data/entities/CardEntity";
import { StakedCardInfo } from "@game/data/staking/models";
import { getStakingAddonDisplayProperties } from "../utils/getStakingAddonDisplayProperties";
import { BaseStakedAssetsListAddonPage } from "./BaseStakedAssetsListAddonPage";

export class StakingAddonPublicListSubpage extends BaseStakedAssetsListAddonPage {
  protected readonly isVIP: boolean = false;
  protected readonly titlePrefix = "Public Spots";

  async initialize() {
    await super.initialize();

    this.updateTitle(false);

    this.startAddingCards();

    const onStakedCardSelected = this.modals.tryCatch((info: StakedCardInfo) => {
      const data = this.getCardPreviewData(info);
      this.previewBox?.setPreviewCard(data);
      this.bottomBar.updateTextToInfoPublic({
        railRoader: info.tableData.owner.toUpperCase(),
        commission: "" + info.tableData.commission,
        expiry: formatTimeDurationHumanReadable(calculateRelativeTimeDiffFromNow(info.tableData.expire_time)),
      });
    });

    const bootStakedAsset = this.modals.tryCatch(async (cardData: CardEntity) => {
      const { addonDisplayName: displayName } = getStakingAddonDisplayProperties(this.addonType);

      const choice = await this.modals.confirm({
        title: `Unstake?`,
        content: `This will remove ${cardData.title.toUpperCase()}\nand free ${displayName.toUpperCase()} 1 public spot?`,
        acceptButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (!choice) return;

      const actionPromise = this.addonDataService.unstakeCard(
        cardData.assetId,
        GameSingletons.getIntergrationServices().contracts.currentUserName
      );
      await this.spinner.showDuring(actionPromise);

      this.previewBox.setPreviewCard(null);
      this.cardListBox.clearList();
      this.bottomBar.revertText(`Card removed from VIP whitelist.`);

      await this.updateTitle(true);
      await this.startAddingCards();
    });

    this.events.on({
      stakedCardSelected: onStakedCardSelected,
      bootStakedAsset: bootStakedAsset,
    });
  }
}
