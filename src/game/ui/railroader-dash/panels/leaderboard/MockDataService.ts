import { GameContext } from "@game/app/app";
import { FontIcon } from "@game/constants/FontIcon";
import { delay } from "@sdk/utils/promises";

export class MockDataService {
  constructor() {}

  async getRailRoadersByTociumEarnings(): Promise<
    {
      placement: string;
      name: string;
      tocium: string;
    }[]
  > {
    const mockData: Array<{
      placement: string;
      name: string;
      tocium: string;
    }> = [
      {
        placement: "1",
        name: "h11y4.wam",
        tocium: "15,000",
      },
      {
        placement: "2",
        name: "h22rc.wam",
        tocium: "13821",
      },
      {
        placement: "3",
        name: "h2ac.wam",
        tocium: "12984",
      },
      {
        placement: "4",
        name: "gzzra.wam",
        tocium: "11100",
      },
      {
        placement: "5",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "6",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "7",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "8",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "9",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "10",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "11",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "12",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "13",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "14",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "15",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "16",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "17",
        name: "gx3r2.wam",
        tocium: "850",
      },
    ];
    await delay(0.5);
    return mockData;
  }
  async getRailRoadersByTotalRailruns(): Promise<
    {
      placement: string;
      name: string;
      tocium: string;
    }[]
  > {
    const mockData: Array<{
      placement: string;
      name: string;
      tocium: string;
    }> = [
      {
        placement: "1",
        name: "h11y4.wam",
        tocium: "15,000",
      },
      {
        placement: "2",
        name: "h22rc.wam",
        tocium: "13821",
      },
      {
        placement: "3",
        name: "h2ac.wam",
        tocium: "12984",
      },
      {
        placement: "4",
        name: "gzzra.wam",
        tocium: "11100",
      },
      {
        placement: "5",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "6",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "7",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "8",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "9",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "10",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "11",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "12",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "13",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "14",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "15",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "16",
        name: "gx3r2.wam",
        tocium: "850",
      },
      {
        placement: "17",
        name: "gx3r2.wam",
        tocium: "850",
      },
    ];
    await delay(0.5);
    return mockData;
  }
  async getStationsByTociumEarnings(): Promise<
    {
      placement: string;
      name: string;
      tocium: string;
    }[]
  > {
    const mockData: Array<{
      placement: string;
      name: string;
      tocium: string;
    }> = [
      {
        placement: "1",
        name: "CHOOEXPRESS",
        tocium: "15,000",
      },
      {
        placement: "2",
        name: "CHOOEXPRESS",
        tocium: "13821",
      },
      {
        placement: "3",
        name: "CHOOEXPRESS",
        tocium: "12984",
      },
      {
        placement: "4",
        name: "CHOOEXPRESS",
        tocium: "11100",
      },
      {
        placement: "5",
        name: "CHOOEXPRESS",
        tocium: "850",
      },
      {
        placement: "6",
        name: "CHOOEXPRESS",
        tocium: "850",
      },
      {
        placement: "7",
        name: "CHOOEXPRESS",
        tocium: "850",
      },
      {
        placement: "8",
        name: "CHOOEXPRESS",
        tocium: "850",
      },
      {
        placement: "9",
        name: "CHOOEXPRESS",
        tocium: "850",
      },
      {
        placement: "10",
        name: "CHOOEXPRESS",
        tocium: "850",
      },
      {
        placement: "11",
        name: "CHOOEXPRESS",
        tocium: "850",
      },
      {
        placement: "12",
        name: "CHOOEXPRESS",
        tocium: "850",
      },
      {
        placement: "13",
        name: "CHOOEXPRESS",
        tocium: "850",
      },
      {
        placement: "14",
        name: "CHOOEXPRESS",
        tocium: "850",
      },
      {
        placement: "15",
        name: "CHOOEXPRESS",
        tocium: "850",
      },
      {
        placement: "16",
        name: "CHOOEXPRESS",
        tocium: "850",
      },
      {
        placement: "17",
        name: "CHOOEXPRESS",
        tocium: "850",
      },
    ];
    await delay(0.5);
    return mockData;
  }
  async getStationsByTotalRailruns() {
    const mockData: Array<{
      placement: string;
      name: string;
      tocium: string;
    }> = [];
    await delay(0.5);
    return mockData;
  }

  async getStakedListData(context: GameContext) {
    const allStations = [...context.mapData.stationsArray];
    const allCards = [...context.userData.cards.values()];
    const testData = [];
    for (let card in allCards) {
      testData.push({
        station: allStations[card],
        info: {
          startDate: "March 12, 2022",
          endDate: "March 26, 2022",
          rate: `${FontIcon.Tocium} 3 per hour`,
          claimable: `${FontIcon.Tocium} 34.2789`,
          isVip: Math.random() < 0.5 ? true : false,
        },
        card: allCards[card],
      });
    }
    return testData;
  }
}
