import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { buttonizeInstance } from "@sdk-ui/buttonize";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { ChartsDataTimeframe } from "../../data/StationDashboardChartsDataAdapter";

/**
 * A container with the four timeframe buttons.
 *
 * Automatically handles current selection, highlighting, and click events.
 * All it needs is to know how to tell the outside world, that a change to its
 * current selection has been made.
 *
 * @param onTimeframeButtonClick The function to call when a timeframe button is clicked.
 * @returns The container, so you can add it to the stage and position it as you like.
 */
export class ChartTimeFrameButtons extends Container {
  private readonly resources = GameSingletons.getResources();
  private readonly tweeener = new TemporaryTweeener(this);

  private currentSelection: ChartsDataTimeframe = ChartsDataTimeframe.$24Hours;

  //// Create the buttons

  private readonly buttons = [
    this.addButtonRow(
      "ui-station-dashboard/chart-elements/24HR-gray.png",
      "ui-station-dashboard/chart-elements/24HR-green.png",
      ChartsDataTimeframe.$24Hours
    ),
    this.addButtonRow(
      "ui-station-dashboard/chart-elements/7D-gray.png",
      "ui-station-dashboard/chart-elements/7D-green.png",
      ChartsDataTimeframe.$7Days
    ),
    this.addButtonRow(
      "ui-station-dashboard/chart-elements/30D-gray.png",
      "ui-station-dashboard/chart-elements/30D-green.png",
      ChartsDataTimeframe.$30Days
    ),
    this.addButtonRow(
      "ui-station-dashboard/chart-elements/ALL-gray.png",
      "ui-station-dashboard/chart-elements/ALL-green.png",
      ChartsDataTimeframe.$All
    ),
  ];
  constructor(private readonly onTimeframeSelectionChange: (timeframe: ChartsDataTimeframe) => void) {
    super();

    this.updateButtonPositions();

    this.selectTimeframe(ChartsDataTimeframe.$24Hours);

    //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP ////
    this.buttons[3].visible = false;
    //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP ////
  }

  //// Handle selection change
  selectTimeframe(timeframe: ChartsDataTimeframe) {
    this.currentSelection = timeframe;
    for (const button of this.buttons) {
      button.setSelected(button.timeframe === timeframe);
    }
    this.onTimeframeSelectionChange(timeframe);
  }

  private addButtonRow(textureId_Plain: string, textureId_Highlight: string, timeframe: ChartsDataTimeframe) {
    const texturePlain = this.resources.getTexture(textureId_Plain);
    const textureHighlight = this.resources.getTexture(textureId_Highlight);

    /**
     * Automatically adds some button-like functionality to the object
     * and also merges it with whatever object is given as the second argument.
     */
    const button = buttonizeInstance(new Sprite(texturePlain), {
      timeframe,
      isSelected: () => this.currentSelection === timeframe,
      setSelected: (isSelected: boolean) => {
        this.tweeener.to(highlight, { alpha: isSelected ? 1 : 0, duration: 0.45 });
      },
    });
    const highlight = new Sprite(textureHighlight);
    highlight.alpha = 0;

    button.behavior.on({
      trigger: () => {
        if (button.isSelected()) return;
        this.selectTimeframe(timeframe);
      },
      hoverIn: () => {
        if (button.isSelected()) return;
        this.tweeener.to(highlight, { alpha: 0.4, duration: 0.2 });
      },
      hoverOut: () => {
        if (button.isSelected()) return;
        this.tweeener.to(highlight, { alpha: 0, duration: 0.2 });
      },
      down: () => {
        if (button.isSelected()) return;
        this.tweeener.to(button.pivot, { y: -4, duration: 0.05 });
      },
      up: () => {
        this.tweeener.to(button.pivot, { y: 0, duration: 0.2 });
      },
    });

    /**
     * Turns out, Pixi's Sprite also extends Container,
     * so we can just add the highlight as its child and have
     * them both be positioned correctly together without much fuss.
     */
    button.addChild(highlight);
    this.addChild(button);

    return button;
  }

  //// Position the buttons in a column
  private updateButtonPositions() {
    /**
     * We can sort of infer this from the texture size, but having it hard-coded
     * here is a bit more explicit and will give us control over the layout.
     *
     * (Like if someone says "these buttons are too far apart/close together"
     * this will be all we need to change, as opposed to redoing the loop or the textures)
     */
    const yDifferenceBetweenButtons = 50;

    let y = 0;
    for (const button of this.buttons) {
      button.y = y;
      y += yDifferenceBetweenButtons;
    }
  }
}
