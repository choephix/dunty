import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { Texture } from "@pixi/core";
import { Container, DisplayObject } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { Color } from "@sdk/utils/color/Color";

const textPositionIncrement: Array<number> = [38, 100, 160, 225, 285, 350, 410];

interface ButtonConfiguration {
  textureId: string;
  positionY: number;
  height: number;
  iconPositionY: number;
  textPositionY: number;
  hitAreaPositionY: number;
  inactive: boolean;
}

[22, 83, 144, 207, 269, 332, 395];

const buttonConfigurations: ButtonConfiguration[] = [
  {
    textureId: "ui-station-dashboard/sidebar-tabs/tab-1.png",
    positionY: 21,
    height: 62,
    iconPositionY: 51,
    textPositionY: 38,
    hitAreaPositionY: 75,
    inactive: true,
  },
  {
    textureId: "ui-station-dashboard/sidebar-tabs/tab-2.png",
    positionY: 83,
    height: 61,
    iconPositionY: 111,
    textPositionY: 100,
    hitAreaPositionY: 75,
    inactive: false,
  },
  {
    textureId: "ui-station-dashboard/sidebar-tabs/tab-3.png",
    positionY: 144,
    height: 63,
    iconPositionY: 173,
    textPositionY: 160,
    hitAreaPositionY: 75,
    inactive: false,
  },
  {
    textureId: "ui-station-dashboard/sidebar-tabs/tab-4.png",
    positionY: 207,
    height: 62,
    iconPositionY: 235,
    textPositionY: 225,
    hitAreaPositionY: 75,
    inactive: true,
  },
  {
    textureId: "ui-station-dashboard/sidebar-tabs/tab-5.png",
    positionY: 269,
    height: 63,
    iconPositionY: 300,
    textPositionY: 285,
    hitAreaPositionY: 75,
    inactive: false,
  },
  {
    textureId: "ui-station-dashboard/sidebar-tabs/tab-6.png",
    positionY: 332,
    height: 63,
    iconPositionY: 362,
    textPositionY: 350,
    hitAreaPositionY: 75,
    inactive: false,
  },
  {
    textureId: "ui-station-dashboard/sidebar-tabs/tab-7.png",
    positionY: 395,
    height: 60,
    iconPositionY: 425,
    textPositionY: 410,
    hitAreaPositionY: 75,
    inactive: true,
  },
];

export class StationDashboardSidebarTabs extends Container {
  public readonly tweeener = new TemporaryTweeener(this);

  private expandedButtonSprite?: DisplayObject;

  private currentSelectionIndex: number = 0;

  private readonly assets = GameSingletons.getResources();

  constructor(
    private readonly btnTint: Color,
    private readonly iconTint: Color,
    private readonly onSelectedTabChange: (selectedTabIndex: number) => void
  ) {
    super();

    const backgroundTextureId = "ui-station-dashboard/sidebar-tabs/tabs-background.png";
    const background = new Sprite(this.assets.getTexture(backgroundTextureId));
    background.tint = btnTint.toInt();
    background.scale.set(0.51);
    this.addChild(background);

    // const iconPositionX = 699;
    // const hitAreaPositionX = 665;
    // const hitAreaWidth = 70;
    // const hitAreaHeight = 50;

    const iconTintInt = this.iconTint.toInt();

    const addTabButton = (tabIndex: number, buttonConfiguration: ButtonConfiguration) => {
      const positionX = 665;
      const width = 70;
      const { textureId, height, positionY, inactive } = buttonConfiguration;

      const onClick = () => {
        /**
         * 0 is for no tab selected
         * 1 through 7 are for the tabs
         */
        const selectedPage = tabIndex + 1;
        if (this.currentSelectionIndex == selectedPage) {
          this.currentSelectionIndex = 0;
        } else {
          this.currentSelectionIndex = selectedPage;
        }
        this.selectTab(this.currentSelectionIndex);
        this.onSelectedTabChange(this.currentSelectionIndex);
      };

      const hitArea = new Sprite(Texture.WHITE);
      hitArea.name = `tab-${tabIndex}-hitarea`;
      hitArea.renderable = false;
      hitArea.width = width;
      hitArea.height = height;
      hitArea.position.set(positionX, positionY);
      if (!inactive) {
        buttonizeDisplayObject(hitArea, onClick);
      }
      this.addChild(hitArea);

      const centerX = positionX + width / 2;
      const centerY = positionY + height / 2;

      const icon = new Sprite(this.assets.getTexture(buttonConfiguration.textureId));
      icon.scale.set(0.51);
      icon.anchor.set(0.5);
      icon.position.set(centerX, centerY);
      icon.tint = iconTintInt;
      icon.alpha = buttonConfiguration.inactive ? 0.2 : 1.0;
      this.addChild(icon);
    };

    for (let i = 0; i < buttonConfigurations.length; i++) {
      const buttonConfiguration = buttonConfigurations[i];
      addTabButton(i, buttonConfiguration);
    }
  }

