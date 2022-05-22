import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { Container, DisplayObject } from "@pixi/display";
import { Rectangle } from "@pixi/math";
import { AnimatedSprite } from "@pixi/sprite-animated";
import { Text } from "@pixi/text";
import { BitmapText, IBitmapTextStyle } from "@pixi/text-bitmap";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { PageObjectManager } from "@sdk-pixi/ui-helpers/PageObjectManager";
import { RailroaderDashPanelBase } from "../RailroaderDashPanelBase";
import { LeaderboardList } from "./LeaderboardList";
import { DataTimeframe } from "./LeaderboardsDataService";

const commonLabelStyle = {
  fill: "#FFFFFF",
  fontFamily: FontFamily.Default,
};

const headerTextCoordinates = [
  { x: 255, y: 292.5 },
  { x: 365, y: 292.5 },
  { x: 615, y: 292.5 },
];

const cogsCriteria: Array<string>[] = [
  ["Top 50", "Top 100", "Top 200"],
  ["Tocium Earnings", "Total Railruns"],
  ["Today", "This Week", "30 Days" /**, "All Time" **/],
  // For server performance reasons, we are not showing "All Time" in the leaderboard for now
];

export class LeaderboardCenterPanel extends RailroaderDashPanelBase {
  public clickCog?: (index: number, right: boolean) => unknown;
  selectedCriteriaIndices: Array<number> = [0, 0, 0];
  yellowPlaqueText: Array<Text | BitmapText> = [];

  headerTexts: Array<string> = ["Tocium", "Railruns"];

  private get selectedListSizeIndex() {
    return this.selectedCriteriaIndices[0];
  }
  private get selectedListBasisIndex() {
    return this.selectedCriteriaIndices[1];
  }
  private get selectedListTimeframeIndex() {
    return this.selectedCriteriaIndices[2];
  }

  private updateCurrentList?: () => unknown;

  init() {
    //// Logo image
    this.addTitleImage("ui-railroader-dashboard/page-leaderboards/img-leaderboards.png");

    /// Tables background
    this.addListPad();

    //// Navigation tabs
    this.addTabs(250, 225);

    //// Yellow plaque
    this.addYellowPlaque();

    //// Yellow plaque text
    this.addChild(this.createYellowPlaqueText(0, 805));

    //// Add cogs
    this.addChild(this.createCogs(280, 857.5, 0.5));

    //// Add clickCog function
    this.clickCog = (index: number, right: boolean) => {
      let indexDelta = right ? 1 : -1;
      let newIndex = this.selectedCriteriaIndices[index] + indexDelta;

      if (index === 1) {
        newIndex = newIndex % cogsCriteria[index].length;
      }
      //// Check if value exists
      if (cogsCriteria[index][newIndex] === undefined) {
        return;
      }

      //// Update lists
      this.selectedCriteriaIndices[index] = newIndex;
      this.yellowPlaqueText[index].text = cogsCriteria[index][newIndex];
      this.updateCurrentList?.();
    };
  }

  addTabs(x: number, y: number) {
    //// //// //// //// //// //// //// //// ////
    //// Navigation Tabs
    //// //// //// //// //// //// //// //// ////

    const tabs = this.componentFactory.createNavigationTabs(
      [
        { id: `railroaders`, label: `railroaders` },
        { id: `stations`, label: `stations` },
      ],
      24,
      160,
      160
    );
    this.addChild(tabs);
    tabs.position.set(x, y);

    tabs.events.on({
      tabSelected: (_, index) => {
        pageManager.setCurrentPage(index as 0 | 1);
      },
    });

    //// //// //// //// //// //// //// //// ////
    //// Pages
    //// //// //// //// //// //// //// //// ////

    const refreshList = (fillFunc: () => Promise<unknown>) => {
      GameSingletons.getSpinner().showDuring(fillFunc());
    };

    const pageManager = new PageObjectManager(
      {
        0: () => {
          const container = new Container();

          //// Header text
          const header = this.componentFactory.addHeaderText(
            16,
            headerTextCoordinates,
            [
              { id: `number`, label: `#` },
              { id: `account`, label: `account` },
              { id: `tocium`, label: `tocium` },
            ],
            commonLabelStyle
          );
          container.addChild(header);

          /// Leaderboard list
          const list = new LeaderboardList();
          list.position.set(210, 325);
          container.addChild(list);

          this.updateCurrentList = () => {
            this.updateHeaderText(header);
            refreshList(async () => {
              const { listBasis, listSize, listTimeframe } = this.getSelectedCriteria();
              switch (listBasis) {
                case "Tocium Earnings":
                  return await list.fillRailRoadersByTociumEarnings(listTimeframe, listSize);
                case "Total Railruns":
                  return await list.fillRailRoadersByTotalRailruns(listTimeframe, listSize);
              }
            });
          };
          this.updateCurrentList();

          return container;
        },
        1: () => {
          const container = new Container();

          //// Header text
          const header = this.componentFactory.addHeaderText(
            16,
            headerTextCoordinates,
            [
              { id: `number`, label: `#` },
              { id: `station `, label: `station` },
              { id: `tocium`, label: `tocium` },
            ],
            commonLabelStyle
          );
          container.addChild(header);

          /// Leaderboard list
          const list = new LeaderboardList();
          list.position.set(210, 325);
          container.addChild(list);

          this.updateCurrentList = () => {
            this.updateHeaderText(header);
            refreshList(async () => {
              const { listBasis, listSize, listTimeframe } = this.getSelectedCriteria();
              switch (listBasis) {
                case "Tocium Earnings":
                  return await list.fillStationsByTociumEarnings(listTimeframe, listSize);
                case "Total Railruns":
                  return await list.fillStationsByTotalRailruns(listTimeframe, listSize);
              }
            });
          };
          this.updateCurrentList();

          return container;
        },
      },
      this
    );

    tabs.setSelectedTabIndex(0);
  }

