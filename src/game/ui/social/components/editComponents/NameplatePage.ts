import { Container } from "@pixi/display";
import { arrangeInStraightLine } from "@sdk-pixi/layout/arrangeInStraightLine";
import { NavigationTabsManager } from "@sdk-pixi/ui-helpers/NavigationTabsManager";
import { PageObjectManager } from "@sdk-pixi/ui-helpers/PageObjectManager";
import { AvatarBadgeElements } from "@game/ui/social/avatar/AvatarBadgeElements";
import { AvatarBadgePreferencesController } from "../AvatarBadgePreferencesController";
import { ColorPicker } from "./ColorPicker";
import { InnerNameplate } from "./InnerNameplate";
import { OuterRim } from "./OuterRim";
import { UnderlinedTabButton } from "./UnderlinedTabButton";

enum PageKey {
  Base = 0,
  Rim = 1,
}

export class NameplatePage extends Container {
  onItemSelected?: (itemType: PageKey) => unknown;

  constructor(private readonly avatarCtrl: AvatarBadgePreferencesController) {
    super();

    //// Color picker
    const colorPicker = new ColorPicker();
    colorPicker.position.set(850, 15);
    this.addChild(colorPicker);

    //// Navigation
    const panel = this.createItemButtons();
    panel.position.set(275, 25);
    this.addChild(panel);

    //// Page manager
    const pageContainer = new Container();
    this.addChild(pageContainer);

    const pageManager = new PageObjectManager(
      {
        [PageKey.Base]: () => {
          const innerNameplate = new InnerNameplate();
          innerNameplate.addPlate("base-1");
          innerNameplate.scale.set(0.5);
          innerNameplate.position.set(475, 175);
          return innerNameplate;
        },
        [PageKey.Rim]: () => {
          const data = [];
          for (let rim of AvatarBadgeElements.NameplateRims) {
            data.push(AvatarBadgeElements.getNameplateTextureId(rim));
          }
          const currentRim = this.avatarCtrl.avatar.getCurrentConfiguration().nameplateFrame;
          const outerRim = new OuterRim();
          outerRim.addRims(
            AvatarBadgeElements.getSortedData(
              AvatarBadgeElements.NameplateRims,
              AvatarBadgeElements.canUserUseNameplateRim
            ),
            currentRim
          );
          outerRim.position.set(275, 100);
          outerRim.onRimSelected = (rim: string) => {
            avatarCtrl.preferences.nameplateRimImage = rim;
          };
          return outerRim;
        },
      },
      pageContainer
    );
    pageManager.setCurrentPage(0);
    //// Add events
    this.onItemSelected = (key: PageKey) => {
      pageManager.setCurrentPage(key);
    };

    colorPicker.onColorSelected = (color: number) => {
      if (pageManager.currentPageKey == PageKey.Base) {
        (pageManager.currentPage as InnerNameplate).setTintColor(color);
        avatarCtrl.preferences.nameplateBaseColor = color;
      } else {
        (pageManager.currentPage as OuterRim).changeColor(color);
        avatarCtrl.preferences.nameplateRimColor = color;
      }
    };
  }

  createItemButtons() {
    const tabButtonsContainer = new Container();
    this.addChild(tabButtonsContainer);
    const addTabButton = (label: string) => {
      const button = new UnderlinedTabButton(label, 50);
      tabButtonsContainer.addChild(button);
      return button;
    };
    const tabsConfiguration = NavigationTabsManager.tabOptionsFromDictionary({
      [PageKey.Base]: addTabButton("Base"),
      [PageKey.Rim]: addTabButton("Rim"),
    });

    arrangeInStraightLine(tabButtonsContainer.children, { spacing: 100 });

    const tabsManager = new NavigationTabsManager(tabsConfiguration, {
      setSelected(tab, selected) {
        tab.setHighlighted(selected);
      },
    });
    tabsManager.onSelectionChange = key => {
      this.onItemSelected?.(key);
    };
    tabsManager.setSelectedTabIndex(0);

    return tabButtonsContainer;
  }
}
