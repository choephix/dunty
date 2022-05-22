import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { tweenTintProperty } from "@game/asorted/animations/tweenTintProperty";
import { SpriteWithText } from "@game/asorted/SpriteWithText";
import { FontIcon } from "@game/constants/FontIcon";
import { getRarityColors } from "@game/constants/RarityColors";
import { CardEntity } from "@game/data/entities/CardEntity";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";

export type StakedCardPreviewData = {
  texturePath: string | null;
  tociumPerHour: number;
  cardEntity: CardEntity;
  owned: boolean;
};

const PREVIEW_RECT = {
  x: 0,
  y: 85,
  width: 411,
  height: 339,
};

const defaultRarityTint = 0x303030;

const texturePrefix = "ui-station-dashboard/staking/public-tab/selected-locomotive/";

export class StakedCardPreview extends Container {
  protected readonly context: GameContext = GameSingletons.getGameContext();

  protected readonly tweeener = new TemporaryTweeener(this);

  public onClickBoot?: (card: CardEntity) => void;

  protected readonly background: Sprite;
  protected readonly nameplate: SpriteWithText;
  protected readonly separatorLine: Sprite;
  protected readonly hourlyRateTag: SpriteWithText;
  protected readonly bootButton: Sprite;

  protected currentPreviewSprite: Sprite | null = null;

  constructor(public readonly isVIP: boolean) {
    super();

    const { simpleFactory } = this.context;

    //// Add background
    const backgroundTextureId = "ui-station-dashboard/staking/public-tab/preview-pad.png";
    this.background = simpleFactory.createSprite(backgroundTextureId);
    this.background.position.copyFrom(PREVIEW_RECT);
    this.background.width = PREVIEW_RECT.width;
    this.background.height = PREVIEW_RECT.width;
    this.background.zIndex = -10;
    this.addChild(this.background);

    //// Add nameplate
    this.nameplate = new SpriteWithText(texturePrefix + "info-plate/loco-info-plate.png", "", { fontSize: 36 });
    this.nameplate.position.set(PREVIEW_RECT.x, PREVIEW_RECT.y + PREVIEW_RECT.height);
    this.nameplate.tint = defaultRarityTint;
    this.addChild(this.nameplate);
    SpriteWithText.assignSwipeTransition(this.nameplate);

    //// Add tracks separator line
    this.separatorLine = simpleFactory.createSprite(texturePrefix + "info-plate/tracks.png");
    this.separatorLine.position.set(this.nameplate.x, this.nameplate.y - this.separatorLine.height);
    this.addChild(this.separatorLine);

    //// Add tocium/hr tag
    this.hourlyRateTag = new SpriteWithText(texturePrefix + "toc-ribbon.png", "", { fontSize: 22 });
    this.hourlyRateTag.position.set(PREVIEW_RECT.x + PREVIEW_RECT.width - this.hourlyRateTag.width, PREVIEW_RECT.y);
    this.hourlyRateTag.tint = defaultRarityTint;
    this.addChild(this.hourlyRateTag);
    SpriteWithText.assignSwipeTransition(this.hourlyRateTag);

    //// Add boot button
    const bootButtonTextureId = "ui-station-dashboard/staking/vip-tab/5-selected-locomotive/btn-boot.png";
    this.bootButton = simpleFactory.createSprite(bootButtonTextureId);
    this.bootButton.position.set(PREVIEW_RECT.x - 1, PREVIEW_RECT.y);
    this.addChild(this.bootButton);
    this.bootButton.interactive = true;
    this.bootButton.buttonMode = true;

    this.hourlyRateTag.visible = false;
    this.bootButton.visible = false;
  }

  setPreviewCard(data: StakedCardPreviewData | null) {
    if (this.currentPreviewSprite) {
      this.currentPreviewSprite.destroy();
      this.currentPreviewSprite = null;
    }

    if (data == null) {
      this.nameplate.setText(null);
      tweenTintProperty(this.nameplate, defaultRarityTint);
      this.hourlyRateTag.setText(null);
      tweenTintProperty(this.hourlyRateTag, defaultRarityTint);

      this.hourlyRateTag.visible = false;
      this.bootButton.visible = false;
      this.bootButton.removeAllListeners();
    } else {
      const { simpleFactory } = this.context;

      const rarityColor = getRarityColors(data.cardEntity.rarity)?.main?.toInt() ?? 0x303030;

      if (data.texturePath) {
        this.currentPreviewSprite = simpleFactory.createSprite(data.texturePath);
        this.currentPreviewSprite.anchor.set(0.5);
        this.currentPreviewSprite.position.set(
          PREVIEW_RECT.x + PREVIEW_RECT.width / 2,
          PREVIEW_RECT.y + PREVIEW_RECT.height / 2
        );
        this.currentPreviewSprite.zIndex = -5;
        this.addChild(this.currentPreviewSprite);
      }

      this.nameplate.setText(data.cardEntity.title);
      tweenTintProperty(this.nameplate, rarityColor);

      this.hourlyRateTag.visible = !isNaN(data.tociumPerHour);
      if (this.hourlyRateTag.visible) {
        this.hourlyRateTag.setText(`${FontIcon.Tocium} ${data.tociumPerHour} / HR`);
        tweenTintProperty(this.hourlyRateTag, rarityColor);
      }

      const showBootButton = (data.owned || this.isVIP) && this.onClickBoot != undefined;
      this.bootButton.visible = showBootButton;
      this.bootButton.removeAllListeners();
      if (this.bootButton.visible) {
        buttonizeDisplayObject(this.bootButton, () => this.onClickBoot?.(data.cardEntity));
      }
    }

    this.background.visible = this.currentPreviewSprite != null;

    this.sortChildren();
  }
}
