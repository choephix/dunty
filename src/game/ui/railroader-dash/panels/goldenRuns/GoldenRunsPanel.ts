import { GameSingletons } from "@game/app/GameSingletons";
import { createPageObject } from "@game/asorted/functional-helpers/createPageObject";
import { FontFamily } from "@game/constants/FontFamily";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { Rectangle } from "@pixi/math";
import { Text } from "@pixi/text";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { PageObjectManager } from "@sdk-pixi/ui-helpers/PageObjectManager";
import { EventBus } from "@sdk/core/EventBus";
import { Color } from "@sdk/utils/color/Color";
import { RailroaderDashComponentFactory } from "../../RailroaderDashComponentFactory";
import { RailroaderDashPanelBase } from "../RailroaderDashPanelBase";
import { GoldenRunsDataService } from "./GoldenRunsDataService";
import { GoldenRunsList } from "./GoldenRunsList";
import { GoldenRunCheckResult } from "./models";
import { showGoldenRunCheckSuccessModal } from "./showGoldenRunCheckSuccessModal";

const commonLabelStyle = {
  fill: "#FFFFFF",
  fontFamily: FontFamily.Default,
};

enum SectionKey {
  GRSMembers = "grsMembers",
  MySubmissions = "mySubmissions",
}

export class GoldenRunsPanel extends RailroaderDashPanelBase {
  urlPrefix = "ui-railroader-dashboard/page-golden-runs";

  headerTextGRSMembers?: Container;
  headerTextMySubmissions?: Container;

  dataService: GoldenRunsDataService;

  constructor(public readonly componentFactory: RailroaderDashComponentFactory) {
    super(componentFactory);
    this.dataService = new GoldenRunsDataService();
  }

  async init() {
    const { spinner } = GameSingletons.getGameContext();

    this.addListPad();

    this.addTitleImage(`${this.urlPrefix}/title.png`);

    this.addTabs();

    const textureId = `${this.urlPrefix}/info-panel-golden-runs.png`;
    const message = "Did you know that Golden Run hints are scattered\nthroughout the Centuryverse?";
    this.addGreenPlaque({ textureId, message });
  }

  addTabs() {
    //// //// //// //// //// //// //// //// ////
    //// Navigation Tabs
    //// //// //// //// //// //// //// //// ////
    const tabs = this.createNavigationTabs(24, 160, 160);
    this.addChild(tabs);
    tabs.position.set(255, 237);

    tabs.events.on({
      tabSelected: (_, index) => {
        const pageKey = [SectionKey.GRSMembers, SectionKey.MySubmissions][index];
        pageManager.setCurrentPage(pageKey ?? null);
      },
    });

    //// //// //// //// //// //// //// //// ////
    //// Pages
    //// //// //// //// //// //// //// //// ////

    const pageManager = new PageObjectManager(
      {
        [SectionKey.GRSMembers]: (): Container => {
          const container = new Container();

          // Header text
          this.headerTextGRSMembers = this.componentFactory.addHeaderText(
            16,
            [
              { x: 578, y: 295 },
              { x: 280, y: 295 },
            ],
            [
              { id: `railroader`, label: `Railroader` },
              { id: `conductor`, label: `Conductor` },
            ],
            commonLabelStyle
          );
          container.addChild(this.headerTextGRSMembers);

          // GRS Members list
          const list = new GoldenRunsList();
          list.position.set(210, 325);
          container.addChild(list);

          createPageObject(
            {
              load: () => this.dataService.getGRSMembersTestData(),
              initialize: data => list.addGRSMemebersRows(data, 20),
            },
            container
          );

          return container;
        },
        [SectionKey.MySubmissions]: (): Container => {
          const { modals, spinner } = GameSingletons.getGameContext();

          const container = createPageObject({
            load: () => this.dataService.getMySubmissionsTestData(),
            initialize: data => list.addMySubmissionsRows(data, 14),
          });

          // Header text
          this.headerTextMySubmissions = this.componentFactory.addHeaderText(
            16,
            [
              { x: 623, y: 295 },
              { x: 443, y: 295 },
              { x: 289, y: 295 },
            ],
            [
              { id: "gRSAction", label: "GRS Action" },
              { id: "arrivalTime", label: "Arrival Time" },
              { id: "train", label: "Train" },
            ],
            commonLabelStyle
          );
          container.addChild(this.headerTextMySubmissions);

          /// My Submissions list
          const list = new GoldenRunsList();
          list.position.set(210, 325);
          list.onSubmitClick = async transactionId => {
            const dataService = new GoldenRunsDataService();
            const status = await spinner.showDuring(dataService.checkTransactionForGoldenRun(transactionId));

            if (status === GoldenRunCheckResult.GoldenRun) {
              await showGoldenRunCheckSuccessModal(this);
            } else {
              await modals.goldenRunSorry();
            }

            list?.content.removeChildren();

            const data = await spinner.showDuring(Promise.resolve(container.load?.()));
            await spinner.showDuring(Promise.resolve(container.initialize?.(data!)));
          };
          container.addChild(list);

          return container;
        },
      },
      this
    );

    tabs.setSelectedTabIndex(0);
  }

