import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { StationEntity } from "@game/data/entities/StationEntity";
import { Container } from "@pixi/display";
import { ITextStyle, Text } from "@pixi/text";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";

export class StationLabel extends Container {
  public readonly label: Text;

  private readonly tweeener = new TemporaryTweeener(this);

  constructor() {
    super();

    const labelStyle = {
      fontSize: 36,
      fontWeight: "bolder",
      fill: "#FFFFFF",
      stroke: "#080808",
      strokeThickness: 6,
      fontFamily: FontFamily.Default,
      align: "center",
    } as Partial<ITextStyle>;
    const label = new Text("", labelStyle);
    label.scale.set(2.0);
    label.anchor.set(0.5);
    label.alpha = 0.95;
    label.y = -160;
    this.label = this.addChild(label);
  }

  setText(value: string) {
    if (this.label.text !== value) {
      this.label.text = value;
    }
  }

  show() {
    this.tweeener.from(this.label, {
      alpha: 0,
      y: 0,
      duration: 0.275,
      ease: "power3.out",
    });
  }

  hideAndDestroy() {
    this.tweeener.to(this.label, {
      alpha: 0,
      y: -80,
      duration: 0.425,
      ease: "power3.inOut",
      onComplete: () => this.destroy({ children: true }),
    });
  }
}

/**
 * Puts needed sign objects over stations on the map, and removes unneeded ones.
 *
 * Updates their texts and positions when necessary.
 */
export class StationLabelsManager {
  private readonly context = GameSingletons.getGameContext();

  private readonly current = new Map<StationEntity.AssetId, StationLabel>();

  applyState(signs: { at: StationEntity.AssetId; text: string }[]) {
    const world = this.context.world;
    const container = world.zoomLayers.operationsLayer.uiElementsContainer;
    const stationSprites = world.zoomLayers.operationsLayer.stationsContainer.stations;
    const currentKeys = [...this.current.keys()];

    for (const { at, text: newText } of signs) {
      if (!this.current.has(at)) {
        const sign = new StationLabel();
        this.current.set(at, sign);
        container.addChild(sign);
        sign.show();
      } else {
        currentKeys.splice(currentKeys.indexOf(at), 1);
      }
      const sign = this.current.get(at)!;
      sign.setText(newText);

      const stationVisual = stationSprites.get(at);
      if (!stationVisual) {
        throw new Error(`Station ${at} not found`);
      }
      sign.position.copyFrom(stationVisual.position);
      sign.scale.copyFrom(stationVisual.scale);
    }

    for (const at of currentKeys) {
      const sign = this.current.get(at)!;
      sign.hideAndDestroy();
      this.current.delete(at);
    }
  }
}
