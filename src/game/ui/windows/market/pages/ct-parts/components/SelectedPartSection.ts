import { GameSingletons } from "@game/app/GameSingletons";
import { modifyPivotWithoutChangingPosition } from "@game/asorted/centerPivotWithoutChangingPosition";
import { FontFamily } from "@game/constants/FontFamily";
import { Container, DisplayObject, IDestroyOptions } from "@pixi/display";
import { GlowFilter } from "@pixi/filter-glow";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { CTPartThumbnail, SelectedPartDescription } from ".";
import { CenturyTrainPartEntity } from "../data/CenturyTrainPartEntity";

export class SelectedPartSection extends Container {
  private readonly assets = GameSingletons.getResources();
  private readonly tweeener = new TemporaryTweeener(this);

  public onBackButtonClick?: () => void;

  private readonly partThumbnail;
  private readonly partDescription;
  private readonly backButton;

  constructor(public readonly data: CenturyTrainPartEntity) {
    super();

    this.partThumbnail = this.addPart();
    this.partDescription = this.addPartDescription();
    this.backButton = this.addBackButton();

    this.name = "SelectedPartSection";
    this.position.set(193, 331);
  }

  public addSpeechBubble(): void {
    const speechBubble = new Sprite(this.assets.getTexture("ui-market-window-ct-parts/Bubble.png"));
    speechBubble.name = "genericTalkingBubble";
    speechBubble.position.set(1238, -124);
    speechBubble.scale.set(0.65);
    this.addChild(speechBubble);

    const speechBubbleTextContent = this.data.speechBubble;
    const speechBubbleText = new Text(speechBubbleTextContent, {
      fill: "#FFFFFF",
      fontFamily: FontFamily.DanielBlack,
      fontSize: 28,
      align: "center",
      wordWrap: true,
      wordWrapWidth: 590,
    });
    speechBubbleText.anchor.set(0.5);
    speechBubbleText.position.set(404, 165);
    speechBubble.addChild(speechBubbleText);

    modifyPivotWithoutChangingPosition(speechBubble, { x: 1.0, y: 1.0 });
  }

  public addActionButton(buttonLabelText: string, actionButtonClick: () => unknown | Promise<unknown>): void {
    const buttonContainer = new Container();
    const buttonSprite = new Sprite(this.assets.getTexture(`ui-market-window-compositions/btn-upgrade.png`));
    buttonSprite.filters = [
      new GlowFilter({
        outerStrength: 2.6,
        distance: 12,
        color: 0x00ffff,
      }),
    ];
    buttonSprite.cacheAsBitmap = true;

    const buttonLabel = new Text(buttonLabelText.toUpperCase(), {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 30,
      align: "center",
    });
    buttonLabel.name = "buttonLabel";
    buttonLabel.position.set(232, 48);
    buttonLabel.anchor.set(0.5);
    buttonLabel.scale.x = Math.min(1, (0.88 * buttonSprite.width) / buttonLabel.width);

    buttonContainer.name = "buttonContainer";
    buttonContainer.position.set(66, 584);
    buttonContainer.buttonMode = true;
    buttonContainer.interactive = true;
    buttonSprite.scale.x = 0.7;

    buttonContainer.addChild(buttonSprite);
    buttonContainer.addChild(buttonLabel);
    this.addChild(buttonContainer);

    buttonizeDisplayObject(buttonContainer, async () => {
      buttonContainer.visible = false;
      Promise.resolve(actionButtonClick()).finally(() => {
        if (!buttonContainer.destroyed) buttonContainer.visible = true;
      });
    });

    modifyPivotWithoutChangingPosition(buttonContainer);
  }

  private addPart() {
    const data = this.data;
    const thumb = new CTPartThumbnail(data, data.shouldDiscount() && data.canPurchase());
    thumb.name = `part-${this.data.tokenSymbol}`;
    thumb.position.set(92, 59);
    thumb.scale.set(1.5);
    thumb.zoomPartOnHover = false;
    modifyPivotWithoutChangingPosition(thumb);
    return this.addChild(thumb);
  }

  private addPartDescription() {
    const descriptionPanel = new SelectedPartDescription(this.data);
    modifyPivotWithoutChangingPosition(descriptionPanel);
    return this.addChild(descriptionPanel);
  }

  private addBackButton() {
    const backButton = new Sprite(this.assets.getTexture("ui-market-window-ct-parts/back-btn.png"));
    backButton.name = "backButton";
    backButton.interactive = true;
    backButton.buttonMode = true;
    backButton.anchor.set(0.5);
    backButton.position.set(-57, 369);
    buttonizeDisplayObject(backButton, () => this.onBackButtonClick?.());
    return this.addChild(backButton);
  }

  public async playShowAnimation() {
    const items = this.children as (DisplayObject & {
      playAlternativeShowAnimation?: (delay: number) => any;
      playShowAnimation?: (delay: number) => any;
    })[];
    return Promise.all(
      items.map((child, index) => {
        const { playAlternativeShowAnimation, playShowAnimation } = child;
        const delay = index * 0.07;
        if (playAlternativeShowAnimation) return playAlternativeShowAnimation.call(child, delay);
        if (playShowAnimation) return playShowAnimation.call(child, delay);
        return this.tweeener.from(child, { pixi: { scale: 0 }, duration: 0.27, ease: "power.out" });
      })
    );
  }

  public async playHideAnimation() {
    await this.tweeener.to(this.children, { pixi: { scale: 0 }, duration: 0.11, ease: "power.out" });
  }

  destroy(options?: boolean | IDestroyOptions): void {
    delete this.onBackButtonClick;
    super.destroy(options);
  }
}
