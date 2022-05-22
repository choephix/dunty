import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { modifyPivotWithoutChangingPosition } from "@game/asorted/centerPivotWithoutChangingPosition";
import { DefaultTextStyle } from "@game/constants/defaults/DefaultTextStyle";
import { FontFamily } from "@game/constants/FontFamily";
import { getRarityColors } from "@game/constants/RarityColors";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { CardAttributeUpgradeImpactIndicator } from "../../../components/CardAttributeUpgradeImpactIndicator";
import { CenturyTrainPartEntity } from "../data/CenturyTrainPartEntity";

export class SelectedPartDescription extends Container {
  private readonly assets = GameSingletons.getResources();
  private readonly tweeener = new TemporaryTweeener(this);

  constructor(private readonly data: CenturyTrainPartEntity) {
    super();

    this.addBackground();
    this.addHeader();
    this.addParagraph();
    this.addAttributeBoxes();
  }

  private addBackground(): void {
    const fill = new Sprite(this.assets.getTexture("ui-market-window-ct-parts/part-information/pad.png"));
    fill.name = "Discovered Part";
    fill.position.set(587, 42);
    fill.scale.set(1.45);
    fill.tint = getRarityColors(this.data.rarity).main.toInt();

    const stroke = new Sprite(this.assets.getTexture("ui-market-window-ct-parts/part-information/frame-stroked.png"));
    fill.addChild(stroke);

    modifyPivotWithoutChangingPosition(fill);

    this.addChild(fill);
  }

  private addHeader(): void {
    const headerContent = this.data.part;
    const header = new Text(headerContent, {
      ...DefaultTextStyle,
      fontFamily: FontFamily.Croogla,
      fontSize: 64,
      align: "center",
    });
    header.name = "Part Name";
    header.anchor.set(0.5);
    header.position.set(1005, 140);
    this.addChild(header);

    modifyPivotWithoutChangingPosition(header);
  }

  private addParagraph(): void {
    const paragraphContent = this.data.information;
    const paragraph = new Text(paragraphContent, {
      ...DefaultTextStyle,
      fontFamily: FontFamily.DefaultThin,
      fontSize: 32,
      align: "center",
      wordWrap: true,
      wordWrapWidth: 680,
    });
    paragraph.name = "Part Information";
    paragraph.anchor.set(0.5);
    paragraph.position.set(1005, 270);
    this.addChild(paragraph);

    modifyPivotWithoutChangingPosition(paragraph);
  }

  private addAttributeBoxes(): void {
    const centerX = 210;
    const container = new Container();

    //bottom text
    const attributeImpactLabelText = "Fusion Impact";
    const attributeImpactLabel = new Text(attributeImpactLabelText.toUpperCase(), {
      ...DefaultTextStyle,
      fontSize: 32,
    });
    container.addChild(attributeImpactLabel);
    attributeImpactLabel.anchor.set(0.5);
    attributeImpactLabel.position.set(25, 360);

    const attributeIndicatorsPositionY = 520;
    const attributeIndicatorsDeltaX = 240;
    const textureRoot = "ui-market-window-compositions";

    // Distance indictator
    const propertyIndicatorDistance = new CardAttributeUpgradeImpactIndicator(
      `${textureRoot}/1-attribute-bg-distance.png`,
      `${textureRoot}/1-gear-d.png`,
      "Distance"
    );
    container.addChild(propertyIndicatorDistance);
    propertyIndicatorDistance.scale.set(0.75);
    propertyIndicatorDistance.setValue(this.data.distance);
    propertyIndicatorDistance.position.set(centerX - attributeIndicatorsDeltaX, attributeIndicatorsPositionY);

    // Luck indicator
    const propertyIndicatorLuck = new CardAttributeUpgradeImpactIndicator(
      `${textureRoot}/2-attribute-bg-hauling.png`,
      `${textureRoot}/4-gear-l.png`,
      "Luck"
    );
    container.addChild(propertyIndicatorLuck);
    propertyIndicatorLuck.scale.set(0.75);
    propertyIndicatorLuck.setValue(this.data.luck);
    propertyIndicatorLuck.position.set(centerX - 80, attributeIndicatorsPositionY);

    // Hauling indicator
    const propertyIndicatorHaulingPower = new CardAttributeUpgradeImpactIndicator(
      `${textureRoot}/2-attribute-bg-hauling.png`,
      `${textureRoot}/2-gear-hp.png`,
      "Hauling"
    );
    container.addChild(propertyIndicatorHaulingPower);
    propertyIndicatorHaulingPower.scale.set(0.75);
    propertyIndicatorHaulingPower.setValue(this.data.haulingPower);
    propertyIndicatorHaulingPower.position.set(centerX + 80, attributeIndicatorsPositionY);

    // Speed indicator
    const propertyIndicatorSpeed = new CardAttributeUpgradeImpactIndicator(
      `${textureRoot}/3-attribute-bg-speed.png`,
      `${textureRoot}/3-gear-s.png`,
      "Speed"
    );
    container.addChild(propertyIndicatorSpeed);
    propertyIndicatorSpeed.scale.set(0.75);
    propertyIndicatorSpeed.setValue(this.data.speed);
    propertyIndicatorSpeed.position.set(centerX + attributeIndicatorsDeltaX, attributeIndicatorsPositionY);

    this.addChild(container);
    container.position.set(783, 52);
    container.name = "Attribute wrapper";

    modifyPivotWithoutChangingPosition(container);
  }

  public async playShowAnimation() {
    await this.tweeener.from(this.children, { pixi: { scale: 0 }, duration: 0.27, stagger: 0.13, ease: "power.out" });
  }
}