  createNavigationTabs(fontSize: number, tabWidth: number, tabSpace: number) {
    //// Service

    const tabsData = [
      { id: `grsMembers`, label: `GRS Members` },
      { id: `submit`, label: `Submit` },
    ];
    type TabData = typeof tabsData[number];

    //// UI Component

    const TAB_WIDTH = tabWidth;
    const createTab = (tabData: TabData) => {
      const tab = new Container();

      const label = new Text(tabData.label.toUpperCase(), {
        ...commonLabelStyle,
        fontSize: fontSize,
      });
      label.x = 0.5 * (TAB_WIDTH - label.width);
      tab.addChild(label);

      const underlineWidth = TAB_WIDTH;
      function createUnderline(color: number) {
        const underline = new Graphics();
        underline.lineStyle(8, color);
        underline.moveTo(0, 0);
        underline.lineTo(underlineWidth, 0);
        underline.pivot.set(0.5 * TAB_WIDTH, 0);
        underline.position.set(0.5 * TAB_WIDTH, label.height + 12);
        return underline;
      }
      const underlineNormal = tab.addChild(createUnderline(0xffffff));
      const underlineActive = tab.addChild(createUnderline(Color.CYAN.toInt()));
      function setActive(active: boolean) {
        underlineNormal.alpha = 0.1;
        underlineNormal.visible = !active;
        underlineActive.visible = active;
      }

      tab.interactive = true;
      tab.buttonMode = true;

      setActive(false);

      return Object.assign(tab, {
        label,
        underlineNormal,
        underlineActive,
        setActive,
        hitArea: new Rectangle(0, 0, TAB_WIDTH, tab.height),
      });
    };

    const tabs = tabsData.map(createTab);

    const containerBase = new Container();
    const container = Object.assign(containerBase, {
      tabsData,
      tabs,
      selectedTabIndex: 0,
      events: new EventBus<{
        tabSelected: (tabsData: TabData, index: number) => void;
      }>(),
      getSelectedTabData() {
        return tabsData[container.selectedTabIndex];
      },
      getSelectedTabComponent() {
        return tabs[container.selectedTabIndex];
      },
      setSelectedTabIndex: (index: number) => {
        container.getSelectedTabComponent().setActive(false);
        container.selectedTabIndex = index;
        container.getSelectedTabComponent().setActive(true);
        container.events.dispatch("tabSelected", tabsData[index], index);
      },
    });

    for (const [index, tab] of tabs.entries()) {
      container.addChild(tab);
      tab.position.set(index * (TAB_WIDTH + tabSpace), 0);
      buttonizeDisplayObject(tab, () => container.setSelectedTabIndex(index));
    }

    return container;
  }
}
