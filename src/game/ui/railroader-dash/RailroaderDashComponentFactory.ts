import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { ThemeColors } from "@game/constants/ThemeColors";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { Rectangle } from "@pixi/math";
import { Text } from "@pixi/text";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { EventBus } from "@sdk/core/EventBus";

const commonLabelStyle = {
  fill: "#FFFFFF",
  fontFamily: FontFamily.Default,
};

export class RailroaderDashComponentFactory {
  private readonly context: GameContext = GameSingletons.getGameContext();

  addHeaderText(
    fontSize: number,
    coordinates: Array<{ x: number; y: number }>,
    textData: Array<{ id: string; label: string }>,
    commonLabelStyle: {
      fill: string;
      fontFamily: FontFamily;
    }
  ) {
    const container = new Container();

    for (let text in textData) {
      const label = new Text(textData[text].label.toUpperCase(), {
        ...commonLabelStyle,
        fontSize: fontSize,
      });
      label.position.set(coordinates[text].x, coordinates[text].y);
      container.addChild(label);
    }
    return container;
  }

  createNavigationTabs<T extends { id: string; label: string }>(
    tabsData: Array<T>,
    fontSize: number,
    tabWidth: number,
    tabSpace: number
  ) {
    //// Service

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

      const underlineWidth = TAB_WIDTH; // label.width
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
      const underlineActive = tab.addChild(createUnderline(ThemeColors.HIGHLIGHT_COLOR.toInt()));
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
