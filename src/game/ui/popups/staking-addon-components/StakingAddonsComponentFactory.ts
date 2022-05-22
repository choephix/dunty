import { GameSingletons } from "@game/app/GameSingletons";
import { StationPopup } from "../bases/StationPopup";
import { StationPopupComponentFactory } from "../components/factory/StationPopupComponentFactory";

export class StakingAddonsComponentFactory extends StationPopupComponentFactory {
  constructor(popup: StationPopup) {
    super(popup);
  }

  addPageTitle = (titleText: string) => {
    const x = 58;
    const y = 80;
    const title = this.createTitle(titleText, this.popup.padWidth);
    title.anchor.set(0.0, 1.0);
    title.position.set(x, y);
    return this.popup.addChild(title);
  };

  addPageSubtitle = (titleText: string) => {
    const x = 70;
    const y = 115;
    const scale = 0.65;
    const subtitle = this.createLabel(titleText, this.popup.padWidth);
    subtitle.anchor.set(0.0, 1.0);
    subtitle.position.set(x, y);
    subtitle.scale.set(scale);
    return this.popup.addChild(subtitle);
  };
}
