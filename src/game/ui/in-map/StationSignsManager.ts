import { GameContext } from "@game/app/app";
import { FontFamily } from "@game/constants/FontFamily";
import { StationEntity } from "@game/data/entities/StationEntity";
import { Container } from "@pixi/display";
import { ITextStyle, Text } from "@pixi/text";

import { ReadonlyObjectDeep } from "type-fest/source/readonly-deep";
import { RailRunEntity } from "@game/data/entities/RailRunEntity";
import { Sprite } from "@pixi/sprite";
import { Renderer, Texture } from "@pixi/core";
import { BLEND_MODES } from "@pixi/constants";
import { formatTimeDurationHumanReadable } from "@game/asorted/formatTimeDurationHumanReadable";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { GameSingletons } from "@game/app/GameSingletons";

export class TociumIcon extends Container {
  public readonly icon: Sprite;

  constructor(context: GameContext) {
    super();

    function addGlow(rotationSpeed: number) {
      const glowTeextureId = "rays";
      const glowTeexture = Texture.from(glowTeextureId);
      const glow = new Sprite(glowTeexture);
      glow.anchor.set(0.5);
      glow.tint = 0x00ffff;
      glow.blendMode = BLEND_MODES.ADD;
      context.utils.overrideRenderMethod(glow, ({ deltaSeconds, totalSeconds }) => {
        glow.rotation += rotationSpeed * deltaSeconds;
      });
      return glow;
    }

    this.addChild(addGlow(1)).scale.set(-1.2);
    this.addChild(addGlow(-1)).scale.set(1.2);

    const iconTeextureId = "ui-main/tocium-sm.png";
    const iconTeexture = Texture.from(iconTeextureId);
    const icon = new Sprite(iconTeexture);
    icon.anchor.set(0.5);
    icon.scale.set(2.0);
    this.icon = this.addChild(icon);
  }

  render(renderer: Renderer) {
    if (this.icon.visible) {
      this.icon.rotation -= 0.0025;
    }

    super.render(renderer);
  }
}

export class StationSign extends Container {
  private readonly context = GameSingletons.getGameContext();

  public readonly label: Text;
  public readonly icon: TociumIcon;

  private readonly tweeener = new TemporaryTweeener(this);

  constructor() {
    super();

    this.icon = new TociumIcon(this.context);
    this.icon.y = -350;
    this.addChild(this.icon);

    const clockStyle = {
      fontSize: 36,
      fontWeight: "bolder",
      fill: "#FFFFFF",
      stroke: "#080808",
      strokeThickness: 4,
      fontFamily: FontFamily.Default,
      align: "center",
    } as Partial<ITextStyle>;
    const label = new Text("00:00", clockStyle);
    label.scale.set(2.0);
    label.anchor.set(0.5);
    label.alpha = 0.65;
    label.y = -200;
    this.label = this.addChild(label);
  }

  show() {
    this.tweeener.from(this, { alpha: 0, duration: 0.5, ease: "power2.inOut" });
  }

  hideAndDestroy() {
    this.tweeener.to(this, { alpha: 0, duration: 0.5, onComplete: () => this.destroy({ children: true }) });
  }
}

function getRunText(run: ReadonlyObjectDeep<RailRunEntity>) {
  if (run.isReadyToClaim) {
    const TEXT_CLAIM_REWARDS = "Claim!";
    return TEXT_CLAIM_REWARDS.toUpperCase();
  }
  return formatTimeDurationHumanReadable(run.secondsLeft);
}

/**
 * Puts needed sign objects over stations on the map, and removes unneeded ones.
 *
 * Updates their texts and positions when necessary.
 */
export class StationSignsManager {
  private readonly context = GameSingletons.getGameContext();

  private readonly current = new Map<StationEntity.AssetId, StationSign>();

  constructor() {
    this.context.ticker.add(this.onEnterFrame, this);
  }

  *iterateOngoingRunsData() {
    const runs = this.context.userData.trainsOngoingRuns.values();
    for (const run of runs) {
      yield {
        at: run.destination,
        text: getRunText(run),
        showIcon: run.isReadyToClaim,
      };
    }
  }

  onEnterFrame() {
    this.applyState([...this.iterateOngoingRunsData()]);
  }

  applyState(signs: { at: StationEntity.AssetId; text: string; showIcon: boolean }[]) {
    const world = this.context.world;
    const container = world.zoomLayers.operationsLayer.uiElementsContainer;
    const stationSprites = world.zoomLayers.operationsLayer.stationsContainer.stations;
    const currentKeys = [...this.current.keys()];

    for (const { at, text: newText, showIcon } of signs) {
      if (!this.current.has(at)) {
        const sign = new StationSign();
        this.current.set(at, sign);
        container.addChild(sign);
        sign.show();
      } else {
        currentKeys.splice(currentKeys.indexOf(at), 1);
      }
      const sign = this.current.get(at)!;

      if (sign.label.text !== newText) {
        sign.label.text = newText;
      }
      sign.icon.visible = showIcon;

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
