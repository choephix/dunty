import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { EventBus } from "@sdk/core/EventBus";

class ArrowButton extends Sprite {
  public disabled: boolean = false;

  constructor(private readonly texture_Plain: Texture, private readonly texture_Disabled: Texture) {
    super(texture_Plain);

    this.interactive = true;
    this.buttonMode = true;
  }

  setDisabled(disabled: boolean) {
    this.disabled = disabled;
    this.texture = disabled ? this.texture_Disabled : this.texture_Plain;
  }
}

export class ChartPaginationArrowButtons extends Container {
  private readonly assets = GameSingletons.getResources();

  private pageCount: number = 1;
  private currentPageIndex: number = 0;

  private readonly prevButton: ArrowButton;
  private readonly nextButton: ArrowButton;

  public readonly events = new EventBus<{
    pageChange: (currentPageIndex: number, prevPageIndex: number) => void;
  }>();

  constructor() {
    super();

    const x: number = 0;
    const y: number = 0;
    const scale: number = 1;

    const previousBtn = (this.prevButton = new ArrowButton(
      this.assets.getTexture("ui-station-dashboard/chart-elements/Back-btn.png"),
      this.assets.getTexture("ui-station-dashboard/chart-elements/Back-btn-muted.png")
    ));
    previousBtn.scale.set(scale);
    previousBtn.position.set(x + previousBtn.width / 2, y + previousBtn.height * 6);

    const nextBtn = (this.nextButton = new ArrowButton(
      this.assets.getTexture("ui-station-dashboard/chart-elements/Next-btn.png"),
      this.assets.getTexture("ui-station-dashboard/chart-elements/Next-muted.png")
    ));
    nextBtn.scale.set(scale);
    nextBtn.position.set(x + nextBtn.width / 2, y + nextBtn.height * 7);

    this.addChild(previousBtn, nextBtn);

    //back event
    buttonizeDisplayObject(previousBtn, () => {
      if (previousBtn.disabled) return;
      this.setCurrentPage(this.currentPageIndex - 1);
    });

    //foward event
    buttonizeDisplayObject(nextBtn, () => {
      if (nextBtn.disabled) return;
      this.setCurrentPage(this.currentPageIndex + 1);
    });

    this.updatePaginationSettings(1, 0);
  }

  updatePaginationSettings(pageCount: number, currentPageIndex: number = 0) {
    this.pageCount = pageCount;
    this.setCurrentPage(currentPageIndex);
  }

  setCurrentPage(currentPageIndex: number) {
    const prevPageIndex = this.currentPageIndex;
    this.currentPageIndex = currentPageIndex;
    this.updateButtonStates();
    this.events.dispatch("pageChange", this.currentPageIndex, prevPageIndex);
  }

  private updateButtonStates() {
    this.prevButton.setDisabled(this.currentPageIndex <= 0);
    this.nextButton.setDisabled(this.currentPageIndex >= this.pageCount - 1);
  }
}
