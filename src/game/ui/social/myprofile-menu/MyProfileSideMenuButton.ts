import { SimpleObjectsFactory } from "@game/app/components/SimpleObjectsFactory";
import { GameSingletons } from "@game/app/GameSingletons";
import { GlowFilterService } from "@game/ui/fx/GlowFilterService";
import { Container } from "@pixi/display";
import { Rectangle } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import { BitmapText, IBitmapTextStyle } from "@pixi/text-bitmap";
import { fitObjectInRectangle } from "@sdk-pixi/layout/fitObjectInRectangle";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";

const labelStyle = {
  fontName: "Celestial Typeface",
  align: "center",
} as IBitmapTextStyle;

export class MyProfileSideMenuButton extends Container {
  private readonly context = GameSingletons.getGameContext();

  private readonly padding = 0;

  private innerSprite: null | Sprite = null;

  protected readonly tweeener = new TemporaryTweeener(this);

  glowfilter: GlowFilterService = new GlowFilterService();

  innerContent: Container = new Container();
  private readonly factory: SimpleObjectsFactory = GameSingletons.getSimpleObjectFactory();

  constructor() {
    super();
    this.addChild(this.innerContent);
    //// Make sure we start off at a properly reset state (no highlight, not pressed)
    this.setHighlighted(false);
  }

  public setHighlighted(selected: boolean) {
    this.glowfilter.clear();
    const target = this.innerSprite !== null ? this.innerSprite : this.innerContent;
    if (selected) {
      this.glowfilter.addFilter(target);
    }
  }

  public setInnerContentAsSprite(textureId: string) {
    const sprite = this.context.simpleFactory.createSprite(textureId);
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

  async setSpriteAndText(spriteId: string, textLabel: string) {
    const sprite = this.factory.createSprite(spriteId);
    const text = new BitmapText(textLabel.toLowerCase(), labelStyle);
    //// Center text on sprite
    text.anchor.set(0.5);
    text.position.set(112, 20);
    text.scale.set(0.5);
    this.innerContent.addChild(sprite);
    this.innerContent.addChild(text);
  }

  setTint(color: number) {
    for (let child of this.children) {
      (child as Sprite).tint = color;
    }
  }
}