  createYellowPlaqueText(x: number = 0, y: number = 0, scale: number = 1) {
    console.log([
      this.constructor.name,
      cogsCriteria,
      // cogsCriteria[0],
      // this.selectedCriteriaIndices[0]
    ]);

    const container = new Container();
    //// Add yellow plaque quantity criteria
    const yellowPlaqueTextQuantity = new Text(cogsCriteria[0][this.selectedCriteriaIndices[0]], {
      fontFamily: FontFamily.DefaultThin,
      fontSize: 18,
      fill: 0xffffff,
    });
    yellowPlaqueTextQuantity.position.set(290, 8);
    container.addChild(yellowPlaqueTextQuantity);
    this.yellowPlaqueText.push(yellowPlaqueTextQuantity);
    //// Add yellow plaque main criteria
    const titleLabelStyle = {
      fontName: "Celestial Typeface",
      align: "center",
      fontSize: 30,
    } as IBitmapTextStyle;
    const yellowPlaqueTextMainCriteria = new BitmapText(
      cogsCriteria[1][this.selectedCriteriaIndices[1]],
      titleLabelStyle
    );
    yellowPlaqueTextMainCriteria.position.set(405, 0);
    container.addChild(yellowPlaqueTextMainCriteria);
    this.yellowPlaqueText.push(yellowPlaqueTextMainCriteria);
    //// Add yellow plaque time criteria
    const yellowPlaqueTextTimeframe = new Text(cogsCriteria[2][this.selectedCriteriaIndices[2]], {
      fontFamily: FontFamily.DefaultThin,
      fontSize: 18,
      fill: 0xffffff,
    });
    yellowPlaqueTextTimeframe.position.set(630, 8);
    container.addChild(yellowPlaqueTextTimeframe);
    this.yellowPlaqueText.push(yellowPlaqueTextTimeframe);

    container.position.set(x, y);
    container.scale.set(scale);
    return container;
  }

  createCogs(x: number = 0, y: number = 0, scale: number = 1) {
    const assets = GameSingletons.getResources();
    const ticker = GameSingletons.getTicker();
    const container = new Container();
    let startX = x;
    for (let i = 0; i < 3; i++) {
      //// Add cog slot
      const cogSlot = this.factory.createSprite(
        assets.getTexture("ui-railroader-dashboard/page-leaderboards/cog-slot.png"),
        {
          x: startX,
          y: y,
        }
      );
      cogSlot.scale.set(scale);
      container.addChild(cogSlot);

      //// Add left arrow
      const leftArrow = this.factory.createSprite(
        assets.getTexture("ui-railroader-dashboard/page-leaderboards/l-arrow.png"),
        {
          x: startX - 10,
          y: y + 8,
        }
      );
      leftArrow.scale.set(scale);
      container.addChild(leftArrow);

      //// Add events for cogs
      leftArrow.interactive = true;
      leftArrow.buttonMode = true;
      leftArrow.hitArea = new Rectangle(-80, -80, 160, 160);
      buttonizeDisplayObject(leftArrow, () => {
        if (this.clickCog) this.clickCog(i, false);
        cog.play();
        ticker.delay(0.2).then(() => cog.stop());
      });

      //// Add right arrow
      const rightArrow = this.factory.createSprite(
        assets.getTexture("ui-railroader-dashboard/page-leaderboards/r-arrow.png"),
        {
          x: startX + 167 / 2 + 4,
          y: y + 8,
        }
      );
      rightArrow.scale.set(scale);
      container.addChild(rightArrow);
      rightArrow.interactive = true;
      rightArrow.buttonMode = true;
      rightArrow.hitArea = new Rectangle(-80, -80, 160, 160);
      buttonizeDisplayObject(rightArrow, () => {
        if (this.clickCog) this.clickCog(i, true);
        cog.play();
        ticker.delay(0.2).then(() => cog.stop());
      });

      //// Add cog wheel
      const cogTextures = [
        assets.getTexture("ui-railroader-dashboard/page-leaderboards/gear-sprites/1.png"),
        assets.getTexture("ui-railroader-dashboard/page-leaderboards/gear-sprites/2.png"),
        assets.getTexture("ui-railroader-dashboard/page-leaderboards/gear-sprites/3.png"),
        assets.getTexture("ui-railroader-dashboard/page-leaderboards/gear-sprites/4.png"),
      ];
      const cog = new AnimatedSprite(cogTextures);
      cog.position.set(startX + 3, y - 3);
      cog.scale.set(scale - 0.2);
      container.addChild(cog);
      startX += 172;
    }

    return container;
  }

  getSelectedCriteria() {
    const listSizes = [50, 100, 200];
    const listTimeframes = [24, 24 * 7, 24 * 30] as DataTimeframe[];

    const listSize = listSizes[this.selectedListSizeIndex];
    const listTimeframe = listTimeframes[this.selectedListTimeframeIndex];

    const listBasis = cogsCriteria[1][this.selectedListBasisIndex];

    return { listSize, listTimeframe, listBasis };
  }

  updateHeaderText(header: Container) {
    const headerText = this.headerTexts[this.selectedCriteriaIndices[1]].toUpperCase();

    function updateText(object: DisplayObject | Text | undefined) {
      if (object === undefined) return;
      if (object instanceof Text) object.text = headerText;
      else console.error("Not a text object", object);
    }

    updateText(header?.children[2]);
  }
}
