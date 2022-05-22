import { GameSingletons } from "@game/app/GameSingletons";
import { animateObjectsInViaTimeline } from "@game/asorted/animations/animateObjectsInViaTimeline";
import { modifyPivotWithoutChangingPosition } from "@game/asorted/centerPivotWithoutChangingPosition";
import { createAnimatedButtonBehavior } from "@game/asorted/createAnimatedButtonBehavior";
import { formatTimeDurationHumanReadable } from "@game/asorted/formatTimeDurationHumanReadable";
import { FontFamily } from "@game/constants/FontFamily";
import { getRarityColors } from "@game/constants/RarityColors";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { CenturyTrainPartEntity } from "../data/CenturyTrainPartEntity";
import { CenturyTrainPartData } from "../data/models";

type CTPartThumbnailData = CenturyTrainPartData & Partial<CenturyTrainPartEntity>;

export class CTPartThumbnail extends Container {
  private readonly assets = GameSingletons.getResources();
  private readonly simpleFactory = GameSingletons.getSimpleObjectFactory();

  public onClick?: () => void;
  public zoomPartOnHover: boolean = true;

  private readonly pad;
  private readonly image;
  private readonly nameLabel;
  private readonly timeLeftLabel;
  private readonly inventoryBadge;
  private readonly saleTag;

  private readonly tweeener = new TemporaryTweeener(this);

  constructor(public readonly data: CTPartThumbnailData, public readonly showSaleTag: boolean) {
    super();

    this.name = "Discovered Part";

    if ("inventoryCount" in this.data && this.data.inventoryCount) {
      this.inventoryBadge = this.addInventoryBadge(this.data.inventoryCount);
    }

    this.pad = this.addBackGround();

    if (data.isInactive?.()) {
      this.alpha = 0.25;
    } else {
      if (data.expiryTime && data.getTimeLeftInSeconds && !data.isDiscountClaimed?.()) {
        // TODO: Add ability to dynamically count down for on sale parts
        this.timeLeftLabel = this.addTimeLeftLabel(data.getTimeLeftInSeconds());
      }
    }

    this.nameLabel = this.addNameLabel();
    this.image = this.addPartPicture();

    if (this.showSaleTag) {
      this.saleTag = this.addSaleTag(data.discountPercent);
    }

    const behavior = createAnimatedButtonBehavior(this, {
      onClick: () => this.onClick?.(),
      onUpdate() {
        if (this.zoomPartOnHover) {
          const { hoverProgress } = behavior;
          this.image.scale.set(0.8 + hoverProgress * 0.2);
        }
      },
    });
  }

  private addBackGround() {
    const fillTextureId = "ui-market-window-ct-parts/part-thumbnail/pad.png";
    const fill = this.simpleFactory.createSprite(fillTextureId);
    fill.tint = getRarityColors(this.data.rarity).main.toInt();
    this.addChild(fill);

    const borderTextureId = "ui-market-window-ct-parts/part-thumbnail/frame-stroked.png";
    const stroke = this.simpleFactory.createSprite(borderTextureId);
    fill.addChild(stroke);

    modifyPivotWithoutChangingPosition(fill);

    return fill;
  }

  private addInventoryBadge(inventoryCount: number) {
    const inventoryBadge = new Sprite(this.assets.getTexture("ui-market-window-ct-parts/inventory-badge.png"));
    inventoryBadge.name = "inventoryBadge";
    inventoryBadge.position.set(9, 1);
    this.addChild(inventoryBadge);

    // const badgeContent = inventoryCount < 10 ? `X${inventoryCount}` : `${inventoryCount}`;
    const badgeContent = String(inventoryCount);
    const badgeCount = new Text(badgeContent, {
      fill: "#FFFFFF",
      fontFamily: FontFamily.DanielBlack,
      fontSize: 22,
    });
    badgeCount.anchor.set(0.5);
    badgeCount.position.set(33);
    inventoryBadge.addChild(badgeCount);

    return inventoryBadge;
  }

