import { Container } from "@pixi/display";
import { arrangeInStraightLine } from "@sdk-pixi/layout/arrangeInStraightLine";
import { NavigationTabsManager } from "@sdk-pixi/ui-helpers/NavigationTabsManager";
import { PageObjectManager } from "@sdk-pixi/ui-helpers/PageObjectManager";
import { AvatarBadgeElements } from "@game/ui/social/avatar/AvatarBadgeElements";
import { AvatarBadgePreferencesController } from "../AvatarBadgePreferencesController";
import { BadgeElementsList } from "./BadgeElementsList";
import { ColorPicker } from "./ColorPicker";
import { UnderlinedTabButton } from "./UnderlinedTabButton";

enum PageKey {
  Textures = 0,
  Images = 1,
  Stations = 2,
}

export class BackgroundPage extends Container {
  onItemSelected?: (itemType: PageKey) => unknown;
  avatarCtrl: AvatarBadgePreferencesController;

  constructor(avatarCtrl: AvatarBadgePreferencesController) {
    super();
    this.avatarCtrl = avatarCtrl;
    //// Color picker
    const colorPicker = new ColorPicker();
    colorPicker.position.set(850, 15);
    this.addChild(colorPicker);

    //// Navigation
    const panel = this.createItemButtons();
    panel.position.set(50, 25);
    this.addChild(panel);

    //// Page manager
    const pageContainer = new Container();
    this.addChild(pageContainer);

    const pageManager = new PageObjectManager(
      {
        [PageKey.Textures]: () => {
          const currentBackground = this.avatarCtrl.avatar.getCurrentConfiguration().backgroundImage;
          const texturesList = new BadgeElementsList();
          texturesList.position.set(50, 75);
          texturesList.addBackgroundElements(
            AvatarBadgeElements.getSortedData(
              AvatarBadgeElements.Backgrounds_Patterns,
              AvatarBadgeElements.canUserUseBackground
            ),
            avatarCtrl.preferences.backgroundColor,
            currentBackground
          );
          texturesList.onBadgeSelected = (badge: string) => {
            avatarCtrl.preferences.backgroundColor = texturesList.tintColor;
            avatarCtrl.preferences.backgroundImage = badge;
          };
          return texturesList;
        },
        [PageKey.Images]: () => {
          const currentBackground = this.avatarCtrl.avatar.getCurrentConfiguration().backgroundImage;
          const imagesList = new BadgeElementsList();
          imagesList.position.set(50, 75);
          imagesList.addBackgroundElements(
            AvatarBadgeElements.getSortedData(
              AvatarBadgeElements.Backgrounds_Images,
              AvatarBadgeElements.canUserUseBackground
            ),
            avatarCtrl.preferences.backgroundColor,
            currentBackground
          );
          imagesList.onBadgeSelected = (badge: string) => {
            avatarCtrl.preferences.backgroundColor = imagesList.tintColor;
            avatarCtrl.preferences.backgroundImage = badge;
          };
          return imagesList;
        },
        [PageKey.Stations]: () => {
          const currentBackground = this.avatarCtrl.avatar.getCurrentConfiguration().backgroundImage;
          const stationsList = new BadgeElementsList();
          stationsList.position.set(50, 75);
          stationsList.addBackgroundElements(
            AvatarBadgeElements.getSortedData(
              AvatarBadgeElements.Backgrounds_Stations,
              AvatarBadgeElements.canUserUseBackground
            ),
            avatarCtrl.preferences.backgroundColor,
            currentBackground
          );
          stationsList.onBadgeSelected = (badge: string) => {
            avatarCtrl.preferences.backgroundColor = stationsList.tintColor;
            avatarCtrl.preferences.backgroundImage = badge;
          };
          return stationsList;
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
      avatarCtrl.preferences.backgroundColor = color;
      if (pageManager.currentPage) (pageManager.currentPage as BadgeElementsList).setTintColor(color);
    };
  }

  createItemButtons() {
    const tabButtonsContainer = new Container();
    this.addChild(tabButtonsContainer);
    const addTabButton = (label: string) => {
      const button = new UnderlinedTabButton(label);
      tabButtonsContainer.addChild(button);
      return button;
    };
    const tabsConfiguration = NavigationTabsManager.tabOptionsFromDictionary({
      [PageKey.Textures]: addTabButton("Textures"),
      [PageKey.Images]: addTabButton("Images"),
      [PageKey.Stations]: addTabButton("Stations"),
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
