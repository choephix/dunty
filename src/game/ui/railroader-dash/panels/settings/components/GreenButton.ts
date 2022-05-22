import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { Container } from "@pixi/display";
import { NineSlicePlane } from "@pixi/mesh-extras";
import { Text } from "@pixi/text";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";

export class GreenButton extends Container {
  constructor(label: string, public onClick: (() => unknown) | null, width: number, heightPadding?: number) {
    super();

    const { assets } = GameSingletons.getGameContext();
    const greenButton = new NineSlicePlane(assets.getTexture("ui-railroader-dashboard/btn-green.png"), 15, 15, 15, 15);
    const text = new Text(label, {
      fill: 0xffffff,
      fontSize: 30,
      fontFamily: FontFamily.Default,
    });

    greenButton.width = width;
    //height padding is added to top and bottom of text height
    if (heightPadding != undefined) {
      greenButton.height = heightPadding + text.height + heightPadding;
    }

    text.anchor.set(0.5, 0.5);
    text.position.set(greenButton.width / 2, greenButton.height / 2);

    greenButton.interactive = true;
    greenButton.buttonMode = true;

    buttonizeDisplayObject(greenButton, () => this.onClick?.());

    greenButton.addChild(text);

    this.addChild(greenButton);
  }
}
