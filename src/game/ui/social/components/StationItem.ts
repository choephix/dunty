import { SimpleObjectsFactory } from "@game/app/components/SimpleObjectsFactory";
import { GameSingletons } from "@game/app/GameSingletons";
import { StationEntity } from "@game/data/entities/StationEntity";
import { Container } from "@pixi/display";

export class StationItem extends Container {
  private readonly factory: SimpleObjectsFactory = GameSingletons.getSimpleObjectFactory();

  addStationName(name: string) {
    const label = this.factory.createText(name.toUpperCase(), {
      fontSize: 14,
      lineHeight: 15,
      wordWrap: true,
      wordWrapWidth: 60,
    });
    this.addChild(label);
  }

  addStationSprite(textureId: string) {
    const sprite = this.factory.createSprite(textureId, { x: 115, y: 10 });
    sprite.anchor.set(0.5, 0.5);
    sprite.scale.set(0.075);
    this.addChild(sprite);
  }

  addLocatorButton(station: StationEntity) {
    const locateBtn = this.factory.createSprite("ui-railruns-window/btn-locator-expanded-row.png", { x: 150 });
    locateBtn.scale.set(0.5);
    locateBtn.buttonMode = true;
    locateBtn.interactive = true;
    this.addChild(locateBtn);

    const input = GameSingletons.getInputService();
    locateBtn.on("pointerup", () => input.dispatch("locateOnMap", station));
  }
}
