import { FontFamily } from "@game/constants/FontFamily";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { getStakingAddonDisplayProperties } from "../utils/getStakingAddonDisplayProperties";
import { BaseStakingAddonPage } from "./BaseStakingAddonPage";
import { BottomBar } from "./components/BottomBar";
import { VipUsersListBox } from "./components/VipUsersListBox";

export class StakingAddonManageVIPWhitelistPage extends BaseStakingAddonPage {
  public subpageTitle = "VIP Whitelist";

  private list?: VipUsersListBox;

  async initialize() {
    await super.initialize();

    // ...

    //// Add background
    const textureId = "ui-station-dashboard/staking/manage-tab/manage-vips/table-bg.png";
    const texture = this.assets.getTexture(textureId);
    const bg = new Sprite(texture);
    bg.scale.set(0.5);
    bg.position.set(102.5, 125);
    this.addChild(bg);

    const bottomBar = new BottomBar();
    const bottomBarDefaultMessage = `Clicking on the trash button will remove all staked VIP assets`;
    bottomBar.setText(bottomBarDefaultMessage.toUpperCase());
    this.addChild(bottomBar);

    //// Add header
    const header = this.createHeader();
    header.scale.set(0.5);
    header.position.set(100, 125);
    this.addChild(header);

    //// Add vip list
    this.list = new VipUsersListBox();
    this.list.scale.set(0.5);
    this.list.position.set(105, header.y + header.height);
    this.addChild(this.list);

    this.list.events.on({
      clickDelete: async railroader => {
        const { addonDisplayName: displayName } = getStakingAddonDisplayProperties(this.addonType);
        const message = `
          Remove ${railroader} from the ${displayName.toUpperCase()} whitelist?
        `;
        const choice = await this.modals.confirm({
          title: "DELETE",
          content: message,
          acceptButtonText: "Yes",
          cancelButtonText: "No",
        });

        await this.addonDataService.removeUserFromVIPWhitelist(railroader, this.station.assetId);

        if (choice) {
          this.refreshList();
        }
      },
    });

    //// Add plus list
    const plus = new Text("+", {
      fontFamily: FontFamily.Default,
      fontSize: 24,
      fill: 0xffffff,
    });
    plus.position.set(125, 158);
    buttonizeDisplayObject(plus, async () => {
      const whiteListInfo = await this.modals.inputVIPWhitelistEntryInfo();
      if (whiteListInfo == null) {
        return;
      }

      const [railroaderName, vipSpotsCount] = whiteListInfo;
      if (!railroaderName) {
        return this.modals.warning(`Please enter a valid railroader name.`);
      }
      if (vipSpotsCount == null || isNaN(+vipSpotsCount)) {
        return this.modals.warning(`Please enter a valid number of VIP spots.`);
      }

      const stationId = this.station.assetId;
      await this.spinner.showDuring(
        this.addonDataService.setToVIPWhitelistSpots(railroaderName, stationId, +vipSpotsCount)
      );
      await this.spinner.showDuring(this.refreshList());
    });

    this.addChild(plus);

    await this.refreshList();
  }

  async refreshList() {
    if (!this.list) throw new Error("List is not initialized");

    this.list.clear();

    const data = await this.addonDataService.getVIPWhitelist(this.station.assetId);
    this.list.addVipRows(data, 24);
  }

  private createHeader() {
    const container = new Container();

    //// Add header plate
    const headerPlate = new Sprite(
      this.assets.getTexture("ui-station-dashboard/staking/manage-tab/manage-vips/header-row-bg.png")
    );
    container.addChild(headerPlate);

    //// Add header user name text
    const railroaderText = new Text("RAILROADER", {
      fontFamily: FontFamily.Default,
      fontSize: 30,
      fill: 0xffffff,
    });
    railroaderText.anchor.set(0.5);
    railroaderText.position.set(headerPlate.x + 185, headerPlate.y + headerPlate.height / 2 - 5);
    container.addChild(railroaderText);

    //// Add header vip spots text
    const vipSpotsText = new Text("VIP SPOTS", {
      fontFamily: FontFamily.Default,
      fontSize: 30,
      fill: 0xffffff,
    });
    vipSpotsText.anchor.set(0.5);
    vipSpotsText.position.set(headerPlate.x + 510, headerPlate.y + headerPlate.height / 2 - 5);
    container.addChild(vipSpotsText);

    //// Add header commission/hour text
    const commissionsPerHourText = new Text("COMM / HR", {
      fontFamily: FontFamily.Default,
      fontSize: 30,
      fill: 0xffffff,
    });
    commissionsPerHourText.anchor.set(0.5);
    commissionsPerHourText.position.set(headerPlate.x + 825, headerPlate.y + headerPlate.height / 2 - 5);
    container.addChild(commissionsPerHourText);
    return container;
  }

  playShowAnimation() {
    return this.tweeener.from([...this.children], {
      pixi: {
        alpha: 0,
        pivotY: -40,
      },
      duration: 0.18,
      ease: "power.out",
      stagger: 0.06,
    });
  }
}
