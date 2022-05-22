import { GameContext } from "@game/app/app";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { Container } from "@pixi/display";
import * as WAX from "@sdk-integration/contracts";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { makeItemCard } from "./FuelPageItemCard";
import { Point } from "@pixi/math";
import { GameSingletons } from "@game/app/GameSingletons";

const ITEM_CARD_SCALE = 0.86;
const ITEM_CARD_Y_HIDDEN = 600;
const ITEM_CARD_Y = 700;

export class FuelPage extends EnchantedContainer {
  public readonly titleString = "Fuel";

  protected itemCard1?: Container;
  protected itemCard2?: Container;

  private readonly tweeener = new TemporaryTweeener(this);
  private readonly context = GameSingletons.getGameContext();

  async loadAndInitialize() {
    const { assets, contracts, animator, userData, userDataCtrl, spinner, modals } = this.context;
    const fuelPricesInfo = await contracts.market.greateFuelPricesInformation();

    const center = new Point(1200, 700);

    this.itemCard1 = makeItemCard(this.context, WAX.MarketFuelType.Coal, fuelPricesInfo);
    this.itemCard2 = makeItemCard(this.context, WAX.MarketFuelType.Diesel, fuelPricesInfo);

    this.itemCard1.scale.set(ITEM_CARD_SCALE);
    this.itemCard2.scale.set(ITEM_CARD_SCALE);

    this.itemCard1.position.set(center.x - 0.44 * 691, center.y);
    this.itemCard2.position.set(center.x + 0.44 * 691, center.y);

    this.itemCard1.alpha = 0;
    this.itemCard2.alpha = 0;

    this.addChild(this.itemCard1, this.itemCard2);
  }

  public async playShowAnimation() {
    const itemCard1 = await this.enchantments.waitUntil(() => this.itemCard1);
    const itemCard2 = await this.enchantments.waitUntil(() => this.itemCard2);
    await this.tweeener.fromTo(
      [itemCard1, itemCard2],
      {
        pixi: {
          y: 540,
          alpha: 0,
        },
      },
      {
        pixi: {
          y: 700,
          alpha: 1,
        },
        stagger: 0.2,
        duration: 0.53,
        ease: "back.out",
      }
    );
  }

  public async playHideAnimation() {
    if (this.itemCard1 && this.itemCard2) {
      return this.tweeener.to([this.itemCard1, this.itemCard2], {
        pixi: {
          y: 580,
          alpha: 0,
        },
        duration: 0.25,
        stagger: 0.05,
        ease: "back.in",
      });
    }
  }
}
