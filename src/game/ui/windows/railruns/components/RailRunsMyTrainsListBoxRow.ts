import { GameContext } from "@game/app/app";
import { FontFamily } from "@game/constants/FontFamily";
import { TrainEntity } from "@game/data/entities/TrainEntity";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { TrainName } from "@sdk-integration/contracts";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { Color } from "@sdk/utils/color/Color";
import { RailRunsMyTrainsListRowData } from "../pages/RailRunsMyTrainsPage";
import { RailRunsWindowComponentFactory } from "./RailRunsWindowComponentFactory";

// import { EnchantedContainer } from '@game/core/enchanted-classes';

export class RailRunsMyTrainsListBoxRow extends Container {
  train: TrainEntity;
  index: number;
  private expandIcon: Sprite;

  constructor(
    readonly parentWidth: number,
    readonly data: RailRunsMyTrainsListRowData,
    readonly factory: RailRunsWindowComponentFactory,
    protected readonly context: GameContext,
    index: number,
    cb: any
  ) {
    super();
    this.buttonMode = true;
    this.interactive = true;

    const { name } = data;
    const { userData } = this.context;

    this.index = index;
    this.train = userData.trains.get(name.toLowerCase() as TrainName) as TrainEntity;

    this.addTrainIcon();
    this.addTrainName();
    this.addTrainRegion();
    this.addTrainStatus();
    this.checkQuickAction();
    this.expandIcon = this.addExpandButton();
    this.addUnderPad(cb);
  }

  private addTrainIcon(): void {
    //train icon
    const icon = new Sprite(this.context.assets.getTexture("ui-railruns-window/loco-icon.png"));
    icon.y -= 6;
    icon.scale.set(0.4);
    this.addChild(icon);
  }

  private addTrainName(): void {
    //train name
    const nameText = new Text(this.data.name, {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 30,
    });
    nameText.x = 85;
    this.addChild(nameText);
    this.resizeTexts(nameText, 485);
  }

  private addTrainRegion(): void {
    const regionText = new Text(this.data.region, {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 30,
    });
    regionText.x = 485;
    this.addChild(regionText);
    this.resizeTexts(regionText, 910);
  }

  private addTrainStatus() {
    const statusText = new Text(this.data.status, {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 30,
    });
    statusText.x = 910;
    this.addChild(statusText);
    this.resizeTexts(statusText, 1870);
  }

  private checkQuickAction() {
    switch (this.data.quickAction) {
      case "claim":
        const claimBtn = this.factory.addClaimBtn();
        this.addChild(claimBtn);
        claimBtn.position.x = 1565;
        claimBtn.position.y -= 10;
        buttonizeDisplayObject(claimBtn, () => {
          const run = this.train.currentOngoingRun;
          if (!run) {
            throw new Error(`Could not find ongoing run for train "${this.data.name}"`);
          }

          this.context.input.dispatch("closeRailRunsWindow");
          this.context.input.dispatch("claimRunRewards", run);
        });
        break;
      case "clear":
        const clearBtn = this.factory.addClearBtn();
        this.addChild(clearBtn);
        clearBtn.position.x = 1565;
        clearBtn.position.y -= 10;
        buttonizeDisplayObject(clearBtn, () => {
          this.context.input.dispatch("clearAndVerifyTrain", this.train);
        });
        break;
      default: // quickAction is probably null, so no button needs to be added
    }
  }

  private addExpandButton(): Sprite {
    const expandIconTexture = this.context.assets.getTexture("ui-railruns-window/icon-chevron.png");
    const expandIcon = new Sprite(expandIconTexture);
    expandIcon.position.y += 12.5;
    expandIcon.position.x = 1870;
    expandIcon.anchor.y = 0.5;
    expandIcon.buttonMode = true;
    this.addChild(expandIcon);
    return expandIcon;
  }

  // private addExpandedPage(): RailRunsMyTrainsListRowExpandedContent {
  //   const expandedPage = new RailRunsMyTrainsListRowExpandedContent(this.context, this.train);
  //   // this.addChild(expandedPage);

  //   expandedPage.y = 75;
  //   expandedPage.x = 50;
  //   expandedPage.name = 'expandedPage';

  //   return expandedPage;
  // }

  private addUnderPad(cb: any): void {
    const underPad = new Sprite(Texture.EMPTY);
    underPad.interactive = true;
    underPad.buttonMode = true;
    underPad.width = this.parentWidth;
    underPad.height = this.height;
    buttonizeDisplayObject(underPad, async () => await cb(this.index));

    //highlight text on hover
    underPad.on("pointerover", () => {
      this.addColorToText();
    });

    underPad.on("pointerout", () => {
      this.removeColorFromText();
    });
    this.addChildAt(underPad, 0);
  }

  setExpandedState(expanded: boolean) {
    console.log("Icon toggled");
    this.expandIcon.scale.y = expanded ? -1 : 1;
  }

  private resizeTexts(text: Text, x: number) {
    if (text.x + text.width > x) {
      text.scale.x -= 0.1;
      this.resizeTexts(text, x);
    } else {
      return;
    }
  }

  private addColorToText() {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] instanceof Text) {
        (this.children[i] as Sprite).tint = Color.CYAN.toInt();
      }
    }
  }

  private removeColorFromText() {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] instanceof Text) {
        (this.children[i] as Sprite).tint = 0xffffff;
      }
    }
  }
}
