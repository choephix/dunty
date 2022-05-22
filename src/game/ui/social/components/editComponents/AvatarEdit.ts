import { SimpleObjectsFactory } from "@game/app/components/SimpleObjectsFactory";
import { GameSingletons } from "@game/app/GameSingletons";
import { Container } from "@pixi/display";
import { arrangeInStraightLine } from "@sdk-pixi/layout/arrangeInStraightLine";
import { NavigationTabsManager } from "@sdk-pixi/ui-helpers/NavigationTabsManager";
import { PageObjectManager } from "@sdk-pixi/ui-helpers/PageObjectManager";
import { AvatarBadgePreferencesController } from "../AvatarBadgePreferencesController";
import { MyProfileSideMenuButton } from "../../myprofile-menu/MyProfileSideMenuButton";
import { BackgroundPage } from "./BackgroundPage";
import { CharacterPage } from "./CharacterPage";
import { FramePage } from "./FramePage";
import { NameplatePage } from "./NameplatePage";

enum PageKey {
  Frame = 0,
  Character = 1,
  Background = 2,
  Nameplate = 3,
}

export class AvatarEdit extends Container {
  private readonly factory: SimpleObjectsFactory = GameSingletons.getSimpleObjectFactory();

  onItemSelected?: (itemType: PageKey) => unknown;

  constructor(avatarCtrl: AvatarBadgePreferencesController) {
    super();

    //// Add background
    const bg = this.factory.createSprite("ui-social/edit/btm.png");
    this.addChild(bg);

    //// Navigation
    const panel = this.createItemButtons();
    panel.position.set(0, -65);
    this.addChild(panel);

    //// Page manager
    const pageContainer = new Container();
    this.addChild(pageContainer);

    const pageManager = new PageObjectManager(
      {
        [PageKey.Frame]: () => new FramePage(avatarCtrl),
        [PageKey.Character]: () => new CharacterPage(avatarCtrl),
        [PageKey.Background]: () => new BackgroundPage(avatarCtrl),
        [PageKey.Nameplate]: () => new NameplatePage(avatarCtrl),
      },
      pageContainer
    );
    pageManager.setCurrentPage(0);

    this.onItemSelected = (key: PageKey) => {
      pageManager.setCurrentPage(key);
    };
  }

  createItemButtons() {
    const tabButtonsContainer = new Container();
    this.addChild(tabButtonsContainer);
    const addTabButton = (label: string) => {
      const button = new MyProfileSideMenuButton();
      button.setSpriteAndText("ui-social/social-subtab.png", label);
      tabButtonsContainer.addChild(button);
      return button;
    };
    const tabsConfiguration = NavigationTabsManager.tabOptionsFromDictionary({
      [PageKey.Frame]: addTabButton("Frame"),
      [PageKey.Character]: addTabButton("Character"),
      [PageKey.Background]: addTabButton("Background"),
      [PageKey.Nameplate]: addTabButton("Nameplate"),
    });

    arrangeInStraightLine(tabButtonsContainer.children, { spacing: 23 });

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
