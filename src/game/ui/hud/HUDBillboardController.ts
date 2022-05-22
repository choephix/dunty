import { GameSingletons } from "@game/app/GameSingletons";
import { GameViewMode } from "@game/app/main";
import { Container } from "@pixi/display";
import { createXButton } from "../components/createXButton";
import { BillboardSprite } from "../popups/station-dashboard-components/billboard/components/BillboardSprite";

export class HUDBillboardController {
  private readonly context = GameSingletons.getGameContext();

  private billboard: BillboardSprite | null = null;

  constructor(private readonly billboardsParent: Container) {}

  initialize() {
    const { stage, main, viewSize, userData } = this.context;

    stage.enchantments.watch(
      () => {
        const selectedStation = main.selection.selectedStation;
        const result =
          main.viewMode === GameViewMode.NORMAL &&
          selectedStation != null &&
          selectedStation.ownerName !== userData.name &&
          !main.popups.clickUnrelated.currentPopup?.isExpanded &&
          !main.popups.clickWithMyTrain.currentPopup?.isExpanded &&
          selectedStation;
        return result || null;
      },
      selectedStation => {
        let billboardIPFSHash = selectedStation?.billboardIPFSHash;

        this.dismissCurrentBillboard();

        if (!billboardIPFSHash) {
          return;
        }

        this.billboard = new BillboardSprite();
        this.billboard.hide(true);
        this.billboard.show();
        this.billboard.setCurrentIPFSHash(billboardIPFSHash);
        this.billboardsParent.addChild(this.billboard);

        this.billboard.onEnterFrame.add(positionBillboard.bind(this.billboard));

        const xButton = createXButton();
        xButton.scale.set(0.6);
        xButton.position.set(20, 25);
        xButton.behavior.on({ trigger: () => this.dismissCurrentBillboard() });
        this.billboard.billboardFrame.addChild(xButton);
      }
    );

    const positionBillboard = function (this: BillboardSprite) {
      /**
       * Position the billboard at the bottom left of the screen's view size.
       */
      const { width: viewWidth, height: viewHeight } = viewSize;
      const { width: spriteWidth, height: spriteHeight } = this.billboardFrame.texture;

      this.scale.set(Math.min(viewHeight / 1300, viewWidth / 1400));
      this.position.set(viewWidth * 0.05 + spriteWidth * 0.5, viewHeight + spriteHeight * 0.05);
    };
  }

  dismissCurrentBillboard() {
    const previousBillboard = this.billboard;
    if (previousBillboard) {
      this.billboard = null;
      previousBillboard.hide().then(() => {
        previousBillboard.destroy();
      });
    }
  }
}
