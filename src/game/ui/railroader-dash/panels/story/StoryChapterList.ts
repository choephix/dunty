import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { playStoryEncounterCinematic } from "@game/gameplay/playStoryEncounterCinematic";
import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { SafeScrollbox } from "@sdk-pixi/display/SafeScrollbox";
import { RailroaderDashPanelType } from "../models";
import { StoryChapterListItem } from "./StoryChapterListItem";
import { StoryChapterData } from "./StoryDataService";

export class StoryChaptersList extends SafeScrollbox {
  private readonly context: GameContext = GameSingletons.getGameContext();

  public play: (encounter_id: string, isReplay: boolean) => void;

  constructor() {
    super({
      noTicker: true,
      boxWidth: 555,
      boxHeight: 425,
      stopPropagation: true,
      divWheel: GameSingletons.getGameContext().app.view,
      overflowX: "none",
    });

    const { spinner, input, firebase } = this.context;
    this.play = async (encounter_id: string, isReplay: boolean) => {
      await input.dispatch("closeRailRoaderDashboard");
      await playStoryEncounterCinematic(encounter_id, false);
      if (!isReplay) {
        const setUserStoryWatched = spinner.bindSpinner(firebase.setUserStoryWatched);
        await setUserStoryWatched(encounter_id);
      }
      await input.dispatch("openRailRoaderDashboard", RailroaderDashPanelType.Story);
    };
  }

  addChapters(data: StoryChapterData[]) {
    let startY = 10;
    for (const index in data) {
      const chapter = new StoryChapterListItem(data[index], this.play);
      chapter.y = startY;
      this.addChild(chapter);
      startY += chapter.height + 9;
    }
    this.content.addChild(this.addInvisibleBox(426));
    this.update();
  }

  addInvisibleBox(px: number) {
    const box = new Sprite(Texture.EMPTY);
    box.width = this.boxWidth + 1;
    box.height = px;
    return box;
  }

  clearData() {
    const children = [...this.content.children];
    for (const child of children) {
      /**
       * The only exception is the invisible box, which we
       * don't want to destroy.
       */
      child.destroy({ children: true });
    }
  }
}
