import { GameSingletons } from "@game/app/GameSingletons";
import { DefaultTextStyle } from "@game/constants/defaults/DefaultTextStyle";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { fitObjectInRectangle } from "@sdk-pixi/layout/fitObjectInRectangle";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { lerp } from "@sdk/utils/math";

const TOP_POSITION_EXPANDED = Object.freeze({ x: -48, y: -210 });
const TOP_POSITION_COLLAPSED = Object.freeze({ x: -48, y: -110 });

export class LocoBoostJar extends Container {
  private readonly simpleFactory = GameSingletons.getSimpleObjectFactory();

  private readonly glassTube: Sprite;
  private readonly bottom: Sprite;
  private readonly top: Sprite;
  private readonly boostValueLabel: Text;
  private sideLabel?: Text;

  public currentValue: number | null = null;

  public expanded: boolean = false;
  public expansionProgress: number = 0;
  private readonly tweenExpansionProgress = new TemporaryTweeener(this).quickTo(this, "expansionProgress", {
    duration: 0.31,
    ease: "power2.in",
    onUpdate: this.updateElementStates.bind(this),
    onComplete: this.updateElementStates.bind(this),
    overwrite: true,
  });

  constructor() {
    super();

    //// Create bottom
    this.bottom = this.simpleFactory.createSprite("ui-cards-boost-jars/bottom.png", { x: -48, y: -70 });
    this.addChild(this.bottom);

    //// Create glass
    this.glassTube = this.simpleFactory.createSprite("ui-cards-boost-jars/glass.png", { x: -40, y: -157 });
    this.addChild(this.glassTube);

    //// Create top
    this.top = this.simpleFactory.createSprite("ui-cards-boost-jars/top.png", TOP_POSITION_EXPANDED);
    this.addChild(this.top);

    //// Create boost value text label
    this.boostValueLabel = this.simpleFactory.createText("", {
      ...DefaultTextStyle,
      fontSize: 40,
      lineHeight: 40,
      fontWeight: "bold",
    });
    this.boostValueLabel.position.set(48, 110);
    this.boostValueLabel.anchor.set(0.5);
    this.addChild(this.boostValueLabel);

    this.updateElementStates();
  }

  updateElementStates() {
    this.top.position.set(
      lerp(TOP_POSITION_COLLAPSED.x, TOP_POSITION_EXPANDED.x, this.expansionProgress),
      lerp(TOP_POSITION_COLLAPSED.y, TOP_POSITION_EXPANDED.y, this.expansionProgress)
    );

    this.glassTube.visible = this.expansionProgress > 0.05;
    this.glassTube.alpha = this.expansionProgress * 4 - 3;

    this.boostValueLabel.visible = this.expansionProgress > 0.05;
    this.boostValueLabel.alpha = this.expansionProgress * 4 - 3;

    if (this.sideLabel) {
      this.sideLabel.visible = this.expansionProgress > 0.05;
      this.sideLabel.scale.set(this.expansionProgress);
      this.sideLabel.alpha = this.expansionProgress;
    }
  }

  setExpanded(expanded: boolean) {
    this.expanded = expanded;

    return this.tweenExpansionProgress(expanded ? 1 : 0);
  }

  setImpactValue(value: number | null) {
    this.currentValue = value;

    const showValue = value != undefined && value > 0;

    if (this.sideLabel) {
      this.sideLabel.visible = showValue;
    }

    if (showValue) {
      const boostValueLabelText = "+" + value;
      this.boostValueLabel.text = boostValueLabelText;
      this.boostValueLabel.angle = -this.angle;
      fitObjectInRectangle(this.boostValueLabel, this.glassTube);
    }

    return this.setExpanded(showValue);
  }

  addBaseIcon(iconType: string) {
    const iconContainer = new Container();

    const bg = this.simpleFactory.createSprite("ui-cards-boost-jars/icon-holder.png");
    bg.anchor.set(0.5);
    iconContainer.addChild(bg);

    const icon = this.simpleFactory.createSprite(`ui-cards-boost-jars/icons/${iconType}.png`);
    icon.anchor.set(0.5);
    icon.scale.set(0.75);
    iconContainer.addChild(icon);

    iconContainer.position.set(0, -40);
    iconContainer.scale.set(0.5);
    iconContainer.angle = -this.angle;
    return this.addChild(iconContainer);
  }

  addCapIcon(iconType: string) {
    const iconContainer = new Container();

    const icon = this.simpleFactory.createSprite(`ui-cards-boost-jars/icons/${iconType}.png`);
    icon.anchor.set(0.5);
    icon.angle = 90;
    iconContainer.addChild(icon);

    iconContainer.position.set(48, 14);
    iconContainer.scale.set(1.0, 0.23);
    return this.top.addChild(iconContainer);
  }

  addSideLabel(labelText: string) {
    this.sideLabel = this.simpleFactory.createText(
      labelText.toUpperCase(),
      { fontSize: 20, lineHeight: 15 },
      { x: 70, y: 60 }
    );
    this.sideLabel.position.set(-60, -100);
    this.sideLabel.anchor.set(0.5);
    this.sideLabel.angle = 90;
    this.addChild(this.sideLabel);
  }

  setAngle(angle: number) {
    this.angle = angle;
    this.boostValueLabel.rotation -= angle;
  }
}

export module LocoBoostJar {
  export function createStandingJar(iconType: string) {
    const boostJar = new LocoBoostJar();
    boostJar.addBaseIcon(iconType);
    boostJar.setExpanded(false);
    return boostJar;
  }

  export function createSidewaysJar(iconType: string) {
    const boostJar = new LocoBoostJar();
    boostJar.addCapIcon(iconType);
    boostJar.addSideLabel(iconType.toUpperCase());
    boostJar.setAngle(-90);
    boostJar.setExpanded(false);
    return boostJar;
  }
}
