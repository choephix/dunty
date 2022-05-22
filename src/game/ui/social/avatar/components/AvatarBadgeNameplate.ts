import { GameSingletons } from "@game/app/GameSingletons";
import { spawnShineFlare } from "@game/asorted/animations/spawnShineFlare";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";

export class AvatarBadgeNameplate extends Container {
  public readonly core: Sprite;
  public readonly base: Sprite;
  public readonly frame: Sprite;

  public readonly label: Text;

  public braggingTitle?: AvatarBadgeBraggingTitle;

  constructor() {
    super();

    this.core = this.addEmptySprite();
    this.base = this.addEmptySprite();
    this.frame = this.addEmptySprite();

    const factory = GameSingletons.getSimpleObjectFactory();

    this.label = factory.createText("", { fontSize: 84 });
    this.label.anchor.set(0.5);
    this.addChild(this.label);
  }

  private addEmptySprite() {
    const emptySprite = new Sprite(Texture.EMPTY);
    emptySprite.anchor.set(0.5);
    return this.addChild(emptySprite);
  }

  /**
   * Get Bragging Title element.
   * If it doesn't exist, creates and then returns it.
   */
  public greateBraggingTitle() {
    if (!this.braggingTitle) {
      this.braggingTitle = new AvatarBadgeBraggingTitle();
      this.braggingTitle.y = 86;
      this.addChild(this.braggingTitle);
    }

    return this.braggingTitle;
  }
}

export class AvatarBadgeBraggingTitle extends Container {
  public readonly pad: Sprite;
  public readonly label: Text;

  public useFlareAnimation: boolean = true;

  constructor() {
    super();

    const factory = GameSingletons.getSimpleObjectFactory();

    this.pad = factory.createSprite();
    this.pad.anchor.set(0.5, 0.0);
    this.addChild(this.pad);

    this.label = factory.createText("", { fontSize: 32 });
    this.label.anchor.set(0.5);
    this.label.y = 28;
    this.addChild(this.label);
  }

  async playShowAnimation() {
    this.visible = true;

    const tweeen = new TemporaryTweeener(this);
    await tweeen.from(this, { pixi: { scale: 0.0 }, duration: 0.23, ease: "back.out" });

    if (this.useFlareAnimation) {
      const shine = spawnShineFlare({
        textureId: "assets/images/fx/purple-flare.png",
        duration: 0.55,
        fromX: -250,
        toX: 250,
        fromY: this.label.y,
        toY: this.label.y,
        parent: this,
      });
      shine.scale.set(4);
      await shine.tween;
    }
  }
}
