import { GameSingletons } from "@game/app/GameSingletons";
import * as WAX from "@sdk-integration/contracts";
import { AssetId } from "@sdk-integration/contracts";

const redeemableTexturePrefix = "ui-railroader-dashboard/inventory/redeemables/";
const redeemableIpfsHashToTextureIdSuffix: Record<string, string> = {
  QmUZxKHiX5DtpHq2ae734F299n2id3S6xkp9uA2dfi2mdm: "1-cv.png",
  QmZSQ2qRaqxG3uxDb9AwNnokiUjS5TB45hLoP8fQAbtQEt: "2-cv.png",
  QmYsTmBTod912VQxhQawD9WALsGw3KrZdU1dXnJzFfgfzb: "6-cv.png",
  QmXZFB9vw2GhDFYe5L7T3D4guRyzJKakgf15UWnmks1NWL: "12-cv.png",
  QmYr5DTZtJoHgnD2i47sqGZ5mMMx4xZo5UQQ9hpPhSE94m: "18-cv.png",
  QmXQ9HW5aUCQEU8BtYFWJviZSHkPAdaWNKRcutjEZRcee4: "100-fuel.png",
  QmNWk2BgZw9X1AG7qvfjwpb2i6WpyL3TaN1TAC3aMTn6tF: "500-fuel.png",
  QmbRKF7ivXPB4LwSyuWjCroTRUC465ZBuToTNv2KELgSDo: "1000-fuel.png",
  QmSRYYzSWqTeMCq4U3aqesVDknnpTrkZMeaMWX8XpGQieJ: "2000-fuel.png",
  QmaiFTAcc8AmEjoRqZW8BWw1EsYxMBR4DYgxD4anbMUvBL: "5000-fuel.png",
};

export class InventoryDataService {
  getRedeemableAssets() {
    const { userData } = GameSingletons.getGameContext();
    return userData.redeemableAssets.map(asset => {
      const { asset_id, data } = asset;
      const textureIdSuffix = redeemableIpfsHashToTextureIdSuffix[data.img];
      return {
        assetId: asset_id,
        name: data.name,
        textureId: textureIdSuffix ? redeemableTexturePrefix + textureIdSuffix : "",
      };
    });
  }

  async redeemAsset(assetId: AssetId) {
    const { contracts, userDataCtrl, spinner } = GameSingletons.getGameContext();

    await spinner.showDuring(
      contracts.actions.performActionTransactions([
        [
          WAX.ActionName.Transfer,
          {
            from: contracts.currentUserName,
            to: WAX.ContractName.M,
            asset_ids: [+assetId],
            memo: "",
          },
          WAX.ContractName.AtomicAssets,
        ],
      ])
    );

    await spinner.showDuring(userDataCtrl.updateAll());
  }
}
