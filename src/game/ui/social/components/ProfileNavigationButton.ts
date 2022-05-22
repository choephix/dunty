import { GameSingletons } from "@game/app/GameSingletons";
import { Container } from "@pixi/display";
import { Rectangle } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { fitObjectInRectangle } from "@sdk-pixi/layout/fitObjectInRectangle";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";

export class ProfileNavigationButton extends Container {
  private readonly context = GameSingletons.getGameContext();

  private readonly padding = 0;

  private innerSprite: null | Sprite = null;

  protected readonly tweeener = new TemporaryTweeener(this);

  constructor() {
    super();
    //// Make sure we start off at a properly reset state (no highlight, not pressed)
    this.setHighlighted(false);
    this.setPressed(false);
  }

  public setHighlighted(selected: boolean) {
    if (this.innerSprite) {
      this.innerSprite.tint = selected ? 0xffffff : 0xadd8e6;
    }
  }

  public setPressed(pressed: boolean) {
    this.tweeener.to(this.pivot, { y: pressed ? -4 : 0, duration: 0.11 });
    if (this.innerSprite) {
      this.tweeener.to(this.innerSprite, { alpha: pressed ? 0.6 : 1, duration: 0.11 });
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
