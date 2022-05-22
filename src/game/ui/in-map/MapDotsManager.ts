import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { EnchantedSprite } from "@game/core/enchanted-classes";
import { TrainEntity } from "@game/data/entities/TrainEntity";
import { Texture } from "@pixi/core";
import { EnchantmentGlobals } from "@sdk/pixi/enchant/EnchantmentGlobals";
import { ReadonlyDeep } from "type-fest/source/readonly-deep";

export class MapDot extends EnchantedSprite {
  public scaleMultiplier = 1.0;

  constructor(color: number, public blink: boolean) {
    super(Texture.from(`assets/images/worldmap-markers/map-point.png`));

    this.anchor.set(0.5);
    this.scale.set(2.0);
    this.tint = color;

    this.onEnterFrame.add(() => {
      const time = EnchantmentGlobals.timeTotal;
      if (this.blink) {
        const a = Math.abs(Math.sin(1.87 * time));
        this.alpha = a * 1.0;
        this.scale.set(this.scaleMultiplier * (2.0 + 1.0 * a));
      } else {
        this.alpha = 1.0;
        this.scale.set(this.scaleMultiplier * 2.5);
      }
    });
  }
}

/**
 * Puts needed sign objects over stations on the map, and removes unneeded ones.
 *
 * Updates their texts and positions when necessary.
 */
export class MapDotsManager {
  private readonly context = GameSingletons.getGameContext();

  private readonly myTrains = new Map<TrainEntity.Name, [MapDot]>();
  private readonly myStations = new Array<MapDot>();
  private readonly special = new Array<MapDot>();

  constructor() {
    this.context.ticker.add(this.onEnterFrame, this);
    requestAnimationFrame(this.initialize.bind(this));
  }

  initialize() {
    this.refreshSpecialDots();
  }

  refreshSpecialDots() {
    const world = this.context.world;
    const container = world.zoomLayers.regionsLayer.uiElementsContainer;

    for (const dot of this.special) {
      dot.destroy({ children: true });
    }
    this.special.length = 0;

    const specialDots = this.context.mapData.specialObjects;
    for (const { x, y, dotColor } of specialDots) {
      const dot = new MapDot(dotColor, false);
      dot.position.set(x, y);
      this.special.push(dot);
      container.addChild(dot);
    }

    const myStations = this.context.mapData.stationsArray.filter(
      ({ ownerName }) => ownerName === this.context.userData.name
    );
    for (const { x, y } of myStations) {
      const dot = new MapDot(0x88ff66, false);
      dot.position.set(x, y);
      this.myStations.push(dot);
      container.addChild(dot);
    }
  }

  *iterateActiveTrains() {
    const trains = this.context.userData.trains.values();
    for (const train of trains) {
      yield train;
    }
  }

  onEnterFrame() {
    this.applyState([...this.iterateActiveTrains()]);
  }

  applyState(trains: readonly ReadonlyDeep<TrainEntity>[]) {
    const { main, world, viewport } = this.context;
    const container = world.zoomLayers.regionsLayer.uiElementsContainer;
    const myTrainNames = [...this.myTrains.keys()];

    const mapDotScale = 0.018 / viewport.scaled;

    for (const train of trains) {
      const { name: trainName } = train;

      if (!this.myTrains.has(trainName)) {
        const dot = new MapDot(0x32efef, false);
        dot.zIndex = 10;
        this.myTrains.set(trainName, [dot]);
        container.addChild(dot);
      } else {
        myTrainNames.splice(myTrainNames.indexOf(trainName), 1);
      }
      const [dot] = this.myTrains.get(trainName)!;
      const location = main.faq.getTrainLocationOnMap(train);
      if (location) {
        dot.position.copyFrom(location);
      }

      const run = this.context.userData.getOngoingTrainRun(trainName);
      const trainIsSittingStill = !run || run.isReadyToClaim;
      dot.blink = trainIsSittingStill;

      const scaleMultiplier = trainIsSittingStill ? 1.0 : 0.8;
      dot.scaleMultiplier = mapDotScale * scaleMultiplier;
    }

    for (const dot of this.special) {
      dot.scaleMultiplier = mapDotScale;
    }

    for (const dot of this.myStations) {
      dot.scaleMultiplier = mapDotScale;
    }

    for (const at of myTrainNames) {
      const [dot] = this.myTrains.get(at)!;
      dot.destroy({ children: true });
      this.myTrains.delete(at);
    }

    container.sortChildren();
  }
}