  selectTab(tabIndex: number) {
    this.expandedButtonSprite?.destroy();
    delete this.expandedButtonSprite;

    let expandedButtonTexture: any, buttonIndex: any, expandedButtonText: any;

    switch (tabIndex) {
      case 1:
        expandedButtonTexture = this.assets.getTexture(
          "ui-station-dashboard/extended-buttons/1-btn-extended-rates.png"
        );
        buttonIndex = 0;
        expandedButtonText = "RATES";
        break;
      case 2:
        expandedButtonTexture = this.assets.getTexture(
          "ui-station-dashboard/extended-buttons/2-btn-extended-visitors.png"
        );
        buttonIndex = 1;
        expandedButtonText = "VISITORS";
        break;
      case 3:
        expandedButtonTexture = this.assets.getTexture(
          "ui-station-dashboard/extended-buttons/3-btn-extended-tocium.png"
        );
        buttonIndex = 2;
        expandedButtonText = "TOCIUM";
        break;
      case 4:
        expandedButtonTexture = this.assets.getTexture(
          "ui-station-dashboard/extended-buttons/4-btn-extended-gifts.png"
        );
        buttonIndex = 3;
        expandedButtonText = "GIFTS";
        break;
      case 5:
        expandedButtonTexture = this.assets.getTexture(
          "ui-station-dashboard/extended-buttons/5-btn-extended-message.png"
        );
        buttonIndex = 4;
        expandedButtonText = "BILLBOARD";
        break;
      case 6:
        expandedButtonTexture = this.assets.getTexture(
          "ui-station-dashboard/extended-buttons/6-btn-extended-staking.png"
        );
        buttonIndex = 5;
        expandedButtonText = "STAKING";
        break;
      case 7:
        expandedButtonTexture = this.assets.getTexture(
          "ui-station-dashboard/extended-buttons/7-btn-extended-settings.png"
        );
        buttonIndex = 6;
        expandedButtonText = "SETTINGS";
        break;
      default:
        break;
    }

    if (expandedButtonTexture && expandedButtonText && buttonIndex) {
      const expandedBtn = this.setExpandedButton(expandedButtonTexture, expandedButtonText, buttonIndex, 674, 0.51);
      this.expandedButtonSprite = expandedBtn;
      this.addChild(expandedBtn);
    }
  }

  setExpandedButton(
    expandedButtonTexture: Texture,
    expandedButtonText: string,
    buttonIndex: number,
    expndBtnTxtX: number,
    scale: number
  ) {
    const expandedContainer = new Container();
    const expBtn = new Sprite(expandedButtonTexture);
    expBtn.scale.set(scale);
    expandedContainer.addChild(expBtn);
    let expBtnTxt;

    expBtn.anchor.x = 1;
    expBtn.position.x = 757;

    //expanded button text

    expBtnTxt = new Text(expandedButtonText, {
      fill: 0xffffff,
      fontSize: 16,
      fontFamily: FontFamily.Default,
    });
    expBtnTxt.anchor.x = 0.5;
    expBtnTxt.position.set(expndBtnTxtX + 7, textPositionIncrement[buttonIndex] + 5);
    expBtn.tint = this.btnTint.toInt();
    expandedContainer.addChild(expBtnTxt);

    this.tweeener.from(expBtn.scale, {
      x: expBtn.scale.x * 0.75,
      duration: 0.62,
      ease: "power3.out",
    });
    this.tweeener.from(expBtnTxt, {
      x: expndBtnTxtX + 40,
      alpha: 0.0,
      duration: 0.72,
      ease: "power3.out",
    });

    return expandedContainer;
  }
}
