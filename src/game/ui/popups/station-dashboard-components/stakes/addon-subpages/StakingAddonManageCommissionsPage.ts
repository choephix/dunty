import { StakingAddonType } from "@game/asorted/StakingType";
import { StationEntity } from "@game/data/entities/StationEntity";
import { Sprite } from "@pixi/sprite";
import { BitmapText, IBitmapTextStyle } from "@pixi/text-bitmap";
import { BottomBar } from "./components/BottomBar";
import { PercentageBox } from "./components/PercentageBox";
import { BaseStakingAddonPage } from "./BaseStakingAddonPage";

const titleLabelStyle = {
  fontName: "Celestial Typeface",
  align: "center",
  fontSize: 30,
} as IBitmapTextStyle;

export class StakingAddonManageCommissionsPage extends BaseStakingAddonPage {
  public subpageTitle = "Commission Rates";

  private readonly bottomBar: BottomBar;

  constructor(public readonly station: StationEntity, public readonly addonType: StakingAddonType) {
    super(station, addonType);

    this.bottomBar = new BottomBar();
    this.bottomBar.setText(`SLIDE THE ICONS TO CHANGE THE COMMISSION RATES`);
    this.addChild(this.bottomBar);
  }

  async initialize() {
    await super.initialize();

    //// Add background
    const bk = new Sprite(this.assets.getTexture("ui-station-dashboard/staking/manage-tab/commissions/box-main.png"));
    bk.position.set(50, 110);
    bk.scale.set(0.5);
    this.addChild(bk);

    //// Add title
    const title = new BitmapText("Commission Rates", titleLabelStyle);
    title.anchor.set(0.5);
    title.position.set(bk.x + bk.width / 2, 165);
    this.addChild(title);

    //// Add left percentage box
    const lPercentBox = new PercentageBox();
    lPercentBox.addPercentageBox(1, "Public", 0x6f4f32, "MAX: 50%");
    lPercentBox.scale.set(0.5);
    lPercentBox.position.set(95, 215);
    this.addChild(lPercentBox);

    //// Add left percentage box
    const rPercentBox = new PercentageBox();
    rPercentBox.addPercentageBox(-1, "VIP", 0x034053, "MAX: 50%");
    rPercentBox.scale.set(0.5);
    rPercentBox.position.set(305, 215);
    this.addChild(rPercentBox);

    //// Add events
    this.interactive = true;
    this.on("pointerup", () => {
      lPercentBox.removeGlow();
      rPercentBox.removeGlow();
    });

    lPercentBox.setValue(0.01 * this.addonData.commissionRate);
    rPercentBox.setValue(0.01 * this.addonData.commissionRateVip);

    this.bottomBar.addButton("CONFIRM", async () => {
      await this.spinner.showDuring(
        this.addonDataService.setCommissionRates(
          lPercentBox.percentValue,
          rPercentBox.percentValue,
          this.station.assetId
        )
      );
    });
  }
}
