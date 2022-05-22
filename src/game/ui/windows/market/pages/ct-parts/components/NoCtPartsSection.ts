import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";

export class NoCtPartsSection extends Container {
  private readonly context: GameContext = GameSingletons.getGameContext();

  constructor() {
    super();

    this.addSpeechBubble();
    this.addMessage();
  }

  // speech bubble
  private addSpeechBubble(): void {
    const genericTalkingBubble = new Sprite(this.context.assets.getTexture("ui-market-window-ct-parts/Bubble.png"));
    genericTalkingBubble.name = "genericTalkingBubble";
    genericTalkingBubble.position.set(1427, 205);
    genericTalkingBubble.scale.set(0.65);
    this.addChild(genericTalkingBubble);

    const bubbleTextContent = "Yeah, like come see me... If you want...";
    const bubbleText = new Text(bubbleTextContent, {
      fill: "#FFFFFF",
      fontFamily: FontFamily.DanielBlack,
      fontSize: 40,
      align: "center",
      wordWrap: true,
      wordWrapWidth: 590,
    });
    bubbleText.anchor.set(0.5);
    bubbleText.position.set(404, 165);
    genericTalkingBubble.addChild(bubbleText);
  }

  private addMessage(): void {
    const headerContent = "You have not discovered any Century Train Parts yet!";
    const header = new Text(headerContent, {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 32,
    });
    header.name = "header";
    header.position.set(327, 607);
    this.addChild(header);

    const bodyContent = "Go make some runs and be on the\nlookout for Oil Zone Otto!";
    const body = new Text(bodyContent, {
      fill: "#FFFFFF",
      fontFamily: FontFamily.Default,
      fontSize: 44,
    });
    body.name = "name";
    body.position.set(328, 666);
    this.addChild(body);
  }
}
