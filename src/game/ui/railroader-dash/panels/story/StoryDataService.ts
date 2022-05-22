import { __window__ } from "@debug/__";
import { __DEBUG__ } from "@debug/__DEBUG__";
import { GameSingletons } from "@game/app/GameSingletons";

export type StoryChapterData = {
  title: string;
  encounters: StoryEncounterData[];
};

export type StoryEncounterData = {
  releaseTime: Date;
  encounterId: string;
  name: string;
  distance: number;
  unlocked: boolean;
  reload: boolean;
};

export class StoryDataService {
  private readonly context = GameSingletons.getGameContext();

  async getTotalTravelDistance(since: Date) {
    const { contracts, historyDataCtrl, spinner } = this.context;

    if (__DEBUG__ && __window__.hackTravelDistance) return __window__.hackTravelDistance;

    const historyData = await spinner.showDuring(
      historyDataCtrl.api.getRailroaderStats(contracts.currentUserName, since.toISOString())
    );
    if (!historyData) {
      console.error("No history data found");
      return 0;
    }
    const { total_distance = 0 } = historyData;
    console.log({ total_distance });

    return total_distance;
  }

  async getStoryProgressData() {
    const { firebase } = this.context;
    const firestoreStoryConfiguration = await firebase.getStoryConfiguration();
    const firestoreUserData = await firebase.getUserData();
    console.log({ firestoreStoryConfiguration, firestoreUserData });

    const results = new Array<StoryChapterData>();

    for (const [encounter_id, { chapterName, name, startAt, minDistance, disabled }] of Object.entries(
      firestoreStoryConfiguration
    )) {
      if (disabled) continue;

      let chapter = results.find(c => c.title === chapterName);
      if (!chapter) {
        chapter = {
          title: chapterName,
          encounters: [],
        };
        results.push(chapter);
      }

      chapter.encounters.push({
        releaseTime: startAt?.toDate?.(),
        encounterId: encounter_id,
        name,
        distance: minDistance,
        unlocked: firestoreUserData.storyUnlocked?.[encounter_id] === true,
        reload: firestoreUserData.storyWatched?.[encounter_id] === true,
      });

      chapter.encounters.sort((a, b) => a.distance - b.distance);
    }

    results.sort((a, b) => (a.encounters[0]?.distance || 0) - (b.encounters[0]?.distance || 0));

    return results;
  }
}
