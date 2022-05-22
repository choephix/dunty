import { GameSingletons } from "@game/app/GameSingletons";
import { ActionName, ContractName } from "@sdk-integration/contracts";

export class UnlockTrainsDataService {
  private readonly context = GameSingletons.getGameContext();

  calculateNextTrainCost(trainsAlreadyUnlocked = this.context.userData.trains.size) {
    if (trainsAlreadyUnlocked == 0) return 0;

    const { trainPriceBase, trainPriceCap } = this.context.gameConfigData;
    if (trainsAlreadyUnlocked == 1) return trainPriceBase;

    const p_multiplier = trainsAlreadyUnlocked * (trainsAlreadyUnlocked + 1);
    const nextPrice = trainPriceBase * p_multiplier;
    return Math.min(nextPrice, trainPriceCap);
  }

  async getTrainsData() {
    const currentTrains = [...this.context.userData.trains.values()].sort((a, b) => a.extraSlots.rc - b.extraSlots.rc);
    const latestTrain = currentTrains[0];

    const minimumExtraRailCarSlotsForNextTrain = 3;
    const missingExtraRailCarSlots = minimumExtraRailCarSlotsForNextTrain - latestTrain.unlockedExtraRailCarSlotsCount;

    const nextTrainCostInTocium = this.calculateNextTrainCost();
    const canUnlockNext = missingExtraRailCarSlots <= 0;

    const logs = await this.context.historyDataCtrl.api.getRailroaderStats(
      this.context.userData.name,
      "2021-08-11T21:00:00.000Z",
      latestTrain.name
    );

    return {
      trainName: latestTrain.name,
      totalRailruns: `${logs?.total_transports ?? "N/A"}`,
      distanceTraveled: `${logs?.total_distance ?? "N/A"}`,
      trainNumber: currentTrains.length,
      unlockedCars: latestTrain.unlockedTotalRailCarSlotsCount,
      nextTrainCost: nextTrainCostInTocium,
      missingExtraRailCarSlots: missingExtraRailCarSlots,
      canUnlockNext: canUnlockNext,
    };
  }

  async unlockNextTrain(trainName: string) {
    const { contracts } = this.context;
    const costAmount = this.calculateNextTrainCost();
    const costField = `${costAmount.toFixed(4)} TOCIUM`;
    await contracts.actions.performActionTransactions([
      [
        ActionName.Transfer,
        {
          from: contracts.currentUserName,
          to: ContractName.M,
          quantity: costField,
          memo: "DEPOSIT|" + contracts.currentUserName,
        },
        ContractName.Toc,
      ],
      [
        ActionName.CreateTrain,
        {
          century: contracts.currentCenturyName,
          railroader: contracts.currentUserName,
          train: trainName,
        },
        ContractName.RR,
      ],
    ]);
  }
}
