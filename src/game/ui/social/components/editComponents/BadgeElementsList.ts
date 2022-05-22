import { SimpleObjectsFactory } from "@game/app/components/SimpleObjectsFactory";
import { GameSingletons } from "@game/app/GameSingletons";
import { GlowFilterService } from "@game/ui/fx/GlowFilterService";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { ColorMatrixFilter } from "@pixi/filter-color-matrix";
import { Sprite } from "@pixi/sprite";
import { SafeScrollbox } from "@sdk-pixi/display/SafeScrollbox";
import { nextFrame } from "@sdk/utils/promises";
import { AvatarBadgeElements } from "@game/ui/social/avatar/AvatarBadgeElements";

export class BadgeElementsList extends SafeScrollbox {
  private readonly factory: SimpleObjectsFactory = GameSingletons.getSimpleObjectFactory();
  private glowService: GlowFilterService = new GlowFilterService();
  private glowServiceEquip: GlowFilterService = new GlowFilterService({ color: 0xffffff });
  private sprites: Array<Sprite> = [];
  onBadgeSelected?: (badge: string) => void;
  tintColor: number = 0xffffff;
  constructor() {
    super({
      noTicker: true,
      boxWidth: 800,
      boxHeight: 200,
      stopPropagation: true,
      divWheel: GameSingletons.getGameContext().app.view,
      overflowY: "none",
    });
  }

  async addBackgroundElements(
    elements: Array<{ texture: string; canUse: boolean }>,
    defaultTint: number,
    equippedElement: Sprite
  ) {
    let startX = 0;
    for (let badge of elements) {
      //// Add badge
      const badgeContainer = new Container();
      badgeContainer.scale.set(0.75);
      const sprite = new Sprite(await Texture.fromURL(AvatarBadgeElements.getBackgroundTextureId(badge.texture)));
      sprite.y -= 20;
      sprite.scale.set(0.325);
      sprite.tint = defaultTint;
      this.sprites.push(sprite);
      badgeContainer.addChild(sprite);
      badgeContainer.position.set(startX, 0);
      if (badge.canUse) {
        badgeContainer.interactive = true;
        badgeContainer.buttonMode = true;
        badgeContainer.on("pointerdown", () => {
          this.glowService.clear();
          this.glowService.addFilter(sprite);
          this.onBadgeSelected?.(badge.texture);
        });
      } else {
        //// Grey out if it doesn't exist in the wallet
        const filter = new ColorMatrixFilter();
        filter.blackAndWhite(true);
        badgeContainer.filters = [filter];
      }

      if (equippedElement.texture == sprite.texture) {
        this.glowServiceEquip.addFilter(badgeContainer);
      }

      this.content.addChild(badgeContainer);
      startX += 175;
      await nextFrame();
    }
    this.update();
    this.tintColor = defaultTint;
  }

  async addForegroundElements(elements: Array<{ texture: string; canUse: boolean }>, equippedElement: Sprite) {
    let startX = 0;
    for (let badge of elements) {
      //// Add badge
      const badgeContainer = new Container();
      badgeContainer.scale.set(0.75);
      const sprite = new Sprite(await Texture.fromURL(AvatarBadgeElements.getForegroundTextureId(badge.texture)));
      sprite.y -= 20;
      sprite.scale.set(0.325);
      this.sprites.push(sprite);
      let bg: Sprite | undefined;
      //// Add badge background
      bg = this.factory.createSprite("ui-social/edit/select-bg.png");
      bg.tint = AvatarBadgeElements.getForegroundHolderColor(badge.texture);
      badgeContainer.addChild(bg);
      sprite.x -= 30;
      badgeContainer.addChild(sprite);
      badgeContainer.position.set(startX, 0);
      if (badge.canUse) {
        badgeContainer.interactive = true;
        badgeContainer.buttonMode = true;
        badgeContainer.on("pointerdown", () => {
          this.glowService.clear();
          this.glowService.addFilter(bg ? bg : sprite);
          this.onBadgeSelected?.(badge.texture);
        });
      } else {
        //// Grey out if it doesn't exist in the wallet
        const filter = new ColorMatrixFilter();
        filter.blackAndWhite(true);
        badgeContainer.filters = [filter];
      }

      if (equippedElement.texture == sprite.texture) {
        this.glowServiceEquip.addFilter(badgeContainer);
      }

      this.content.addChild(badgeContainer);
      startX += 175;
      await nextFrame();
    }
    this.update();
  }

  clearData() {
    const children = [...this.content.children];
    for (const child of children) {
      child.destroy({ children: true });
    }
  }

  setTintColor(color: number) {
    this.tintColor = color;
    for (const sprite of this.sprites) {
      sprite.tint = color;
    }
  }
}
