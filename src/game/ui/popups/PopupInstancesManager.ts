import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { StationPopup } from "@game/ui/popups/bases/StationPopup";
import {
  makeStationAddonConductorLoungePopupService,
  makeStationAddonRailYardPopupService,
  makeStationClickWithMyTrainService,
  makeStationDashboardPopupService,
  makeStationDispatchDeparturePopup,
  makeStationDispatchDestinationPopup,
  makeStationEditTrainCompositionPopupService,
  makeStationEditTrainDestinationPopupService,
  makeStationEditTrainLoadoutPopupService,
  makeStationHoverPopupService,
  makeStationNextStopPopupService,
  makeUnrelatedStationInfoPopupService,
} from "@game/ui/popups/popup-services";
import { StationVisual } from "@game/world/visuals/StationVisual";
import { IPoint } from "@sdk/core/common.types";
import { destroySafely } from "@sdk/pixi/helpers/destroySafely";
import { clamp, lerp, signFrom, unlerp } from "@sdk/utils/math";
import { getWorldScaleX } from "@sdk/utils/pixi/getWorldScaleX";

/**
 * This class is the main class responsible for creating and managing popups.
 *
 * It:
 * - Stores service references to each popup type.
 *   These manage construction and destruction their respective popups.
 *
 * - Manages the position and scale of the popups currently on screen, regardless of type.
 *
 */
export class PopupInstancesManager {
  public readonly map = new Map<StationPopup, [StationVisual, { x: number; y: number }]>();
  private readonly context = GameSingletons.getGameContext();
  public readonly parent = this.context.stageContainers._worldPopups;

  public readonly hover = makeStationHoverPopupService();
  public readonly clickUnrelated = makeUnrelatedStationInfoPopupService();
  public readonly clickWithMyTrain = makeStationClickWithMyTrainService();
  public readonly nextStop = makeStationNextStopPopupService();
  public readonly dispatchDeparture = makeStationDispatchDeparturePopup();
  public readonly dispatchDestination = makeStationDispatchDestinationPopup();
  public readonly editTrainComposition = makeStationEditTrainCompositionPopupService();
  public readonly editTrainDestination = makeStationEditTrainDestinationPopupService();
  public readonly editTrainLoadout = makeStationEditTrainLoadoutPopupService();
  public readonly myStationDashboard = makeStationDashboardPopupService();
  public readonly addonRailYard = makeStationAddonRailYardPopupService();
  public readonly addonConductorLounge = makeStationAddonConductorLoungePopupService();

  private readonly services = [
    this.hover,
    this.clickUnrelated,
    this.clickWithMyTrain,
    this.nextStop,
    this.dispatchDeparture,
    this.dispatchDestination,
    this.editTrainComposition,
    this.editTrainDestination,
    this.editTrainLoadout,
    this.myStationDashboard,
    this.addonRailYard,
    this.addonConductorLounge,
  ];

  public __autoExpandPopups__ = false;

  public constructor() {
    const onEnterFrame = this.onEnterFrame.bind(this);
    this.context.stage.enchantments
      .waitUntil(() => this.context.world)
      .then(world => world.onEnterFrame.add(onEnterFrame));
  }

  private onEnterFrame() {
    const screenArea = {
      width: this.context.viewSize.width,
      height: this.context.viewSize.height * lerp(1.0, 0.6, this.context.main.cards.drawer.expansion.progress),
    };

    function getCenterBetweenAllStationVisuals(map: PopupInstancesManager["map"]) {
      const points: IPoint[] = [];
      for (const [, [stationVisual]] of map) {
        const { x, y } = stationVisual.parent.toGlobal(stationVisual);
        points.push({ x, y });
      }
      return {
        x: points.reduce((a, b) => a + b.x, 0) / points.length,
        y: points.reduce((a, b) => a + b.y, 0) / points.length,
      };
    }

    const screenCenter = {
      x: screenArea.width / 2,
      y: screenArea.height / 2,
    };
    const center = this.map.size <= 1 ? screenCenter : getCenterBetweenAllStationVisuals(this.map);

    for (const [popup, [stationVisual, offset]] of this.map) {
      const desiredDistanceToStation = stationVisual.building.width;

      const stationPosition = stationVisual.parent.toGlobal(stationVisual);
      const stationGlobalScale = getWorldScaleX(stationVisual) / StationPopup.SCALE;

      const normalized = {
        x: clamp(
          stationPosition.x < center.x
            ? unlerp(0, center.x, stationPosition.x) - 1
            : unlerp(center.x, screenArea.width, stationPosition.x),
          -1,
          1
        ),
        y: clamp(
          stationPosition.y < center.y
            ? unlerp(0, center.y, stationPosition.y) - 1
            : unlerp(center.y, screenArea.height, stationPosition.y),
          -1,
          1
        ),
      };

      const absolute = {
        x: signFrom(normalized.x),
        y: signFrom(normalized.y),
      };

      const [targetOffsetFactor, targetAnchorDirection] = popup.placementFunc({
        context: this.context,
        absolute,
        normalized,
      });
      const DAMP = 0.5;

      popup.anchor.set(
        lerp(popup.anchor.x, 0.5 * (1.0 - targetAnchorDirection.x), DAMP),
        lerp(popup.anchor.y, 0.5 * (1.0 - targetAnchorDirection.y), DAMP)
      );

      offset.x = lerp(offset.x, targetOffsetFactor.x * stationGlobalScale * desiredDistanceToStation, DAMP);
      offset.y = lerp(offset.y, targetOffsetFactor.y * stationGlobalScale * desiredDistanceToStation, DAMP);

      popup.position.set(stationPosition.x + offset.x, stationPosition.y + offset.y);
      popup.interactiveChildren = !this.context.viewport.moving;

      const { x, y, anchor, width, height } = popup;
      popup.x = clamp(x, anchor.x * width, screenArea.width - (1 - anchor.x) * width);
      popup.y = clamp(y, anchor.y * height, screenArea.height - (1 - anchor.y) * height);
    }
  }

  public async add(popup: StationPopup, stationVisual: StationVisual) {
    this.map.set(popup, [stationVisual, { x: 0, y: 0 }]);
    this.parent.addChild(popup);
    this.parent.sortableChildren = true;
    await popup.show();
  }

  public async remove(popup: StationPopup) {
    if (!this.map.has(popup)) {
      console.warn(`Tried to remove a popup that wasn't registered: ${popup}`);
    }

    this.map.delete(popup);

    await popup.hide();

    destroySafely(popup);
  }

  public clear() {
    for (const service of this.services) {
      service.clear();
    }

    for (const [popup] of this.map) {
      this.remove(popup);
    }

    this.__autoExpandPopups__ = false;
  }

  hasPopupsAttached(stationVisual: StationVisual) {
    for (const [ss] of this.map.values()) {
      if (ss === stationVisual) {
        return true;
      }
    }
    return false;
  }
}
