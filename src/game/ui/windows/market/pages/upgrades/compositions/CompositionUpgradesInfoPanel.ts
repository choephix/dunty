import { GameSingletons } from "@game/app/GameSingletons";
import { BitmapFontName, FontFamily } from "@game/constants/FontFamily";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { MarketPriceConstituent } from "@game/data/entities/PriceConstituent";
import { Container } from "@pixi/display";
import { GlowFilter } from "@pixi/filter-glow";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { BitmapText, IBitmapTextStyle } from "@pixi/text-bitmap";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { EventBus } from "@sdk/core/EventBus";
import { CallbackList } from "@sdk/utils/callbacks/CallbackList";
import { CardAttributeUpgradeImpactIndicator } from "../../../components/CardAttributeUpgradeImpactIndicator";

export type CompositionUpgradesSidePanelData = {
  distance: number;
  haulingPower: number;
  speed: number;
  priceConstituents: MarketPriceConstituent[];
  nextComposition: string;
};

export class CompositionUpgradesInfoPanel extends EnchantedContainer {
  private readonly assets = GameSingletons.getResources();

  public readonly events = new EventBus<{
    onUpgradeButtonClick: () => void;
  }>();

  private readonly onContentClear = new CallbackList();

  private _data: CompositionUpgradesSidePanelData | null = null;
  get data(): CompositionUpgradesSidePanelData | null {
    return this._data;
  }

  private readonly title: BitmapText;
  private readonly subtitle: Text;

  private readonly centerX = 210;

  constructor() {
    super();

    //title
    const titleLabelStyle = {
      fontName: BitmapFontName.CelestialTypeface,
      align: "center",
    } as IBitmapTextStyle;
    this.title = this.addChild(new BitmapText("", titleLabelStyle));
    this.title.updateText();
    this.title.anchor.set(0.5);
    this.title.scale.set(1.4);
    this.title.position.set(this.centerX, 25);
    this.title.name = "title";

    //subtitle
    const subtitleText = `Upgrading this Locomotive\nwill burn the original.`;
    this.subtitle = new Text(subtitleText, {
      fill: "#FFFFFF",
      fontFamily: FontFamily.DefaultThin,
      fontSize: 40,
      align: "center",
    });
    this.subtitle.anchor.set(0.5);
    this.subtitle.position.set(this.centerX, 170);
    this.addChild(this.subtitle);

    this.enchantments.onDestroy(() => this.events.clear());
  }

  setData(data: CompositionUpgradesSidePanelData | null) {
    this._data = data;
    if (this._data) {
      this.fillContent_LocomotiveSelected();
    } else {
      this.fillContent_NoLocomotiveSelected();
    }
  }

  clearContent() {
    this.onContentClear.callAllAndClear();
  }

  private fillContent_NoLocomotiveSelected() {
    this.clearContent();

    this.title.text = "Composition Upgrade";
    this.subtitle.text = "Upgrading a Locomotive's Composition\nwill increase its attributes.";

    //gears image
    const splash = new Sprite(this.assets.getTexture("ui-market-window-compositions/default-comp-gears.png"));

    this.addChild(splash);
    splash.anchor.set(0.5);
    splash.position.set(this.centerX, 500);
    this.onContentClear.push(() => splash.destroy());

    //bottom text
    const bottomText = new Text("Select a Locomotive to proceed.", {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 32,
    });
    this.addChild(bottomText);
    bottomText.anchor.set(0.5);
    bottomText.position.set(this.centerX, 833);
    this.onContentClear.push(() => bottomText.destroy());
  }

