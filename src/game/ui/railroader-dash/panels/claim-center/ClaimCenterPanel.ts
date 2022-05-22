import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { Container } from "@pixi/display";
import { Text } from "@pixi/text";
import { RailroaderDashPanelBase } from "../RailroaderDashPanelBase";
import { ClaimCenterList } from "./ClaimCenterList";

const commonLabelStyle = {
  fill: "#FFFFFF",
  fontFamily: FontFamily.Default,
};

const headerTextCoordinates = [
  { x: 100, y: -15 },
  { x: 425, y: -15 },
];

export class ClaimCenterPanel extends RailroaderDashPanelBase {
  claimList?: Container;
  claimListElements?: Container;

  public claimedTocium?: () => unknown;

  init(): void {
    //// Logo image
    this.addTitleImage("ui-railroader-dashboard/page-claim-center/img-claim-center.png");

    //// Plaque
    this.addGreenPlaque({
      message: "If something goes wrong with a reward claim,\nhead here to get caught up.",
    });

    this.claimListElements = this.addListPad();

    this.addChild(this.claimListElements);

    //// Set Claims
    this.setClaimCenterText();

    //// Add claims elements
    this.addClaimsElements();

    //// Add claimedTocium event function
    this.claimedTocium = () => {
      this.setClaimCenterText();
    };
  }

  addClaimsElements() {
    //// Claim Header Text
    const headerTextStations = this.componentFactory.addHeaderText(
      16,
      headerTextCoordinates,
      [
        { id: `reward`, label: `reward` },
        { id: `action `, label: `action` },
      ],
      commonLabelStyle
    );
    this.claimListElements!.addChild(headerTextStations);
  }

  createClaimList() {
    const { contracts, userDataCtrl, spinner } = GameSingletons.getGameContext();

    const list = new ClaimCenterList();

    list.events.on({
      claimReward: async data => {
        list.clearList();
        await spinner.showDuring(contracts.claimSpecialRewards(data.id));
        await spinner.showDuring(userDataCtrl.updateAll());
        list.fillClaimCenterList();
      },
    });

    return list;
  }

  addNoClaimMessage(x: number, y: number) {
    const container = new Container();
    const message = new Text("You're all caught up! No claims available.", commonLabelStyle);
    message.anchor.set(0.5);
    container.addChild(message);
    container.position.set(x, y);
    return container;
  }

  async setClaimCenterText() {
    if (this.claimList) this.claimList.destroy();
    this.claimList = this.createClaimList();
    const hasData = await (this.claimList as ClaimCenterList).fillClaimCenterList();

    if (this.claimListElements) {
      if (hasData) {
        //// Add Claim List
        this.claimList.position.set(200, 325);
        this.claimListElements.visible = true;
      }

      //// Add No Claim Message
      else {
        this.claimListElements.visible = false;
        this.claimList.destroy();
        let claimEmptyMessage = this.addNoClaimMessage(this.width / 2, this.height / 2);
        this.addChild(claimEmptyMessage);
      }
    }

    this.addChild(this.claimList);
  }
}
