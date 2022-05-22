import { GameSingletons } from "@game/app/GameSingletons";
import { SpriteWithText } from "@game/asorted/SpriteWithText";
import { GlowFilterService } from "@game/ui/fx/GlowFilterService";
import { Container } from "@pixi/display";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { CardAttributeUpgradeImpactIndicatorMechanic } from "../../../components/CardAttributeUpgradeImpactIndicatorMechanic";
import { CenturyTrainPartEntity } from "../data/CenturyTrainPartEntity";

export class FusionImpactAttributesPane extends Container {
  private readonly context = GameSingletons.getGameContext();

  private attributeImpactIndicatorDistance?: CardAttributeUpgradeImpactIndicatorMechanic;
  private attributeImpactIndicatorLuck?: CardAttributeUpgradeImpactIndicatorMechanic;
  private attributeImpactIndicatorHaulingPower?: CardAttributeUpgradeImpactIndicatorMechanic;
  private attributeImpactIndicatorSpeed?: CardAttributeUpgradeImpactIndicatorMechanic;

  private readonly glowService: GlowFilterService = new GlowFilterService();

  constructor() {
    super();

    //// Add background
    const bg = this.context.simpleFactory.createSprite("ui-market-window-ct-parts/fusion/base-loco-select.png");
    this.addChild(bg);

    //// Add attribute boxes
    const attrBoxes = this.addAttributeBoxes();
    attrBoxes.position.set(100, 100);
    this.addChild(attrBoxes);
  }

  public addCenterButton(btnLabel: string, onButtonClick: () => void) {
    const buttonTextureId = "ui-market-window-ct-parts/fusion/fuse-btn.png";
    const button = new SpriteWithText(buttonTextureId, btnLabel.toUpperCase(), { fontSize: 42 });
    button.position.set(510, 110);
    buttonizeDisplayObject(button, onButtonClick);
    this.addChild(button);

    this.glowService.addFilter(button);
  }

  private addAttributeBoxes(): Container {
    const container = new Container();
    const textureRoot = "ui-market-window-compositions";

    const y = 25;
    // Distance indictator
    this.attributeImpactIndicatorDistance = new CardAttributeUpgradeImpactIndicatorMechanic(
      `${textureRoot}/1-attribute-bg-distance.png`,
      `${textureRoot}/1-gear-d.png`,
      "Distance"
    );
    container.addChild(this.attributeImpactIndicatorDistance);
    this.attributeImpactIndicatorDistance.scale.set(0.75);
    this.attributeImpactIndicatorDistance.position.set(50, y);
    // Luck indicator
    this.attributeImpactIndicatorLuck = new CardAttributeUpgradeImpactIndicatorMechanic(
      `${textureRoot}/2-attribute-bg-hauling.png`,
      `${textureRoot}/4-gear-l.png`,
      "Luck"
    );
    container.addChild(this.attributeImpactIndicatorLuck);
    this.attributeImpactIndicatorLuck.scale.set(0.75);
    this.attributeImpactIndicatorLuck.position.set(225, y);
    // Hauling indicator
    this.attributeImpactIndicatorHaulingPower = new CardAttributeUpgradeImpactIndicatorMechanic(
      `${textureRoot}/2-attribute-bg-hauling.png`,
      `${textureRoot}/2-gear-hp.png`,
      "Hauling"
    );
    container.addChild(this.attributeImpactIndicatorHaulingPower);
    this.attributeImpactIndicatorHaulingPower.scale.set(0.75);
    this.attributeImpactIndicatorHaulingPower.position.set(1075, y);
    // Speed indicator
    this.attributeImpactIndicatorSpeed = new CardAttributeUpgradeImpactIndicatorMechanic(
      `${textureRoot}/3-attribute-bg-speed.png`,
      `${textureRoot}/3-gear-s.png`,
      "Speed"
    );
    container.addChild(this.attributeImpactIndicatorSpeed);
    this.attributeImpactIndicatorSpeed.scale.set(0.75);
    this.attributeImpactIndicatorSpeed.position.set(1250, y);
    this.addChild(container);
    container.name = "Attribute wrapper";

    return container;
  }

  setAttributeValues(data: CenturyTrainPartEntity | null) {
    if (
      !this.attributeImpactIndicatorDistance ||
      !this.attributeImpactIndicatorLuck ||
      !this.attributeImpactIndicatorHaulingPower ||
      !this.attributeImpactIndicatorSpeed ||
      !data
    ) {
      return new Error("Attribute values undefiend");
    }
    this.attributeImpactIndicatorDistance.setValue(data.distance);
    this.attributeImpactIndicatorLuck.setValue(data.luck);
    this.attributeImpactIndicatorHaulingPower.setValue(data.haulingPower);
    this.attributeImpactIndicatorSpeed.setValue(data.speed);
  }

  setMaxAttributeValues(data: {
    distance: { total: number };
    speed: { total: number };
    haul: { total: number };
    luck: { total: number };
  }) {
    if (
      !this.attributeImpactIndicatorDistance ||
      !this.attributeImpactIndicatorLuck ||
      !this.attributeImpactIndicatorHaulingPower ||
      !this.attributeImpactIndicatorSpeed
    ) {
      return new Error("Attribute values undefiend");
    }
    this.attributeImpactIndicatorDistance.setMaxValueLabel(data.distance.total);
    this.attributeImpactIndicatorLuck.setMaxValueLabel(data.luck.total);
    this.attributeImpactIndicatorHaulingPower.setMaxValueLabel(data.haul.total);
    this.attributeImpactIndicatorSpeed.setMaxValueLabel(data.speed.total);
  }
}
