import { GameSingletons } from "@game/app/GameSingletons";
import { spawnSpriteWave } from "@game/asorted/animations/spawnSpriteWave";
import { BLEND_MODES } from "@pixi/constants";
import { Container } from "@pixi/display";
import { Rectangle } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { fitObjectInRectangle } from "@sdk-pixi/layout/fitObjectInRectangle";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";

export class ItemTypeFilterButton extends Container {
  private readonly context = GameSingletons.getGameContext();

  private readonly padding = 0;

  private readonly pad;
  private readonly padHighlight;
  private readonly padHover;

  private innerSprite: null | Sprite = null;

  private readonly tweeener = new TemporaryTweeener(this);

  constructor() {
    super();

    const padTextureId = "ui-market-window-emporium/item-filter-btn-sm.png";
    this.pad = this.context.simpleFactory.createSprite(padTextureId);
    this.pad.anchor.set(0.5);
    this.addChild(this.pad);

    const padHighlightTextureId = "ui-market-window-emporium/item-filter-btn-sm-highlight.png";
    this.padHighlight = this.context.simpleFactory.createSprite(padHighlightTextureId);
    this.padHighlight.anchor.set(0.5);
    this.padHighlight.tint = 0x3b2716;
    this.addChild(this.padHighlight);

    this.padHover = this.context.simpleFactory.createSprite(padTextureId);
    this.padHover.anchor.set(0.5);
    this.padHover.blendMode = BLEND_MODES.ADD;
    this.addChild(this.padHover);

    //// Make sure we start off at a properly reset state (no highlight, not pressed)
    this.setHighlighted(false);
    this.setPressed(false);
    this.setHovered(false);
  }

  public setHighlighted(selected: boolean) {
    this.tweeener.to(this.padHighlight, { alpha: selected ? 1 : 0, duration: 0.34 });
    if (this.innerSprite) {
      this.innerSprite.tint = selected ? 0xffffff : 0xadd8e6;
    }
  }

  public setHovered(hover: boolean) {
    this.tweeener.to(this.padHover, { alpha: hover ? 0.4 : 0, duration: 0.11 });
  }

  public setPressed(pressed: boolean) {
    this.tweeener.to(this.pivot, { y: pressed ? -4 : 0, duration: 0.11 });
    if (this.innerSprite) {
      this.tweeener.to(this.innerSprite, { alpha: pressed ? 0.6 : 1, duration: 0.11 });
    }

    if (!pressed) {
      const padHighlightTextureId = "ui-market-window-emporium/item-filter-btn-sm.png";
      spawnSpriteWave(
        padHighlightTextureId,
        {
          pixi: { scale: 1.7 },
        },
        {
          x: this.x,
          y: this.y,
          alpha: 0.3,
          blendMode: BLEND_MODES.ADD,
          parent: this.parent,
        }
      );
    }
  }

  public setInnerContentAsSprite(textureId: string) {
    const sprite = this.context.simpleFactory.createSprite(textureId);
    this.setInnerContent(sprite);
  }

  public setInnerContentAsText(text: string) {
    const sprite = new Text(text, { fill: 0xffffff, fontSize: 30 });
    this.setInnerContent(sprite);
  }

  private setInnerContent(child: Sprite | null) {
    if (this.innerSprite != null) {
      this.innerSprite.destroy();
    }

    this.innerSprite = child;

    if (this.innerSprite != null) {
      this.addChild(this.innerSprite);

      this.innerSprite.anchor.set(0.5);

      const innerSpriteArea = new Rectangle(
        this.innerSprite.x - this.innerSprite.width * 0.5 + this.padding,
        this.innerSprite.y - this.innerSprite.height * 0.5 + this.padding,
        this.innerSprite.width - this.padding * 2,
        this.innerSprite.height - this.padding * 2
      );
      fitObjectInRectangle(this.innerSprite, innerSpriteArea);
    }
  }
}
