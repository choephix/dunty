import { GameSingletons } from "@game/app/GameSingletons";
import { ThemeColors } from "@game/constants/ThemeColors";
import { fitObjectInRectangle } from "@sdk-pixi/layout/fitObjectInRectangle";
import { RailroaderDashPanelBase } from "../RailroaderDashPanelBase";
import { StoryChaptersList } from "./StoryChapterList";
import { StoryDataService } from "./StoryDataService";

export class StoryCentralPanel extends RailroaderDashPanelBase {
  dataService = new StoryDataService();

  async init(): Promise<void> {
    const { assets, simpleFactory, spinner } = GameSingletons.getGameContext();

    this.addGreenPlaque({
      textureId: "ui-railroader-dashboard/page-story/panel-story.png",
      message: "The DISTANCE TRAVELED stat is the sum total\nfrom all your unlocked trains.",
    });

    //// Add title
    this.addTitleImage("ui-railroader-dashboard/page-story/label-story.png");

    //// Add list background
    const listPad = this.addListPad();

    //// Distance slot
    const distanceSlotTextureId = assets.getTexture("ui-railroader-dashboard/page-story/distance slot.png");
    const distanceSlot = simpleFactory.createSprite(distanceSlotTextureId, { x: 295, y: 235 });
    distanceSlot.scale.set(0.75);
    this.addChild(distanceSlot);

    //// Add header text
    const chapterText = simpleFactory.createText("CHAPTER", { fontSize: 18 }, { x: 65, y: -18 });
    listPad.addChild(chapterText);
    const encounterText = simpleFactory.createText("ENCOUNTER", { fontSize: 18 }, { x: 225, y: -18 });
    listPad.addChild(encounterText);
    const distReqText = simpleFactory.createText("DISTANCE REQ", { fontSize: 18 }, { x: 400, y: -18 });
    listPad.addChild(distReqText);

    const data_Chapters = await spinner.showDuring(this.dataService.getStoryProgressData());

    //// Add Chapter list
    const list = new StoryChaptersList();
    list.position.set(210, 325);
    list.addChapters(data_Chapters);
    this.addChild(list);

    const campaignStartTime = data_Chapters[0]?.encounters[0]?.releaseTime;
    const data_Distance = await spinner.showDuring(this.dataService.getTotalTravelDistance(campaignStartTime));
    this.setDistance(data_Distance);
  }

  setDistance(distanceVal: string) {
    const simpleFactory = GameSingletons.getSimpleObjectFactory();

    //// Add distance
    const highlightColor = ThemeColors.HIGHLIGHT_COLOR_LIGHT2.toInt();
    const contentString = "DISTANCE TRAVELED " + distanceVal;
    const distance = simpleFactory.createText(contentString, { fill: highlightColor, fontSize: 22 });
    distance.anchor.set(0.5);
    this.addChild(distance);
    fitObjectInRectangle(distance, {
      x: 340,
      y: 240,
      width: 300,
      height: 30,
    });
  }
}