  private addPartPicture() {
    const partImg = new Sprite(this.assets.getTexture(this.data.imgUrl));
    partImg.scale.set(0.8);
    partImg.position.set(41, 27);
    modifyPivotWithoutChangingPosition(partImg);
    return this.addChild(partImg);
  }

  private addNameLabel() {
    const nameContent = this.data.part;
    const name = new Text(nameContent.toUpperCase(), {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 20,
    });
    name.anchor.set(0.5);
    name.position.set(142, 254);
    return this.addChild(name);
  }

  private addTimeLeftLabel(timeLeftInSeconds: number | null) {
    if (timeLeftInSeconds == null) {
      return;
    }

    if (timeLeftInSeconds < 0) {
      return;
    }

    const labelContent = formatTimeDurationHumanReadable(timeLeftInSeconds);
    const label = new Text(labelContent, {
      fill: this.showSaleTag ? "#00FFFF" : "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 20,
      align: "center",
    });
    label.anchor.set(0.5);
    label.position.set(140, 303);
    return this.addChild(label);
  }

  private addSaleTag(percentage?: number) {
    const suffix = percentage && [20, 40].includes(+percentage) ? `-${percentage}` : "";
    const saleTag = new Sprite(this.assets.getTexture(`ui-market-window-ct-parts/sale-tag${suffix}.png`));
    saleTag.position.set(-28, 216);
    modifyPivotWithoutChangingPosition(saleTag, [1, 0]);
    return this.addChild(saleTag);
  }

  playShowAnimation(delay: number = 0) {
    const { inventoryBadge, timeLeftLabel, nameLabel, pad, image, saleTag } = this;
    return animateObjectsInViaTimeline(
      [
        [pad, { pixi: { scale: 0 }, duration: 0.37, ease: "back.out" }],
        [inventoryBadge, { pixi: { pivotX: -50 }, duration: 0.17, ease: "power.in" }, 0.18],
        [image, { pixi: { pivotY: 250 }, duration: 0.67, ease: "bounce.out" }, 0.11],
        [image, { pixi: { alpha: 0 }, duration: 0.67, ease: "power4.out" }],
        [nameLabel, { alpha: 0, duration: 0.67, ease: "power.inOut" }, 0.13],
        [timeLeftLabel, { alpha: 0, duration: 0.97, ease: "power.inOut" }, 0.13],
        [saleTag, { pixi: { scale: 0, angle: -60 }, duration: 0.87, ease: "elastic.out" }, 0.13],
      ],
      this.tweeener,
      delay
    );
  }

  playAlternativeShowAnimation(delay: number = 0) {
    const { inventoryBadge, timeLeftLabel, nameLabel, pad, image, saleTag } = this;
    return animateObjectsInViaTimeline(
      [
        [pad, { pixi: { pivotY: 300, alpha: 0 }, duration: 0.27, ease: "power2.out" }],
        [inventoryBadge, { pixi: { pivotX: -50 }, duration: 0.17, ease: "power.in" }, 0.18],
        [image, { pixi: { scale: 1.3 }, duration: 0.77, ease: "bounce.out" }, 0.11],
        [image, { pixi: { alpha: 0 }, duration: 0.67, ease: "power4.out" }],
        [nameLabel, { alpha: 0, duration: 0.67, ease: "power.inOut" }, 0.13],
        [timeLeftLabel, { alpha: 0, duration: 0.97, ease: "power.inOut" }, 0.13],
        [saleTag, { pixi: { scale: 0, angle: -90 }, duration: 0.87, ease: "elastic.out" }, 0.13],
      ],
      this.tweeener,
      delay
    );
  }

  playHideAnimation(delay: number = 0) {
    modifyPivotWithoutChangingPosition(this);
    return this.tweeener.to(this, {
      pixi: { scale: 0 },
      duration: 0.14,
      ease: "power.in",
      delay,
    });
  }
}
