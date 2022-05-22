import { FontFamily } from "@game/constants/FontFamily";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { Rectangle } from "@pixi/math";
import { Text } from "@pixi/text";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { EventBus } from "@sdk/core/EventBus";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";

const commonLabelStyle = {
  fill: "#FFFFFF",
  fontFamily: FontFamily.Default,
};

export type NavigationTabConfiguration = {
  label: string;
  disabled?: boolean;
  [key: string]: any;
};

export type NavigationTabsComponentOptions = {
  tabWidth: number;
  underlineThickness: number;
  fontSize: number;
};

export class NavigationTabs<
  TConfig extends NavigationTabConfiguration = NavigationTabConfiguration
> extends EnchantedContainer {
  public readonly tweeener = new TemporaryTweeener(this);
  public readonly events = new EventBus<{
    tabSelected: (tabsData: any, index: number) => void;
  }>();

  public readonly tabWidth: number;
  public readonly tabs: any[];

  public selectedTabIndex = -1;

  constructor(
    public readonly tabsData: TConfig[],
    public readonly options: Partial<NavigationTabsComponentOptions> = {}
  ) {
    super();

    const { tabWidth = 280, underlineThickness = 8, fontSize = 36 } = options;
    this.tabWidth = tabWidth;

    const underlineWidth = tabWidth; // label.width
    function createUnderline(color: number) {
      const underline = new Graphics();
      underline.lineStyle(underlineThickness, color);
      underline.moveTo(0, 0);
      underline.lineTo(underlineWidth, 0);
      underline.pivot.set(0.5 * tabWidth, 0);
      return underline;
    }

    const createTab = (tabData: TConfig, index: number) => {
      const tab = new Container();

      const label = new Text(tabData.label.toUpperCase(), {
        ...commonLabelStyle,
        fontSize,
      });
      label.x = 0.5 * (tabWidth - label.width);
      tab.addChild(label);

      const underlineNormal = tab.addChild(createUnderline(0x505050));
      const underlineActive = tab.addChild(createUnderline(0x00ffff));
      underlineNormal.position.set(0.5 * tabWidth, label.height + 12);
      underlineActive.position.set(0.5 * tabWidth, label.height + 12);

      underlineNormal.alpha = 0.4;
      underlineActive.alpha = 0.0;

      const setActive = (active: boolean) => {
        if (active) {
          this.tweeener.fromTo(
            underlineActive,
            {
              pixi: { scaleX: 0, alpha: 0.5 },
            },
            {
              pixi: { scaleX: 1, alpha: 1.0 },
              duration: 0.73,
              ease: "power3.out",
            }
          );
        } else {
          this.tweeener.to(underlineActive, {
            pixi: { scaleX: 0.0, alpha: 0 },
            duration: 0.37,
            ease: "power.out",
          });
        }
      };

      if (tabData.disabled) {
        tab.interactive = false;
        tab.buttonMode = false;
        label.alpha = 0.22;
      } else {
        buttonizeDisplayObject(tab, () => this.setSelectedTabIndex(index));
      }

      return Object.assign(tab, {
        label,
        underlineNormal,
        underlineActive,
        setActive,
        hitArea: new Rectangle(0, 0, tabWidth, tab.height),
      });
    };
    this.tabs = tabsData.map(createTab);

    for (const [index, tab] of this.tabs.entries()) {
      this.addChild(tab);
      tab.position.set(index * (tabWidth + 40), 0);
    }
  }

  getSelectedTabData() {
    return this.tabsData[this.selectedTabIndex];
  }

  getSelectedTabComponent() {
    return this.tabs[this.selectedTabIndex];
  }

  setSelectedTabIndex(index: number) {
    this.getSelectedTabComponent()?.setActive(false);
    this.selectedTabIndex = index;
    this.getSelectedTabComponent()?.setActive(true);
    return this.events.dispatch("tabSelected", this.tabsData[index], index);
  }

  setInteractive(interactive: boolean) {
    for (const tab of this.tabs) {
      tab.interactive = interactive;
    }
    this.alpha = interactive ? 1.0 : 0.96;
  }

  playShowAnimation() {
    return this.tweeener.fromTo(
      [...this.tabs].reverse(),
      {
        pixi: { pivotX: -this.tabWidth },
        alpha: 0.0,
      },
      {
        pixi: { pivotX: 0 },
        alpha: 1.0,
        duration: 0.5,
        ease: "back.out",
        stagger: 0.13,
      }
    );
  }

  playHideAnimation() {
    return this.tweeener.to([...this.tabs].reverse(), {
      pixi: { pivotX: -this.tabWidth },
      alpha: 0.0,
      duration: 0.2,
      ease: "power2.in",
      stagger: 0.06,
    });
  }
}
