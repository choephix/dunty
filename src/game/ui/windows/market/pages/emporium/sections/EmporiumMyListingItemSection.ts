import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { Container } from "@pixi/display";
import { SellEmporiumInfo } from "../components/SellEmporiumInfo";
import { SellInfoPanel } from "../components/SellInfoPanel";
import { SellItemPanel } from "../components/SellItemPanel";
import { EmporiumStoreItemData } from "../data/EmporiumStoreItemData.model";
import { EmporiumDataService } from "../EmporiumDataService";

export class EmporiumMyListingItemSection extends Container {
  private readonly context: GameContext = GameSingletons.getGameContext();

  private readonly dataService: EmporiumDataService = new EmporiumDataService();

  public goBack?: () => void;

  constructor(private readonly data: EmporiumStoreItemData, modify: boolean) {
    super();

    if (!data) return;

    let labelValue = "CREATE LISTING";
    let labelOnClickFunction = async (value: string) => {
      await this.dataService.createListing(data);
      this.goBack?.();
      if (data.type == "amp") {
        this.context.modals.warning(
          "NICE WORK! YOU LISTED A " +
            value +
            ' AMP CENTURY VIAL FOR SALE.\nYOU CAN MODIFY YOUR LISTING FROM "MY LISTINGS".',
          "It's Listed"
        );
      } else {
        this.context.modals.warning(
          "NICE WORK! YOU LISTED THIS " +
            data.name.toUpperCase() +
            ' FOR SALE.\nYOU CAN MODIFY YOUR LISTING FROM "MY LISTINGS".',
          "It's Listed"
        );
      }
    };
    //// Check if the item is being modified or sold
    if (modify) {
      labelValue = "MODIFY LISTING";
      labelOnClickFunction = async (value: string) => {
        await this.dataService.modifyListing(data);
        this.goBack?.();
        this.context.modals.warning("NICE WORK! YOU MODIFIED A LISTING");
      };
    }

    if (data.type == "amp") {
      this.addItemPanel(
        data.centuryVialData.rarity,
        `${Math.floor(data.centuryVialData.ampAmount)} AMP`,
        "century-vials/" + data.centuryVialData.level + ".png"
      );
      this.addItemSellInfo(data.centuryVialData.rarity);
      this.addEmporiumInfo(
        data.centuryVialData.rarity,
        this.context.userData.anomaticParticles.toString(),
        data.centuryVialData.ampAmount.toString(),
        true,
        labelValue,
        labelOnClickFunction
      );
    } else {
      this.addItemPanel(data.ctPartData.rarity, data.ctPartData.part.toUpperCase(), data.ctPartData.imgUrl);
      this.addItemSellInfo(data.ctPartData.rarity);
      this.addEmporiumInfo(
        data.ctPartData.rarity,
        this.context.userData.anomaticParticles.toString(),
        "0",
        false,
        labelValue,
        labelOnClickFunction
      );
    }
  }

  addItemPanel(rarity: string, value: string, vial: string) {
    const ampPanel = new SellItemPanel();
    ampPanel.addBackground(rarity);
    ampPanel.addPlaque(value, rarity);
    ampPanel.position.set(350, 435);
    ampPanel.setThumbnail(vial);
    return this.addChild(ampPanel);
  }

  addItemSellInfo(rarity: string) {
    const sellInfoPanel = new SellInfoPanel();
    sellInfoPanel.position.set(825, 435);

    sellInfoPanel.addBackground(rarity);
    if (this.data.type == "amp") {
      sellInfoPanel.addVials();
    }

    sellInfoPanel.myPriceValue.visible = this.data.price >= 0;
    sellInfoPanel.myPriceValue.text = String(this.data.price);
    sellInfoPanel.myPriceValue.on("input", () => {
      this.data.price = Number(sellInfoPanel.myPriceValue.text);
    });

    const getLowestListingPricePromise = this.dataService.getLowestListingPrice(this.data);
    this.context.spinner.showDuring(getLowestListingPricePromise).then(lowestPrice => {
      sellInfoPanel.setLowestListPrice(lowestPrice);

      if (this.data.price <= 0) this.data.price = lowestPrice;
      sellInfoPanel.myPriceValue.text = String(this.data.price);
      sellInfoPanel.myPriceValue.visible = true;
    });

    return this.addChild(sellInfoPanel);
  }

  addEmporiumInfo(
    rarity: string,
    ampBalanceValue: string,
    ampAmount: string,
    ampBalance: boolean,
    listingText: string,
    listingFunction: (value: string) => void
  ) {
    const empInfo = new SellEmporiumInfo();
    empInfo.onListing = listingFunction;
    empInfo.position.set(1700, 435);
    empInfo.addListingButton(rarity, ampAmount, listingText);
    if (ampBalance) {
      empInfo.addAmpBalanceText();
      empInfo.setAmpBalance(ampBalanceValue);
    }
    this.addChild(empInfo);
  }
}
