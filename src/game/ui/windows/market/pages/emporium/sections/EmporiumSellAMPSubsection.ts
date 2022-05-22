import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { BitmapFontName } from "@game/constants/FontFamily";
import { Container } from "@pixi/display";
import { BitmapText, IBitmapTextStyle } from "@pixi/text-bitmap";
import { formatToMaxDecimals } from "@sdk-ui/utils/formatToMaxDecimals";
import { SellVialItemPanel } from "../components/SellVialItemPanel";
import { CenturyVialData, createCenturyVialDataFromLevel } from "../data/createCenturyVialDataFromAMPAmount";
import { EmporiumStoreItemData, EmporiumStoreItemData_CenturyVial } from "../data/EmporiumStoreItemData.model";
import { EmporiumDataService } from "../EmporiumDataService";

const titleLabelStyle = {
  fontName: BitmapFontName.CelestialTypeface,
  align: "center",
  fontSize: 100,
} as IBitmapTextStyle;

const vialConfigs = [];

export class EmporiumSellAMPSubsection extends Container {
  private readonly context = GameSingletons.getGameContext();

  dataService: EmporiumDataService = new EmporiumDataService();
  onItemSell?: (item: EmporiumStoreItemData) => void = () => {};

  ampBalance;

  constructor() {
    super();

    //// Add amp balance panel
    const ampBg = this.context.simpleFactory.createSprite("ui-market-window-emporium/sell/balance-bg.png", {
      x: 800,
      y: 380,
    });
    this.addChild(ampBg);

    const ampIcon = this.context.simpleFactory.createSprite("century-vials/amp-m.png", { x: 800, y: 405 });
    this.addChild(ampIcon);

    const ampBalanceText = this.context.simpleFactory.createText(
      "MY AMP BALANCE",
      { fontSize: 34 },
      { x: 1100, y: 455 }
    );
    this.addChild(ampBalanceText);

    this.ampBalance = new BitmapText("0", titleLabelStyle);
    this.ampBalance.anchor.set(0.5);
    this.ampBalance.position.set(1249.5, 515);
    this.addChild(this.ampBalance);

    this.addCenturyVialPlates(this.context.userData.anomaticParticles);
  }
  //// Create vial plate
  createCenturyVialPlate(data: CenturyVialData) {
    const { rarity, ampAmount, level } = data;
    const ampPanel = new SellVialItemPanel();
    ampPanel.addBackground(rarity);
    ampPanel.addAmpPlaque(`${ampAmount} AMP`, rarity);
    ampPanel.position.set(450, 375);
    ampPanel.setVialThumbnail(level);
    ampPanel.addSellPlaque(rarity, () => {
      const newItem: EmporiumStoreItemData_CenturyVial = {
        type: "amp",
        id: -1,
        name: `${ampAmount} vial`,
        railroader: this.context.contracts.currentUserName,
        price: -1,
        centuryVialData: data,
        amount: ampAmount,
        timeCreated: new Date().getTime(),
      };
      this.onItemSell?.(newItem);
    });
    ampPanel.scale.set(0.75);
    return ampPanel;
  }

  addCenturyVialPlates(userAmpBalance: number) {
    this.ampBalance.text = formatToMaxDecimals(userAmpBalance, 1);

    //// Add green, blue, purple, yellow and red vials
    for (let i = 1; i <= 5; i++) {
      const data = createCenturyVialDataFromLevel(i);
      const plate = this.createCenturyVialPlate(data);
      plate.position.set(250 + (i - 1) * 385, 650);
      this.addChild(plate);

      if (userAmpBalance < data.ampAmount) plate.grayOut();
    }
  }
}
