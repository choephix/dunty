import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { ThemeColors } from "@game/constants/ThemeColors";
import { RailCarLoadStats } from "@game/data/entities/TrainEntity";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text, TextStyle } from "@pixi/text";
import { rarityLevelToSuffix } from "../bases/StationPopup";

export class RailCarStatBox extends Container {
  private readonly context: GameContext = GameSingletons.getGameContext();

  apply(rcLoadStats: RailCarLoadStats, goldenRunIndicator: boolean) {
    this.removeChildren();

    const { assets, main } = this.context;
    const { NORMAL_COLOR, DANGER_COLOR } = ThemeColors;

    const addSprite = (textureId: string) => {
      const sprite = assets.makeSprite(textureId);
      sprite.anchor.set(0.5);
      this.addChild(sprite);
      return sprite;
    };

    const rcRarity = rarityLevelToSuffix(rcLoadStats.rcRarity);

    const makeStatBoxOptions = () => {
      const { wagonType } = rcLoadStats;
      const padTexturePath = `ui-popups/color-pad-rc/${rcRarity}.png`;

      if (wagonType === "railcar") {
        const invalid = rcLoadStats.capacityUtilized > rcLoadStats.capacityMax;
        return {
          padTexturePath,
          wagonIconTexturePath: `ui-icons/wagon-type/lg-rc.png`,
          loadIcons: [
            `ui-icons/commodity/${rcLoadStats.rcStats.commodity_type}.png`,
            `ui-icons/commodity/${rcLoadStats.rcStats.commodity_type2}.png`,
          ],
          infoRows: [
            ["C", `${rcLoadStats.capacityUtilized}/${rcLoadStats.capacityMax}`],
            ["W", `${rcLoadStats.totalWeight}`],
          ] as [string, string][],
          invalid: invalid,
        };
      }

      if (wagonType === "passengercar") {
        const invalid = rcLoadStats.seatsUtilized > rcLoadStats.seatsMax;

        // 2   3
        //   1
        // 5   4

        const passengerRegions = new Set<number>();
        for (const passenger of rcLoadStats.passengers) {
          passengerRegions.add(passenger.stats.home_regionid);
        }
        return {
          padTexturePath,
          wagonIconTexturePath: `ui-icons/wagon-type/lg-pc.png`,
          loadIcons: [...passengerRegions].map(regionId => `ui-icons/region/region_${regionId}.png`),
          infoRows: [
            ["S", `${rcLoadStats.seatsUtilized}/${rcLoadStats.seatsMax}`],
            ["W", `${rcLoadStats.totalWeight}`],
          ] as [string, string][],
          invalid: invalid,
        };
      }

      throw new Error(`Unknown wagon type: ${wagonType}`);
    };

    const options = makeStatBoxOptions();

    const pad = addSprite(options?.padTexturePath);
    const padHalfHeight = pad.height / 2;
    pad.position.set(0, padHalfHeight);

    const rcIcon = addSprite(options.wagonIconTexturePath);
    rcIcon.position.set(0, -44 + padHalfHeight);

    const LOAD_ICON_TEXTURE_SIZE = 128;
    const loadIconsMinimumSpacing = 128;
    const loadIconsAreaMaxWidth = 200;
    const loadIconsAreaMaxHeight = 85;
    const loadIconsCount = options.loadIcons.length;

    const loadIconsPotentialTotalAreaWidth =
      loadIconsCount * LOAD_ICON_TEXTURE_SIZE + (loadIconsCount - 1) * loadIconsMinimumSpacing;
    const loadIconMaxScaleX = loadIconsAreaMaxWidth / loadIconsPotentialTotalAreaWidth;
    const loadIconMaxScaleY = loadIconsAreaMaxHeight / LOAD_ICON_TEXTURE_SIZE;
    const loadIconScale = Math.min(1, loadIconMaxScaleX, loadIconMaxScaleY);
    const loadIconWidth = LOAD_ICON_TEXTURE_SIZE * loadIconScale;

    const loadIconsPositionStartX = -loadIconsAreaMaxWidth / 2 + 0.5 * loadIconWidth;
    const loadIconsPositionSpacingX = (loadIconsAreaMaxWidth - loadIconWidth) / loadIconsCount;

    for (const [i, iconTexturePath] of options.loadIcons.entries()) {
      const loadIcon = addSprite(iconTexturePath);

      const additionalScaleFactorForRegionIcons = rcLoadStats.wagonType === "passengercar" ? 0.9 : 1;
      loadIcon.scale.set(loadIconScale * additionalScaleFactorForRegionIcons);
      loadIcon.position.x = loadIconsPositionStartX + (i + 0.5) * loadIconsPositionSpacingX;
      loadIcon.position.y = 70 + padHalfHeight;
    }

    const textScaleBase = 1.4;
    const textMargin = 12;
    const textMaxWidth = pad.texture.width - textMargin - textMargin;
    const textStyleDefaults: Partial<TextStyle> = {
      fontSize: 28,
      fill: options.invalid ? DANGER_COLOR.toHex() : NORMAL_COLOR.toHex(),
      stroke: "#080808",
      strokeThickness: 3,
      fontFamily: FontFamily.Default,
      wordWrapWidth: textMaxWidth,
    };
    const addText = (text: string, style: Partial<TextStyle> = {}) => {
      const t = new Text(text, { ...textStyleDefaults, ...style });
      const align = style.align === "right" ? 1.0 : style.align === "center" ? 0.5 : 0.0;
      t.position.set((align - 0.5) * textMaxWidth, pad.texture.height);
      t.anchor.set(align, 0);
      t.scale.set(textScaleBase);
      this.addChild(t);
      return t;
    };

    let columnLeftText = "";
    let columnRightText = "";
    for (const [key, value] of options.infoRows) {
      columnLeftText += `${key}\n`;
      columnRightText += `${value}\n`;
    }

    const columnLeft = addText(columnLeftText, { align: "left" });
    const columnRight = addText(columnRightText, { align: "right" });
    const oversize = (columnLeft.width + columnRight.width) / textMaxWidth;
    if (oversize > 1.0) {
      columnLeft.scale.set(textScaleBase / oversize);
      columnRight.scale.set(textScaleBase / oversize);
    }

    if (goldenRunIndicator) {
      const indicator = new Sprite(this.context.assets.getTexture("golden-badge-lg.png"));
      indicator.anchor.set(0.5);
      indicator.scale.set(0.5);
      indicator.position.set(-pad.width / 2 + 10, 10);
      this.addChild(indicator);
    }

    return this;
  }
}
