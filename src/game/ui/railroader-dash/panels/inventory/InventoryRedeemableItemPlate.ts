import { GameSingletons } from "@game/app/GameSingletons";
import { ThemeColors } from "@game/constants/ThemeColors";
import { Container } from "@pixi/display";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";

export class InventoryRedeemableItemPlate extends Container {
  private readonly context = GameSingletons.getGameContext();

  public onClickRedeem?: () => unknown;

  public readonly cardSprite;
  public readonly actionButton;

  constructor(textureId: string) {
    super();

    //// Add card
    this.cardSprite = this.context.simpleFactory.createSprite(textureId);
    this.addChild(this.cardSprite);

    //// Add button
    const buttonTextureId = "ui-railroader-dashboard/inventory/btn.png";
    this.actionButton = this.context.simpleFactory.createSprite(buttonTextureId, { x: -10, y: 525 });
    this.actionButton.scale.set(1.725);
    this.actionButton.interactive = true;
    this.actionButton.buttonMode = true;
    this.actionButton.tint = ThemeColors.REEDEM_BUTTON_COLOR.toInt();
    buttonizeDisplayObject(this.actionButton, () => this.onClickRedeem?.());

    const buttonText = this.context.simpleFactory.createText("REDEEM", { fontSize: 24 }, { x: 113, y: 32 });
    buttonText.anchor.set(0.5);
    this.actionButton.addChild(buttonText);

    this.addChild(this.actionButton);
  }
}
