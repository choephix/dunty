import { GameSingletons } from "@game/app/GameSingletons";
import { StationEntity } from "@game/data/entities/StationEntity";
import { calculateCommodityRateHighlightLevel } from "@game/ui/formatters/calculateCommodityRateHighlightLevel";
import { Container } from "@pixi/display";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";

export class CommodityRateIconsRow extends Container {
  private readonly tweeener = new TemporaryTweeener(this);
  private readonly assets = GameSingletons.getResources();

  constructor(station: StationEntity, maxIconsCount: number = 5) {
    super();

    const simpleFactory = GameSingletons.getSimpleObjectFactory();
    const { tooltips } = GameSingletons.getUIServices();

    const commodityTypeRates = [...station.waxRRContractData.type_rates];
    commodityTypeRates.sort((a, b) => b.multiplier - a.multiplier);
    if (commodityTypeRates.length > maxIconsCount) {
      commodityTypeRates.length = maxIconsCount;
    }

    for (const [i, { type: iconName, multiplier: rateMultiplier }] of commodityTypeRates.entries()) {
      const [X, Y] = [40 * (i + 0.5 - 0.5 * commodityTypeRates.length), 0];
      const pad = simpleFactory.createSprite(`ui-popups/bevel-sm.png`);
      pad.position.set(X, Y);
      pad.anchor.set(0.5, 0.5);
      pad.scale.set(0.75);
      this.addChild(pad);

      const highlightLevel = calculateCommodityRateHighlightLevel(rateMultiplier);
      const highlight = simpleFactory.createSprite(`ui-popups/bevel-sm-highlight.png`);
      highlight.position.set(X, Y);
      highlight.anchor.set(0.5, 0.5);
      highlight.scale.set(0.75);
      highlight.alpha = highlightLevel;
      this.addChild(highlight);

      const icon = simpleFactory.createSprite(`ui-icons/commodity/${iconName}.png`);
      const iconScale = 21 / icon.width;
      icon.position.set(X, Y);
      icon.anchor.set(0.5, 0.5);
      icon.scale.set(iconScale);
      this.addChild(icon);

      tooltips.registerTarget(pad, iconName.replace(/_/g, " ").toUpperCase());
    }
  }

  public playShowAnimation() {
    return this.tweeener.from(this.children, {
      pixi: {
        scale: 0,
        alpha: 0,
      },
      duration: 0.19,
      ease: "back.out",
      stagger: 0.017,
    });
  }
}
