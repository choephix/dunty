import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { EventBus } from "@sdk/core/EventBus";
import { SafeScrollbox } from "@sdk-pixi/display/SafeScrollbox";
import { ClaimCenterDataService } from "./ClaimCenterDataService";
import { UnclaimedReward } from "./models";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";

const commonLabelStyle = {
  fill: "#FFFFFF",
  fontFamily: FontFamily.DefaultThin,
};

const rowXCoordinates = [100, 450];

export class ClaimCenterList extends SafeScrollbox {
  protected readonly context: GameContext = GameSingletons.getGameContext();
  dataService = new ClaimCenterDataService(this.context);
  events = new EventBus<{
    claimReward: (rewardData: UnclaimedReward) => void;
  }>();

  constructor() {
    super({
      noTicker: true,
      boxWidth: 555,
      boxHeight: 425,
      stopPropagation: true,
      divWheel: GameSingletons.getGameContext().app.view,
      overflowX: "none",
    });
  }

  async fillClaimCenterList() {
    const data = await this.dataService.getUnclaimedRewards();
    if (data.length == 0) {
      return false;
    }
    this.addRowsTocium(data, 18);
    return true;
  }

  addRowsTocium(rowsData: Array<UnclaimedReward>, fontSize: number) {
    let startY = 10;
    for (let rowData of rowsData) {
      /// Row Container
      const rowContainer = new Container();

      /// Tocium Amount Text
      const tociumAmountLabel = new Text(rowData.description, {
        ...commonLabelStyle,
        fontSize: fontSize,
      });
      tociumAmountLabel.position.set(rowXCoordinates[0], startY);
      tociumAmountLabel.anchor.set(0.5, 0);
      tociumAmountLabel.x += tociumAmountLabel.width / 2;
      tociumAmountLabel.y += tociumAmountLabel.height / 4;
      rowContainer.addChild(tociumAmountLabel);

      /// Claim Button
      const claimButtonTextureId = "ui-railroader-dashboard/page-claim-center/btn-claim.png";
      const claimButtonTexture = this.context.assets.getTexture(claimButtonTextureId);
      const claimButton = new Sprite(claimButtonTexture);
      claimButton.position.set(rowXCoordinates[1], startY);
      claimButton.anchor.set(0.5, 0);
      claimButton.scale.set(0.7);
      buttonizeDisplayObject(claimButton, async () => {
        if (this.interactive) {
          this.interactive = false;
          this.events.dispatch("claimReward", rowData);
          this.interactive = true;
        }
      });
      rowContainer.addChild(claimButton);

      /// Row Underline
      const graphics = new Graphics()
        .lineStyle(1, 0xffffff, 0.6)
        .moveTo(tociumAmountLabel.x - tociumAmountLabel.width / 2 - 30, startY + 44)
        .lineTo(claimButton.x + claimButton.width / 2 + 20, startY + 44);

      rowContainer.addChild(graphics);

      this.content.addChild(rowContainer);
      startY += claimButton.height + 20;
    }
    this.content.addChild(this.addInvisibleBox(426));
    this.update();
  }

  addInvisibleBox(px: number) {
    const box = new Sprite(Texture.EMPTY);
    box.width = this.boxWidth + 1;
    box.height = px;
    return box;
  }

  clearList() {
    const children = [...this.content.children];
    for (const child of children) {
      child.destroy({ children: true });
    }
    this.content.addChild(this.addInvisibleBox(426));
  }
}
