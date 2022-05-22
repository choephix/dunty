import { GameSingletons } from "@game/app/GameSingletons";
import { StakingAddonType } from "@game/asorted/StakingType";
import { FontFamily } from "@game/constants/FontFamily";
import { FontIcon } from "@game/constants/FontIcon";
import { GreenButton } from "@game/ui/railroader-dash/panels/settings/components/GreenButton";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { EventBus } from "@sdk/core/EventBus";
import { getStakingAddonDisplayProperties } from "../utils/getStakingAddonDisplayProperties";

export class StakesAddonSelectionBottomBar extends Container {
  private readonly context = GameSingletons.getGameContext();

  buttonValueContainer: Container;
  valueContainerText: Text;
  addonType?: StakingAddonType;

  constructor(public readonly events: EventBus) {
    super();
    //// Add intial text
    const intialText = new Text("SELECT TO UNLOCK", {
      fontFamily: FontFamily.Default,
      fontSize: 30,
      fill: 0xffffff,
    });
    intialText.position.set(165, 0);
    this.addChild(intialText);
    //// Add button container for background, value and confirm button
    this.buttonValueContainer = new Container();
    //// Value Container background
    const bg = new Sprite(
      this.context.assets.getTexture("ui-station-dashboard/staking/manage-tab/manage-vips/text-field.png")
    );
    this.buttonValueContainer.addChild(bg);
    this.buttonValueContainer.scale.set(0.6);

    //// Value Container confirm button
    const confirmBtn = new GreenButton(
      "CONFIRM",
      () => {
        this.events.dispatch("purchaseConfirmed", this.addonType);
      },
      200,
      15
    );
    confirmBtn.position.x = bg.x + bg.width + 10;
    this.buttonValueContainer.addChild(confirmBtn);

    //// Value Container text
    this.valueContainerText = new Text("", {
      fontFamily: FontFamily.Default,
      fontSize: 24,
      fill: 0xffffff,
    });
    this.buttonValueContainer.addChild(this.valueContainerText);
    this.valueContainerText.anchor.set(0.5);
    this.valueContainerText.position.set(bg.x + bg.width / 2, bg.y + bg.height / 2);
    this.addChild(this.buttonValueContainer);
    this.buttonValueContainer.visible = false;
  }

  showPurchaseButton(show: boolean) {
    this.buttonValueContainer.visible = show;
  }

  showUnlockAddonMessage(hubValue: string, addonType: StakingAddonType) {
    const { addonDisplayName: displayName } = getStakingAddonDisplayProperties(addonType);
    this.valueContainerText.text = `UNLOCK YOUR ${displayName} FOR ${FontIcon.Tocium}${hubValue}?`.toUpperCase();
    this.addonType = addonType;
  }

  dispose() {
    const children = [...this.children];
    for (const child of children) {
      child.destroy({ children: true });
    }
  }
}
