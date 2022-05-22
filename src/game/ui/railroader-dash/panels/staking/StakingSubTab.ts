import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { createComingSoonMessage } from "@game/asorted/createComingSoonMessage";
import { FontFamily } from "@game/constants/FontFamily";
import { Container } from "@pixi/display";
import { StakedAssetPlatesList } from "./StakedAssetPlatesList";

export class StakingSubTab extends Container {
  private readonly context: GameContext = GameSingletons.getGameContext();

  constructor(type: "staked" | "requests") {
    super();

    //// Add header
    if (type === "staked") this.addHeader("LOCOMOTIVE/CONDUCTOR");
    else {
      this.addHeader("REQUEST DETAILS");
      const msg = createComingSoonMessage();
      msg.position.set(500, 500);
      this.addChild(msg);
    }
    //// Add element list
    this.addList(type);
  }

  addHeader(typeText: string) {
    //// Add header text
    const subTabText = this.context.simpleFactory.createText(
      typeText,
      {
        fontFamily: FontFamily.Default,
        fill: 0xffffff,
        fontSize: 16,
      },
      { x: 275, y: 295 }
    );
    this.addChild(subTabText);
    const stationText = this.context.simpleFactory.createText(
      "STATION",
      {
        fontFamily: FontFamily.Default,
        fill: 0xffffff,
        fontSize: 16,
      },
      { x: 625, y: 295 }
    );
    this.addChild(stationText);
  }

  async addList(type: "staked" | "requests") {
    if (type == "staked") {
      const list = new StakedAssetPlatesList();
      list.position.set(210, 330);
      list.init();
      this.addChild(list);
    }
  }
}
