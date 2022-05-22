import { SimpleObjectsFactory } from "@game/app/components/SimpleObjectsFactory";
import { GameSingletons } from "@game/app/GameSingletons";
import { formatDateTimeHumanReadable, formatShortDateHumanReadable } from "@game/asorted/formatDateTimeHumanReadable";
import { ThemeColors } from "@game/constants/ThemeColors";
import { StationEntity } from "@game/data/entities/StationEntity";
import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { Scrollbox } from "pixi-scrollbox";
import { StationItem } from "../StationItem";

export class ViewInfoSection extends Scrollbox {
  private readonly factory: SimpleObjectsFactory = GameSingletons.getSimpleObjectFactory();
  constructor() {
    super({
      noTicker: true,
      boxWidth: 650,
      boxHeight: 160,
      stopPropagation: true,
      divWheel: GameSingletons.getGameContext().app.view,
      overflow: "none",
    });
  }

  addInfoTitle() {
    const railroaderSince = this.factory.createText(
      "FIRST RAIL RUN:",
      {
        fill: ThemeColors.HIGHLIGHT_COLOR_LIGHT2.toInt(),
        fontSize: 16,
      },
      {
        x: 25,
      }
    );
    this.content.addChild(railroaderSince);

    const npcEncounters = this.factory.createText(
      "NPC ENCOUNTERS:",
      {
        fill: ThemeColors.HIGHLIGHT_COLOR_LIGHT2.toInt(),
        fontSize: 16,
      },
      {
        x: 215,
      }
    );
    this.content.addChild(npcEncounters);

    const achievements = this.factory.createText(
      "ACHIEVEMENTS:",
      {
        fill: ThemeColors.HIGHLIGHT_COLOR_LIGHT2.toInt(),
        fontSize: 16,
      },
      {
        x: 215,
        y: 50,
      }
    );
    this.content.addChild(achievements);

    const numberOfStations = this.factory.createText(
      "NUMBER OF STATIONS:",
      {
        fill: ThemeColors.HIGHLIGHT_COLOR_LIGHT2.toInt(),
        fontSize: 16,
      },
      {
        x: 400,
      }
    );
    this.content.addChild(numberOfStations);

    const stations = this.factory.createText(
      "STATIONS:",
      {
        fill: ThemeColors.HIGHLIGHT_COLOR_LIGHT2.toInt(),
        fontSize: 16,
      },
      {
        x: 400,
        y: 50,
      }
    );
    this.content.addChild(stations);

    const distanceTraveled = this.factory.createText(
      "DISTANCE TRAVELED:",
      {
        fill: ThemeColors.HIGHLIGHT_COLOR_LIGHT2.toInt(),
        fontSize: 16,
      },
      {
        x: 25,
        y: 50,
      }
    );
    this.content.addChild(distanceTraveled);

    const numberOfTrains = this.factory.createText(
      "NUMBER OF TRAINS:",
      {
        fill: ThemeColors.HIGHLIGHT_COLOR_LIGHT2.toInt(),
        fontSize: 16,
      },
      {
        x: 25,
        y: 100,
      }
    );
    this.content.addChild(numberOfTrains);

    this.content.addChild(this.addInvisibleBox(161));
    this.update();
  }

  fillInfo(data: {
    railroaderSince: string | Date;
    npcEncounters: string;
    achievements: string;
    numberOfStations: string;
    distanceTraveled: string;
    numberOfTrains: string;
    stations: StationEntity[];
  }) {
    const railroaderSinceInfo = this.factory.createText(
      typeof data.railroaderSince === "string"
        ? data.railroaderSince
        : formatShortDateHumanReadable(data.railroaderSince),
      {
        fontSize: 16,
      },
      {
        x: 25,
        y: 20,
      }
    );
    this.content.addChild(railroaderSinceInfo);

    const npcEncountersInfo = this.factory.createText(
      data.npcEncounters.toUpperCase(),
      {
        fontSize: 16,
      },
      {
        x: 215,
        y: 20,
      }
    );
    this.content.addChild(npcEncountersInfo);

    const achievementsInfo = this.factory.createText(
      data.achievements.toUpperCase(),
      {
        fontSize: 16,
      },
      {
        x: 215,
        y: 70,
      }
    );
    this.content.addChild(achievementsInfo);

    const numberOfStationsInfo = this.factory.createText(
      data.numberOfStations.toUpperCase(),
      {
        fontSize: 16,
      },
      {
        x: 400,
        y: 20,
      }
    );
    this.content.addChild(numberOfStationsInfo);

    const distanceTraveledInfo = this.factory.createText(
      data.distanceTraveled.toUpperCase(),
      {
        fontSize: 16,
      },
      {
        x: 25,
        y: 70,
      }
    );
    this.content.addChild(distanceTraveledInfo);

    const numberOfTrainsInfo = this.factory.createText(
      data.numberOfTrains.toUpperCase(),
      {
        fontSize: 16,
      },
      {
        x: 25,
        y: 120,
      }
    );
    this.content.addChild(numberOfTrainsInfo);

    let startY = 70;

    for (let station of data.stations) {
      const stationItem = new StationItem();
      stationItem.addStationName(station.name);
      stationItem.addStationSprite(`station-sprites/${station.rarity}.png`);
      stationItem.addLocatorButton(station);
      stationItem.position.set(400, startY);
      this.content.addChild(stationItem);
      startY += 50;
    }

    this.update();
  }

  addInvisibleBox(px: number) {
    const box = new Sprite(Texture.EMPTY);
    box.width = this.boxWidth + 1;
    box.height = px;
    return box;
  }

  clearData() {
    const children = [...this.content.children];
    for (const child of children) {
      child.destroy({ children: true });
    }
  }
}
