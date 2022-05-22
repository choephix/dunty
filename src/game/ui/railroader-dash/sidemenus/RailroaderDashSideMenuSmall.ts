import { GameSingletons } from "@game/app/GameSingletons";
import { Container, DisplayObject } from "@pixi/display";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { GlowFilterService } from "../../fx/GlowFilterService";
import { getRailroaderDashTabsConfiguration } from "./railroaderDashSidemenuConfigurations";

export class RailroaderDashSideMenuSmall extends Container {
  private readonly context = GameSingletons.getGameContext();
  private readonly tweeener = new TemporaryTweeener(this);

  private readonly glowFilterService: GlowFilterService = new GlowFilterService();

  private currentSelectedTab?: Container;

  constructor(public readonly selectTab: (index: number) => void) {
    super();
    this.init();
  }

  init() {
    //// Add background
    const bg = this.context.simpleFactory.createSprite("ui-railroader-dashboard/left-panel-bg.png", {
      x: -250,
      y: 75,
    });
    bg.scale.set(0.7);
    this.addChild(bg);

    //// Add selection tabs
    this.addChild(this.addSelectionTabs());
  }

  addSelectionTabs() {
    const container = new Container();
    let startY = 150;

    const addTabButton = (tabKey: number, textureId: string, enabled: boolean) => {
      const sprite = this.context.simpleFactory.createSprite(textureId, {
        x: 10,
        y: startY,
      });
      sprite.scale.set(0.7);
      if (enabled) {
        buttonizeDisplayObject(sprite, () => {
          //// Select new tab
          if (this.currentSelectedTab != sprite) {
            this.removeCurrentSelectedTabGlow();
            this.currentSelectedTab = sprite;
            this.selectTab(tabKey - 1);

            if (this.currentSelectedTab) {
              this.setCurrentSelectedTabGlow(sprite);
            }
          }
        });
      } else {
        sprite.tint = 0x7e7e7e;
      }

      container.addChild(sprite);
      startY += 68;
    };

    const tabsCfg = getRailroaderDashTabsConfiguration();
    for (const [tabKey, { smallMenuTexture, disabled }] of Object.entries(tabsCfg)) {
      addTabButton(+tabKey, smallMenuTexture, !disabled);
    }

    //TEMP: just add a 'goBack' event or callback
    const backButtonIndex = 10;
    addTabButton(backButtonIndex, "ui-railroader-dashboard/sidebar-buttons-collapsed/back.png", true);

    return container;
  }

  setCurrentSelectedTabIndexGlow(index: number) {
    if (index < 0 || index > 8) return;
    this.setCurrentSelectedTabGlow((this.children[1] as Container).children[index]);
  }

  setCurrentSelectedTabGlow(tab: DisplayObject) {
    this.glowFilterService.addFilter(tab);
    this.currentSelectedTab = tab as Container;
  }

  //// Remove glow from exisiting selected tab
  removeCurrentSelectedTabGlow() {
    if (this.currentSelectedTab) {
      this.glowFilterService.removeFrom(this.currentSelectedTab);
    }
  }

  playShowAnimation() {
    return this.tweeener.fromTo(
      this.pivot,
      {
        x: 500,
      },
      {
        delay: 0.2,
        x: 0,
        duration: 0.4,
        ease: "power2.out",
      }
    );
  }

  playHideAnimation() {
    this.removeCurrentSelectedTabGlow();

    return this.tweeener.fromTo(
      this.pivot,
      {
        x: 0,
      },
      {
        x: 500,
        duration: 0.2,
        ease: "power2.in",
      }
    );
  }
}
