import { FontFamily } from "@game/constants/FontFamily";
import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";

export class DashboardTextBox extends Sprite {
  public readonly labels: Text[] = [];
  public padding = 35;

  constructor(textureId: string, ...texts: [] | [string] | [string, string]) {
    super(Texture.from(textureId));

    if (texts.length) {
      this.setTexts(...texts);
    }
  }

  public setTexts(...texts: [string] | [string, string]) {
    this.clearTexts();

    if (texts.length === 1) {
      const [text] = texts;
      const label = this.createText(text);
      this.addChild(label);
      this.labels.push(label);
    } else {
      const [text1, text2] = texts;
      const label1 = this.createText(text1);
      const label2 = this.createText(text2);
      this.addChild(label1, label2);
      this.labels.push(label1, label2);
    }

    this.updateTextPositions();
  }

  private createText(text: string) {
    return new Text(text, {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 24,
    });
  }

  public updateTextPositions() {
    const { width, height } = this.texture;

    if (this.labels.length === 1) {
      const [label] = this.labels;

      label.anchor.set(0.5, 0.5);
      label.position.set(width / 2, height / 2);
    } else {
      const [label1, label2] = this.labels;

      label1.anchor.set(0.0, 0.5);
      label1.position.set(this.padding, height / 2);

      label2.anchor.set(1.0, 0.5);
      label2.position.set(width - this.padding, height / 2);
    }
  }

  public clearTexts() {
    const labels = [...this.labels];
    for (const label of labels) {
      label.destroy();
    }

    this.labels.length = 0;
  }
}
