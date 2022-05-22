import { delay } from "@sdk/utils/promises";

export class MockDataServiceUnlockTrains {
  constructor() {}

  async getTrainsData() {
    const data = {
      trainName: "CHOOBASTANK",
      totalRailruns: "435",
      distanceTraveled: "11,284",
      trainIndex: "1",
      unlockedCars: 3,
      conditionalMessage: "CHOOBASTANK NEEDS 1 MORE RAIL CAR UNLOCKED BEFORE YOU CAN UNLOCK AN ADDITIONAL TRAIN",
      nextTrainCost: "",
    };

    await delay(0.5);
    return data;
  }
}
