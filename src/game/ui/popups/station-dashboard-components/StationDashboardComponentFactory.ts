import { StationEntity } from "@game/data/entities/StationEntity";
import { StationPopupDropdownComponent } from "@game/ui/components/StationPopupDropdownComponent";
import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { CommodityRateIconsRow } from "../components/CommodityRateIconsRow";
import { StationPopupComponentFactory } from "../components/factory/StationPopupComponentFactory";
import { StationDashboardPopup } from "../StationDashboardPopup";

export class StationDashboardComponentFactory extends StationPopupComponentFactory {
  constructor(popup: StationDashboardPopup) {
    super(popup);
  }

  addPageTitle = (titleText: string) => {
    const x = 58;
    const y = 80;
    const title = this.createTitle(titleText, this.popup.width);
    title.anchor.set(0.0, 1.0);
    title.position.set(x, y);
    return this.popup.addChild(title);
  };

  addPageSubtitle = (titleText: string) => {
    const x = 70;
    const y = 115;
    const scale = 0.65;
    const subtitle = this.createLabel(titleText, this.popup.width);
    subtitle.anchor.set(0.0, 1.0);
    subtitle.position.set(x, y);
    subtitle.scale.set(scale);
    return this.popup.addChild(subtitle);
  };

  addDetailSubtitle = (titleText: string) => {
    const x = 610;
    const y = 115;
    const scale = 0.64;
    const subtitle = this.createLabel(titleText, this.popup.width);
    subtitle.anchor.set(1.0, 1.0);
    subtitle.position.set(x, y);
    subtitle.scale.set(scale);
    return this.popup.addChild(subtitle);
  };

  addCommodityRateIcons = (station: StationEntity) => {
    const x = 158;
    const y = 100;
    const commodityIconsCount = 5;
    const iconContainer = new CommodityRateIconsRow(station, commodityIconsCount);
    iconContainer.position.set(x, y);
    return this.popup.addChild(iconContainer);
  };

  addBottomBarDropdown = (
    options: { text: string }[],
    onOptionChosen: (index: number) => void,
    initialSelectedOptionIndex: number
  ) => {
    const x = 50;
    const y = 400;
    const scale = 0.51;
    const dropdownButton = new StationPopupDropdownComponent(options, onOptionChosen, initialSelectedOptionIndex);
    dropdownButton.position.set(x, y);
    dropdownButton.scale.set(scale);
    this.popup.addChild(dropdownButton);
    return dropdownButton;
  };

  addCsvButton(onClick: () => void) {
    const x = 550;
    const y = 400;
    const scale = 0.51;

    const csvTextureId = "ui-station-dashboard/chart-elements/csv-btn.png";
    const csvTexture = this.context.assets.getTexture(csvTextureId);
    const csvBtn = new Sprite(csvTexture);
    csvBtn.scale.set(scale);
    csvBtn.position.set(x, y);

    buttonizeDisplayObject(csvBtn, onClick);

    return csvBtn;
  }

  addPageDimmer = () => {
    const texture = Texture.from("ui-station-dashboard/dim.png");
    const sprite = new Sprite(texture);
    sprite.scale.set(0.502 * 4);
    sprite.position.set(-8, -5);
    this.popup.addChild(sprite);

    sprite.tint = 0x808080;

    const ALPHA_MAX = 0.95;
    const ALPHA_MIN = 0.35;
    const tweeener = new TemporaryTweeener(sprite);
    function setAnimatedVisiblity(visible: boolean, instant: boolean = false) {
      const alpha = visible ? ALPHA_MAX : ALPHA_MIN;
      if (instant) {
        sprite.alpha = alpha;
      } else {
        tweeener.to(sprite, { alpha, duration: 0.5, ease: "power4.out" });
      }
    }

    return Object.assign(sprite, { setAnimatedVisiblity });
  };
}
