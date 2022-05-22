import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { destroyChildren } from "@game/asorted/destroyChildren";
import { StakedCardInfo } from "@game/data/staking/models";
import { CardGlowInstanceManager } from "@game/fx/glow-overlay/CardGlowInstanceManager";
import { CardSprite } from "@game/ui/cards/CardSprite";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { EventBus } from "@sdk/core/EventBus";
import { SafeScrollbox } from "@sdk-pixi/display/SafeScrollbox";
import { StakedCardSlot } from "./StakedCardSlot";

export class StakedCardsList extends SafeScrollbox {
  private readonly ticker = GameSingletons.getTicker();
  private readonly assets = GameSingletons.getResources();

  private readonly glows = new CardGlowInstanceManager();

  public selectedCardSlot?: StakedCardSlot;

  constructor(public readonly events: EventBus) {
    super({
      noTicker: true,
      boxWidth: 725,
      boxHeight: 450,
      stopPropagation: true,
      divWheel: GameSingletons.getGameContext().app.view,
      overflowX: "none",
    });

    this.glows.scaleMultiplier.x = 1.22;
    this.glows.scaleMultiplier.y = 1.13;
  }

  async setCardsAsync(cardInfos: AsyncGenerator<StakedCardInfo, void, unknown>) {
    destroyChildren(this.content);

    let _x = 25;
    let _y = 25;
    let index = 0;

    for await (const info of cardInfos) {
      if (this.destroyed || !this.parent) return;

      const { card, owned } = info;

      const slot = new StakedCardSlot();
      slot.position.set(_x, _y);
      this.content.addChild(slot);

      const sprite = new CardSprite(card, true);
      slot.setCardSprite(sprite, owned);
      slot.setStakedCardInfo(info);

      _x += slot.width / 2 + 50;
      slot.scale.set(0.85);

      if ((index + 1) % 4 == 0 && index !== 0) {
        _x = 25;
        _y += slot.height / 2 + 85;
      }

      slot.onClick = () => this.selectSlot(slot);
      slot.playShowAnimation();

      index++;

      await this.ticker.delay(0.033);
    }
    this.content.addChild(this.addInvisibleBox(351));
  }

  setCards(cardInfos: Array<StakedCardInfo>) {
    destroyChildren(this.content);

    let _x = 25;
    let _y = 25;
    for (const key in cardInfos) {
      const { card, owned } = cardInfos[key];
      const index = parseInt(key);

      const slot = new StakedCardSlot();
      slot.position.set(_x, _y);
      this.content.addChild(slot);

      const sprite = new CardSprite(card, true);
      slot.setCardSprite(sprite, owned);
      slot.setStakedCardInfo(cardInfos[key]);

      _x += slot.width / 2 + 50;
      slot.scale.set(0.85);

      if ((index + 1) % 4 == 0 && index !== 0) {
        _x = 25;
        _y += slot.height / 2 + 85;
      }

      slot.onClick = () => this.selectSlot(slot);
    }
    this.content.addChild(this.addInvisibleBox(351));
    this.update();
  }

  selectSlot(slot: StakedCardSlot) {
    this.selectedCardSlot = slot;

    if (slot.cardSprite) {
      this.glows.setParents([slot.cardSprite]);
      this.events.dispatch("stakedCardSelected", slot.stakeInfo);
    } else {
      this.glows.setParents([]);
    }
  }

  createCardSlot(card: CardSprite, isOwned: boolean) {
    const container = new Container();
    //// Add background
    const bg = new Sprite(this.assets.getTexture("ui-station-dashboard/staking/public-tab/default/bg-spot.png"));
    bg.scale.set(0.75);
    container.addChild(bg);
    // Add card sprite
    container.addChild(card);
    card.position.set(20, 15);
    card.scale.set(0.25);
    if (isOwned) {
      const ownIcon = new Sprite(
        this.assets.getTexture("ui-station-dashboard/staking/vip-tab/1-home/owned-indicator.png")
      );
      ownIcon.position.set(card.x + card.width - ownIcon.width / 2, card.y - ownIcon.height / 2);
      container.addChild(ownIcon);
    }
    return container;
  }

  addInvisibleBox(px: number) {
    const box = new Sprite(Texture.EMPTY);
    box.width = this.boxWidth + 1;
    box.height = px;
    return box;
  }

  clearList() {
    const children = [...this.content.children];
    for (const child of children) {
      child.destroy({ children: true });
    }
    this.content.addChild(this.addInvisibleBox(426));
  }
}
