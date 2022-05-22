import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";

const commonLabelStyle = {
  fill: "#FFFFFF",
  fontFamily: FontFamily.Default,
};

export function showGoldenRunCheckSuccessModal(container: Container) {
  const assets = GameSingletons.getResources();

  return new Promise<void>(resolve => {
    // Background
    const bg = new Sprite(assets.getTexture(`ui-golden-runs/modal-success.png`));
    bg.scale.set(0.7);
    bg.position.set(-110, -343);

    // Title
    const title = new Sprite(assets.getTexture(`ui-golden-runs/Title.png`));
    bg.addChild(title);
    title.position.set(268, 271);

    // Content box
    const box = new Sprite(assets.getTexture(`ui-golden-runs/success-textbox.png`));
    bg.addChild(box);
    box.position.set(158, 392);

    // Content box text
    const boxContent =
      "You discovered a golden run!\n\nThis feat will go down in centuryverse history.\n\nAs promised, click the button below to claim your 1 0f 1 conductor journal nft. You earned it!";
    const boxText = new Text(boxContent.toUpperCase(), {
      ...commonLabelStyle,
      fontSize: 22,
      wordWrap: true,
      wordWrapWidth: 700,
    });
    boxText.name = "boxText";
    boxText.position.set(43, 48);
    box.addChild(boxText);

    // Claim NFT button
    const button = new Sprite(assets.getTexture(`ui-golden-runs/BTN.png`));
    bg.addChild(button);
    button.position.set(372, 677);

    button.interactive = true;
    button.buttonMode = true;

    const buttonLabelContent = "Claim NFT";
    const buttonLabel = new Text(buttonLabelContent.toUpperCase(), {
      ...commonLabelStyle,
      fontFamily: FontFamily.Default,
      fontSize: 36,
    });
    buttonLabel.name = "buttonLabel";
    buttonLabel.position.set(91, 20);
    button.addChild(buttonLabel);

    ////

    container.addChild(bg);
    buttonizeDisplayObject(button, () => {
      console.log("--- Claiming Golden Run NFT ---");
      // TODO: Add the functionality to claim the NFT

      container.removeChild(bg);
      resolve();
    });
  });
}
