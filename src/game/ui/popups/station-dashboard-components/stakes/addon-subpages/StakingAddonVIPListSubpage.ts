import { GameSingletons } from "@game/app/GameSingletons";
import { calculateRelativeTimeDiffFromNow } from "@game/asorted/calculateRelativeTimeDiff";
import { formatTimeDurationHumanReadable } from "@game/asorted/formatTimeDurationHumanReadable";
import { CardEntity } from "@game/data/entities/CardEntity";
import { StakedCardInfo } from "@game/data/staking/models";
import { getStakingAddonDisplayProperties } from "../utils/getStakingAddonDisplayProperties";
import { BaseStakedAssetsListAddonPage } from "./BaseStakedAssetsListAddonPage";

export class StakingAddonVIPListSubpage extends BaseStakedAssetsListAddonPage {
  protected readonly isVIP: boolean = true;
  protected readonly titlePrefix = "VIP Spots";

  async initialize() {
    await super.initialize();

    this.updateTitle(false);

    this.startAddingCards();

    const onStakedCardSelected = this.modals.tryCatch((info: StakedCardInfo) => {
      const data = this.getCardPreviewData(info);
      this.previewBox?.setPreviewCard(data);
      this.bottomBar.updateTextToInfoVIP({
        railRoader: info.tableData.owner.toUpperCase(),
        commission: "" + info.tableData.commission,
        timeStaked: formatTimeDurationHumanReadable(calculateRelativeTimeDiffFromNow(info.tableData.staked_time)),
      });
    });

    const bootStakedAsset = this.modals.tryCatch(async (cardData: CardEntity) => {
      const { addonDisplayName: displayName } = getStakingAddonDisplayProperties(this.addonType);

      const isCardMine = cardData.owner === GameSingletons.getIntergrationServices().contracts.currentUserName;

      const choice = await this.modals.confirm({
        title: `Boot?`,
        content:
          `${cardData.title.toUpperCase()}` +
          (!isCardMine
            ? `This will also decrease ${cardData.owner}'s\n${displayName.toUpperCase()} spots by one.`
            : ""),
        acceptButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (!choice) return;

      const actionPromise = this.addonDataService.removeCardFromVIPWhitelist(
        cardData.assetId,
        cardData.owner,
        this.station.assetId
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
