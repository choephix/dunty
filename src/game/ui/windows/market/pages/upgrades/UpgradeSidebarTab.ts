import { FontFamily } from "@game/constants/FontFamily";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";

export class UpgradeSidebarTab extends Container {
  private readonly padInactive: Sprite;
  private readonly padActive: Sprite;
  private readonly text: Text;

  public active: boolean = false;

  private readonly animatePadActiveAlpha;

  constructor(activeTexture: Texture, inactiveTexture: Texture, label: string) {
    super();

    this.padInactive = new Sprite(inactiveTexture);
    this.addChild(this.padInactive);

    this.padActive = new Sprite(activeTexture);
    this.padActive.alpha = 0;
    this.addChild(this.padActive);

    this.text = new Text(label, {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 30,
    });
    this.text.anchor.set(0.5);
    this.text.position.set(this.width / 2, this.height / 2);
    this.addChild(this.text);

    this.interactive = true;
    this.buttonMode = true;

    this.animatePadActiveAlpha = new TemporaryTweeener(this).quickTo(this.padActive, "alpha");
  }

  setDisabled(disabled: boolean) {
    this.interactive = !disabled;
    this.buttonMode = !disabled;
    this.text.alpha = disabled ? 0.15 : 1;
  }

  setActive(active: boolean) {
    this.active = active;
    this.animatePadActiveAlpha(active ? 1 : 0);
  }
}