  private fillContent_LocomotiveSelected() {
    this.clearContent();

    if (this.data == null) {
      throw new Error("fillContent_LocomotiveSelected() called without data");
    }

    this.title.text = "Upgrade Details";
    this.subtitle.text = "Upgrading this Locomotive will\nburn the original.";

    //bottom text
    const attributeImpactLabelText = "Attribute Impact";
    const attributeImpactLabel = new Text(attributeImpactLabelText.toUpperCase(), {
      fill: "#00FFFF",
      fontFamily: FontFamily.Default,
      fontSize: 32,
    });
    this.addChild(attributeImpactLabel);
    attributeImpactLabel.anchor.set(0.5);
    attributeImpactLabel.position.set(25, 360);
    this.onContentClear.push(() => attributeImpactLabel.destroy());

    const attributeIndicatorsPositionY = 520;
    const attributeIndicatorsDeltaX = 240;
    const textureRoot = "ui-market-window-compositions";

    // Distance indictator
    const propertyIndicatorDistance = new CardAttributeUpgradeImpactIndicator(
      `${textureRoot}/1-attribute-bg-distance.png`,
      `${textureRoot}/1-gear-d.png`,
      "Distance"
    );
    this.addChild(propertyIndicatorDistance);
    this.onContentClear.push(() => propertyIndicatorDistance.destroy());
    propertyIndicatorDistance.setValue(this.data.distance);
    propertyIndicatorDistance.position.set(this.centerX - attributeIndicatorsDeltaX, attributeIndicatorsPositionY);

    // Hauling indicator
    const propertyIndicatorHaulingPower = new CardAttributeUpgradeImpactIndicator(
      `${textureRoot}/2-attribute-bg-hauling.png`,
      `${textureRoot}/2-gear-hp.png`,
      "Hauling"
    );
    this.addChild(propertyIndicatorHaulingPower);
    this.onContentClear.push(() => propertyIndicatorHaulingPower.destroy());
    propertyIndicatorHaulingPower.setValue(this.data.haulingPower);
    propertyIndicatorHaulingPower.position.set(this.centerX, attributeIndicatorsPositionY);

    // Speed indicator
    const propertyIndicatorSpeed = new CardAttributeUpgradeImpactIndicator(
      `${textureRoot}/3-attribute-bg-speed.png`,
      `${textureRoot}/3-gear-s.png`,
      "Speed"
    );
    this.addChild(propertyIndicatorSpeed);
    this.onContentClear.push(() => propertyIndicatorSpeed.destroy());
    propertyIndicatorSpeed.setValue(this.data.speed);
    propertyIndicatorSpeed.position.set(this.centerX + attributeIndicatorsDeltaX, attributeIndicatorsPositionY);

    // Cost text
    console.log(`priceConstituents`, this.data.priceConstituents);

    const costLabelText = `Cost ` + this.data.priceConstituents.map(c => c.formatted).join(" ");
    const costLabel = new Text(costLabelText.toUpperCase(), {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 50,
    });
    this.addChild(costLabel);
    costLabel.anchor.set(0.5);
    costLabel.position.set(this.centerX, 670);
    this.onContentClear.push(() => costLabel.destroy());

    // Button
    // TODO: interpolate composition
    const buttonContainer = new Container();
    const buttonSprite = new Sprite(this.assets.getTexture(`${textureRoot}/btn-upgrade.png`));
    buttonSprite.filters = [
      new GlowFilter({
        outerStrength: 2.6,
        distance: 12,
        color: 0x00ffff,
      }),
    ];
    this.onContentClear.push(() => buttonSprite.destroy());

    const nextComposition = this.data.nextComposition;
    const buttonLabelText = `UPGRADE TO ${nextComposition}`;
    const buttonLabel = new Text(buttonLabelText.toUpperCase(), {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 44,
      align: "center",
    });
    buttonLabel.name = "buttonLabel";
    buttonLabel.position.set(334, 45);
    buttonLabel.anchor.set(0.5);
    buttonLabel.scale.x = Math.min(1, (0.88 * buttonSprite.width) / buttonLabel.width);

    buttonContainer.name = "buttonContainer";
    buttonContainer.position.set(-119, 736);
    buttonContainer.buttonMode = true;
    buttonContainer.interactive = true;

    buttonContainer.addChild(buttonSprite);
    buttonContainer.addChild(buttonLabel);
    this.addChild(buttonContainer);

    buttonizeDisplayObject(buttonContainer, () => this.events.dispatch("onUpgradeButtonClick"));
    this.onContentClear.push(() => buttonContainer.destroy());
  }
}
