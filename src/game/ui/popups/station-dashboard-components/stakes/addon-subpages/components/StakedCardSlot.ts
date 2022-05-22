import { GameSingletons } from "@game/app/GameSingletons";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { StakedCardInfo } from "@game/data/staking/models";
import { CardSprite } from "@game/ui/cards/CardSprite";
import { Rectangle } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";

export class StakedCardSlot extends EnchantedContainer {
  protected readonly context = GameSingletons.getGameContext();
  protected readonly tweeener = new TemporaryTweeener(this);

  public readonly background: Sprite;
  public readonly ownedIcon: Sprite;

  public cardSprite: CardSprite | null = null;
  public stakeInfo: StakedCardInfo | null = null;
  public onClick: ((stakeInfo: StakedCardInfo | null) => void) | null = null;
  constructor() {
    super();

    //// Add background
    const backgroundTextureId = "ui-station-dashboard/staking/public-tab/default/bg-spot.png";
    const backgroundTexture = this.context.assets.getTexture(backgroundTextureId);
    this.background = new Sprite(backgroundTexture);
    this.background.interactive = true;
    this.background.buttonMode = true;
    this.background.scale.set(0.75);
    this.addChild(this.background);

    const ownedIconTextureId = "ui-station-dashboard/staking/vip-tab/1-home/owned-indicator.png";
    const ownedIconTexture = this.context.assets.getTexture(ownedIconTextureId);
    this.ownedIcon = new Sprite(ownedIconTexture);
    this.ownedIcon.scale.set(1.5);
    this.ownedIcon.anchor.set(0.5);
    this.ownedIcon.position.set(this.background.width - this.ownedIcon.width * 0.1, +this.ownedIcon.height * 0.4);
    this.addChild(this.ownedIcon);

    const hitAreaPadding = 20;
    this.background.hitArea = new Rectangle(
      -hitAreaPadding,
      -hitAreaPadding,
      backgroundTexture.width + hitAreaPadding * 2,
      backgroundTexture.height + hitAreaPadding * 2
    );
    buttonizeDisplayObject(this.background, () => this.onClick?.(this.stakeInfo));

    this.enchantments.onDestroyCallbacks.add(() => {
      this.onClick = null;
      this.stakeInfo = null;
      this.cardSprite = null;
    });
  }

  public setStakedCardInfo(info: StakedCardInfo | null) {
    this.stakeInfo = info;
  }

  public setCardSprite(cardSprite: CardSprite | null, owned?: boolean) {
    if (this.cardSprite) {
      this.removeChild(this.cardSprite);
      this.cardSprite = null;
    }

    this.cardSprite = cardSprite;

    if (this.cardSprite) {
      this.addChild(this.cardSprite);
      this.cardSprite.position.set(20, 15);
      this.cardSprite.scale.set(0.25);

      this.ownedIcon.visible = owned == true;
      this.addChild(this.ownedIcon);
    } else {
      this.ownedIcon.visible = false;
    }
  }

  async playShowAnimation() {
    const promises = [] as { then: Function }[];
    promises.push(this.tweeener.from(this.background, { pixi: { alpha: 0 }, duration: 0.37 }));
    if (this.cardSprite) {
      const delay = 0.27;
      const duration = 0.22;
      promises.push(this.tweeener.from(this.cardSprite, { pixi: { pivotY: 150 }, duration, delay, ease: "power.in" }));
      promises.push(this.tweeener.from(this.cardSprite, { pixi: { alpha: 0 }, duration, delay, ease: "power.out" }));
    }
    if (this.ownedIcon && this.ownedIcon.visible) {
      promises.push(
        this.tweeener.from(this.ownedIcon, { pixi: { scale: 0 }, duration: 0.35, delay: 0.62, ease: "back.out" })
      );
    }
    await Promise.all(promises);
  }
}
