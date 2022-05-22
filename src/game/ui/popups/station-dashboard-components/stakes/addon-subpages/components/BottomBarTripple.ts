import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { playFadeInAnimation } from "@game/asorted/animations/tweenAlphaProperty";
import { FontFamily } from "@game/constants/FontFamily";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";

export class BottomBarTripple extends Container {
  protected readonly context: GameContext = GameSingletons.getGameContext();

  updateTextToInfoVIP(textData: { railRoader: string; commission: string; timeStaked: string }) {
    this.clearChildren(this);

    this.addMultipleTextBoxes(
      [
        "RAILROADER: " + textData.railRoader,
        "COMMISSION: " + textData.commission + "%",
        "TIME STAKED: " + textData.timeStaked,
      ],
      this.context.assets.getTexture("ui-station-dashboard/staking/public-tab/selected-locomotive/sm-text-bar.png"),
      24,
      [
        { x: 0, y: 0 },
        { x: 195, y: 0 },
        { x: 390, y: 0 },
      ]
    );
  }

  updateTextToInfoPublic(textData: { railRoader: string; commission: string; expiry: string }) {
    this.clearChildren(this);

    this.addMultipleTextBoxes(
      [
        "RAILROADER: " + textData.railRoader,
        "COMMISSION: " + textData.commission + "%",
        "EXPIRES IN: " + textData.expiry,
      ],
      this.context.assets.getTexture("ui-station-dashboard/staking/public-tab/selected-locomotive/sm-text-bar.png"),
      24,
      [
        { x: 0, y: 0 },
        { x: 195, y: 0 },
        { x: 390, y: 0 },
      ]
    );
  }

  public setSingularTextBoxMessage(message: string) {
    this.clearChildren(this);

    this.position.set(45, 400);

    const boxTexture = this.context.assets.getTexture(
      "ui-station-dashboard/staking/manage-tab/manage-home/text-bar.png"
    );
    const box = this.createTextBox(message, boxTexture, 26);
    box.scale.set(0.5);
    this.addChild(box);
  }

  private addMultipleTextBoxes(
    labels: Array<string>,
    boxTexture: Texture,
    fontSize: number,
    coords: Array<{ x: number; y: number }>
  ) {
    for (const label in labels) {
      const box = this.createTextBox(labels[label], boxTexture, fontSize);
      box.position.set(coords[label].x, coords[label].y);
      box.scale.set(0.5);
      this.addChild(box);
    }
    this.position.set(45, 400);
  }

  private createTextBox(label: string, boxTexture: Texture, fontSize: number) {
    const container = new Container();
    const bg = new Sprite(boxTexture);
    container.addChild(bg);
    const text = new Text(label.toUpperCase(), {
      fontFamily: FontFamily.Default,
      fontSize: fontSize,
      fill: 0xffffff,
    });
    text.anchor.set(0.5);
    text.position.set(bg.x + bg.width / 2, bg.y + bg.height / 2);
    container.addChild(text);
    container.scale.set(0.6);
    return container;
  }

  revertText(textString: string) {
    this.clearChildren(this);
    const container = this.createTextBox(
      textString,
      this.context.assets.getTexture("ui-station-dashboard/staking/public-tab/selected-locomotive/md-text-bar.png"),
      24
    );
    this.addChild(container);
    this.position.set(45, 400);
  }

  private clearChildren(container: Container) {
    const children = [...container.children];
    for (const child of children) {
      child.destroy({ children: true });
    }
  }

  playShowAnimation() {
    return playFadeInAnimation(this);
  }
}
