import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { GreenButton } from "@game/ui/railroader-dash/panels/settings/components/GreenButton";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";

export class BottomBar extends Container {
  protected readonly context: GameContext = GameSingletons.getGameContext();

  textBoxLabel!: Text;
  textBoxPad!: Container;
  textBoxWrapper!: Container;

  button?: GreenButton;

  constructor() {
    super();

    this.addTextBox();
  }

  private addTextBox() {
    this.textBoxWrapper = new Container();

    this.textBoxPad = new Sprite(
      this.context.assets.getTexture("ui-station-dashboard/staking/manage-tab/manage-home/text-bar.png")
    );
    this.textBoxWrapper.addChild(this.textBoxPad);
    this.textBoxPad = this.textBoxPad;

    this.textBoxLabel = new Text("", {
      fontFamily: FontFamily.Default,
      fontSize: 28,
      fill: 0xffffff,
    });
    this.textBoxLabel.anchor.set(0.5);
    this.textBoxLabel.position.set(
      this.textBoxPad.x + this.textBoxPad.width / 2,
      this.textBoxPad.y + this.textBoxPad.height / 2
    );
    this.textBoxWrapper.addChild(this.textBoxLabel);
    this.textBoxWrapper.position.set(65, 400);
    this.textBoxWrapper.scale.set(0.5);

    this.addChild(this.textBoxWrapper);
    this.textBoxWrapper = this.textBoxWrapper;
  }

  addButton(labelText: string, onClick: () => void) {
    this.button = new GreenButton(labelText.toUpperCase(), () => onClick?.(), 300);
    this.button.position.set(505, 398);
    this.button.scale.set(0.42);
    this.addChild(this.button);

    this.setTextBoxWidthPercent(0.8);
  }

  removeButton() {
    this.button?.destroy();
    this.setTextBoxWidthPercent(1.0);
  }

  setText(text: string) {
    const padding = 25;
    this.textBoxLabel.text = text;
    if (this.textBoxLabel?.width > (this.textBoxLabel?.parent.children[0] as Sprite).width - padding) {
      this.textBoxLabel.scale.set(this.textBoxLabel.scale.x - 0.1);
      this.setText(text);
    }
  }

  setTextBoxWidthPercent(widthPercent: number) {
    this.textBoxPad.scale.x = widthPercent;
    this.textBoxLabel.position.set(
      this.textBoxPad.x + this.textBoxPad.width / 2,
      this.textBoxPad.y + this.textBoxPad.height / 2
    );
  }
}
