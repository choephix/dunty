import { Container } from "@pixi/display";
import { arrangeInStraightLine } from "@sdk-pixi/layout/arrangeInStraightLine";
import { NavigationTabsManager } from "@sdk-pixi/ui-helpers/NavigationTabsManager";
import { PageObjectManager } from "@sdk-pixi/ui-helpers/PageObjectManager";
import { AvatarBadgeElements } from "@game/ui/social/avatar/AvatarBadgeElements";
import { AvatarBadgePreferencesController } from "../AvatarBadgePreferencesController";
import { BadgeElementsList } from "./BadgeElementsList";
import { UnderlinedTabButton } from "./UnderlinedTabButton";

enum PageKey {
  Conductors = 0,
  Passengers = 1,
}

export class CharacterPage extends Container {
  onItemSelected?: (itemType: PageKey) => unknown;
  private avatarCtrl: AvatarBadgePreferencesController;
  constructor(avatarCtrl: AvatarBadgePreferencesController) {
    super();
    this.avatarCtrl = avatarCtrl;
    //// Navigation
    const panel = this.createItemButtons();
    panel.position.set(255, 25);
    this.addChild(panel);

    //// Page manager
    const pageContainer = new Container();
    this.addChild(pageContainer);

    const pageManager = new PageObjectManager(
      {
        [PageKey.Conductors]: () => {
          const currentPortrait = this.avatarCtrl.avatar.getCurrentConfiguration().foregroundImage;
          const conductorsList = new BadgeElementsList();
          conductorsList.position.set(50, 75);
          conductorsList.addForegroundElements(
            AvatarBadgeElements.getSortedData(
              AvatarBadgeElements.Foregrounds_Conductors,
              AvatarBadgeElements.canUserUseForeground
            ),
            currentPortrait
          );
          conductorsList.onBadgeSelected = (badge: string) => {
            avatarCtrl.preferences.foregroundImage = badge;
          };
          return conductorsList;
        },
        [PageKey.Passengers]: () => {
          const currentPortrait = this.avatarCtrl.avatar.getCurrentConfiguration().foregroundImage;
          const passengersList = new BadgeElementsList();
          passengersList.position.set(50, 75);
          passengersList.addForegroundElements(
            AvatarBadgeElements.getSortedData(
              AvatarBadgeElements.Foregrounds_Passengers,
              AvatarBadgeElements.canUserUseForeground
            ),
            currentPortrait
          );
          passengersList.onBadgeSelected = (badge: string) => {
            avatarCtrl.preferences.foregroundImage = badge;
          };
          return passengersList;
        },
      },
      pageContainer
    );
    pageManager.setCurrentPage(0);
    //// Add events
    this.onItemSelected = (key: PageKey) => {
      pageManager.setCurrentPage(key);
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
      [PageKey.Conductors]: addTabButton("Conductors"),
      [PageKey.Passengers]: addTabButton("Passengers"),
    });

    arrangeInStraightLine(tabButtonsContainer.children, { spacing: 55 });

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
