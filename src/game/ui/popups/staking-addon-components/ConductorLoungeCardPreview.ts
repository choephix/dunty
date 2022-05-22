import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { SpriteWithText } from "@game/asorted/SpriteWithText";
import { FontIcon } from "@game/constants/FontIcon";
import { getRarityColors } from "@game/constants/RarityColors";
import { CardEntity } from "@game/data/entities/CardEntity";
import { Container } from "@pixi/display";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { nextFrame } from "@sdk/utils/promises";
import { StakedCardPreviewData } from "../station-dashboard-components/stakes/addon-subpages/components/StakedCardPreview";

const atlasTexturePrefix = "ui-staking-hub/conductor-lounge/";

export class ConductorLoungeCardPreview extends Container {
  protected readonly context: GameContext = GameSingletons.getGameContext();

  protected readonly tweeener = new TemporaryTweeener(this);

  public onClickBoot?: (card: CardEntity) => void;

  constructor(public readonly isVIP: boolean) {
    super();
  }

  setPreviewCard(data: StakedCardPreviewData) {
    this.clearChildren();

    const { simpleFactory: primitives } = this.context;

    const rarityColor = getRarityColors(data.cardEntity.rarity)?.main?.toInt() ?? 0x303030;

    // Add placeholder
    const placeholder = primitives.createSprite(atlasTexturePrefix + "selected-open-door.png");
    placeholder.name = "placeholder";
    this.addChild(placeholder);

    //// Add locomotive sprite
    if (data.texturePath) {
      const preview = primitives.createSprite(data.texturePath);
      preview.anchor.set(0.5, 1.0);
      preview.position.set(43 + preview.width / 2, 48 + preview.height);

      // this.tweeener.from(preview, {
      //   pixi: { scaleX: 0.7, scaleY: 0.3 },
      //   duration: 0.41,
      //   ease: "back.out",
      // });

      this.addChild(preview);
    }

    //// Add nameplate
    const nameBox = new SpriteWithText(atlasTexturePrefix + "selected-name-bar.png", data.cardEntity.title, {
      fontSize: 36,
    });
    nameBox.position.set(-28, 419);
    nameBox.tint = rarityColor;
    this.addChild(nameBox);

    // const showTociumPerHour = !isNaN(data.tocValue);
    const showTociumPerHour = true;
    if (showTociumPerHour) {
      const hourlyRateBox = new SpriteWithText(
        atlasTexturePrefix + "sign-closeup-vip.png",
        `${FontIcon.Tocium} ${data.tociumPerHour} / HR`,
        {
          fontSize: 36,
        }
      );
      hourlyRateBox.position.set(35, -112);
      hourlyRateBox.tint = rarityColor;
      this.addChild(hourlyRateBox);
    }
  }

  clearChildren() {
    const children = [...this.children];
    for (const child of children) {
      this.removeChild(child);
      nextFrame().then(() => child.destroy({ children: true }));
    }
  }
}
