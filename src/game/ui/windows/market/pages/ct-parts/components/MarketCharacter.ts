import { GameSingletons } from "@game/app/GameSingletons";
import { fadeChangeSpriteTexture } from "@game/asorted/animations/fadeChangeSpriteTexture";
import { addDisplayObjectMask } from "@game/asorted/createDisplayObjectMask";
import { SpriteWithText } from "@game/asorted/SpriteWithText";
import { FontFamily } from "@game/constants/FontFamily";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";

class SpeechBubble extends Container {
  private readonly context = GameSingletons.getGameContext();

  private text: Text;
  private bubble: Sprite;

  private readonly tweeener = new TemporaryTweeener(this);

  constructor() {
    super();

    const bubbleTextureid = "ui-market-window-ct-parts/fusion/mechanic-bubble.png";
    this.bubble = this.context.simpleFactory.createSprite(bubbleTextureid);
    this.addChild(this.bubble);

    this.text = this.context.simpleFactory.createText(
      "",
      { fontSize: 32, fontFamily: FontFamily.DanielBlack },
      { x: 85, y: 95 }
    );
    this.addChild(this.text);

    this.pivot.set(this.bubble.texture.width, this.bubble.texture.height);
    this.visible = false;
  }

  setText(text: string | null) {
    const tl = this.tweeener.createTimeline();

    if (this.visible) {
      this.text.text = "";
      tl.to(this, { pixi: { scale: 0 }, duration: 0.11, ease: "back.out" });
    }

    tl.call(() => {
      this.text.text = text || "";
      this.visible = !!text;
    });

    if (text) {
      tl.fromTo(this, { pixi: { scale: 0 } }, { pixi: { scale: 1 }, duration: 0.31, ease: "back.out" });
    }

    return tl.play();
  }
}

export class MarketCharacter extends Container {
  private readonly assets = GameSingletons.getResources();
  private readonly simpleFactory = GameSingletons.getSimpleObjectFactory();
  private readonly character: Sprite;
  private readonly desk: Sprite;
  private nameplate?: SpriteWithText;
  private speechBubble?: SpeechBubble;

  private readonly tweeener = new TemporaryTweeener(this);

  constructor() {
    super();

    this.character = this.simpleFactory.createSprite(undefined, { x: 1700, y: 214 });
    this.addChild(this.character);

    const deskTextureId = "ui-market-window-ct-parts/fusion/stand.png";
    this.desk = this.simpleFactory.createSprite(deskTextureId, { x: 1635, y: 800 });
    this.addChild(this.desk);
  }

  addSwitchShopkeeperArrow(flipped: boolean, onSwitchShopkeeperClick: () => void) {
    const arrowTextureId = "ui-market-window-ct-parts/fusion/btn-switch.png";
    const arrow = this.simpleFactory.createSprite(arrowTextureId, { x: 364, y: 345 });

    arrow.name = "arrow";
    arrow.anchor.set(0.5, 0.5);
    arrow.scale.x = flipped ? -1 : 1;

    const clickableObject = this.desk || arrow;
    buttonizeDisplayObject(clickableObject, onSwitchShopkeeperClick);

    this.desk.addChild(arrow);
  }

  setCharacterName(name: string) {
    if (!this.nameplate) {
      const ribbonTextureId = "ui-market-window-ct-parts/fusion/name-ribbon.png";
      this.nameplate = new SpriteWithText(ribbonTextureId, name, { fontFamily: FontFamily.DanielBlack, fontSize: 46 });
      this.nameplate.position.copyFrom({ x: 354, y: 200 });
      this.nameplate.centerPivot();
      this.nameplate.name = "nameplate";
      this.desk.addChild(this.nameplate);
    } else {
      this.nameplate.setText(name);
    }
  }

  setCharacterPose(texture: Texture | string) {
    if (typeof texture === "string") {
      texture = this.assets.getTexture(texture);
    }

    if (!this.character.texture || this.character.texture === Texture.EMPTY) {
      this.character.texture = texture;
    } else {
      fadeChangeSpriteTexture(this.character, texture, 0.43);
    }
  }

  setSpeechBubbleText(newText: string | null) {
    if (newText && !this.speechBubble) {
      this.speechBubble = new SpeechBubble();
      this.speechBubble.position.copyFrom({ x: 1915, y: 505 });
      this.addChild(this.speechBubble);
    }

    this.speechBubble?.setText(newText);
  }

  public playShowAnimation() {
    return addDisplayObjectMask(this).during(
      this.tweeener.playTimeline(tl => {
        tl.from(this.desk, { pixi: { pivotY: -this.desk.texture.height }, duration: 0.43, ease: "power3.out" }, 0);
        tl.from(
          this.character,
          { pixi: { pivotX: -240, alpha: 0, skewX: -8 }, delay: 0.08, duration: 0.37, ease: "power.out" },
          0
        );
      })
    );
  }

  public playHideAnimation() {
    // this.speechBubble?.setText(null);
    return addDisplayObjectMask(this).during(
      this.tweeener.playTimeline(tl => {
        tl.to(this.desk, { pixi: { pivotY: -this.desk.texture.height }, duration: 0.22, ease: "power2.in" }, 0);
        tl.to(this.character, { pixi: { pivotX: -240, alpha: 0 }, delay: 0.08, duration: 0.19, ease: "power.in" }, 0);
      })
    );
  }
}

export module MarketCharacter {
  export enum TheMechanicPose {
    Idle = "ui-market-window-character/mechanic.png",
    Talking = "ui-market-window-character/mechanic-talking.png",
  }

  export enum OttoPose {
    Idle = "ui-market-window-character/otto-no-ct-discovered.png",
  }
}
