import { SimpleObjectsFactory } from "@game/app/components/SimpleObjectsFactory";
import { GameSingletons } from "@game/app/GameSingletons";
import { Container } from "@pixi/display";
import { NavigationTabsManager } from "@sdk-pixi/ui-helpers/NavigationTabsManager";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { GlowFilterService } from "../../fx/GlowFilterService";
import { MyProfileSideMenuButton } from "./MyProfileSideMenuButton";

export type ProfileItemKey = "view" | "edit" | "achievements";

export class MyProfileSideMenu extends Container {
  private readonly factory: SimpleObjectsFactory = GameSingletons.getSimpleObjectFactory();
  private readonly tweeener = new TemporaryTweeener(this);

  public onItemSelected?: (itemType: ProfileItemKey) => unknown;
  public onBackSelected?: () => void;

  public readonly navButtons;
  private readonly glowFilter;

  constructor() {
    super();

    this.glowFilter = new GlowFilterService();

    //// Add background
    const bg = this.factory.createSprite("ui-social/right-panel/collapsed/base-collapsed.png");
    this.addChild(bg);

    //// Add menu buttons
    this.navButtons = this.createItemButtons();
    this.addChild(this.navButtons);

    //// Add back button
    const bkButton = this.factory.createSprite("ui-social/right-panel/collapsed/back-btn.png");
    bkButton.interactive = true;
    bkButton.buttonMode = true;
    bkButton.position.set(60, 605);
    bkButton.on("pointerdown", () => {
      this.onBackSelected?.();
      this.glowFilter.addFilter(bkButton);
    });
    this.addChild(bkButton);
  }

  createItemButtons() {
    const filterButtonContainer = new Container();

    function viewProfile() {
      const button = new MyProfileSideMenuButton();
      button.setInnerContentAsSprite("ui-social/right-panel/collapsed/view-profile.png");
      button.position.set(185, 125);
      return button;
    }

    function editRightBadge() {
      const button = new MyProfileSideMenuButton();
      button.setInnerContentAsSprite("ui-social/right-panel/collapsed/edit-badge.png");
      button.position.set(185, 315);
      return button;
    }

    function featuredAchievements() {
      const button = new MyProfileSideMenuButton();
      button.setInnerContentAsSprite("ui-social/right-panel/collapsed/featured-ach.png");
      button.position.set(185, 505);
      //// disable button
      button.setTint(0x7e7e7e);
      button.interactive = false;
      button.buttonMode = false;
      return button;
    }

    const buttonsMap = {
      view: viewProfile(),
      edit: editRightBadge(),
      achievements: featuredAchievements(),
    };

    const buttons = Array.from(Object.values(buttonsMap)).filter(button => button != null) as MyProfileSideMenuButton[];

    filterButtonContainer.addChild(...buttons);

    type TabKey = keyof typeof buttonsMap;
    const tabConfigs = new Array<{ displayObject: MyProfileSideMenuButton; value: TabKey }>();
    for (const [key, button] of Object.entries(buttonsMap)) {
      if (button == null) continue;
      tabConfigs.push({ displayObject: button, value: key as TabKey });
    }

    const tabsManager = new NavigationTabsManager(tabConfigs, {
      setSelected(tab, selected) {
        tab.setHighlighted(selected);
      },
      isDisabled: (tab: "view" | "edit" | "achievements") => {
        return tab === "achievements" ? true : false;
      },
    });
    tabsManager.onSelectionChange = key => {
      this.onItemSelected?.(key);
    };

    return Object.assign(filterButtonContainer, { manager: tabsManager });
  }

  playShowAnimation() {
    return this.tweeener.fromTo(this.pivot, { x: -500 }, { delay: 0.2, x: 0, duration: 1.3, ease: "bounce.out" });
  }

  playHideAnimation() {
    return this.tweeener.fromTo(this.pivot, { x: 0 }, { x: -500, duration: 0.2, ease: "power2.in" });
  }
}
