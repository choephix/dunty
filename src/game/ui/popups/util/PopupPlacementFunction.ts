import { GameContext } from "@game/app/app";
import { IPoint } from "@sdk/core/common.types";

/**
 * @returns [offset: IPoint, anchor: IPoint]
 */

export type PopupPlacementFunction = (info: {
  context: GameContext;
  absolute: IPoint;
  normalized: IPoint;
}) => [IPoint, IPoint];

export module PopupPlacementFunction {
  export const diamond: PopupPlacementFunction = ({ absolute, normalized }) => {
    const dir = Math.abs(normalized.x) > Math.abs(normalized.y) ? { x: absolute.x, y: 0 } : { x: 0, y: absolute.y };
    return [
      {
        x: dir.x,
        y: dir.y,
      },
      {
        x: dir.x || -normalized.x,
        y: dir.y || -normalized.y,
      },
    ];
  };

  export const sideways: PopupPlacementFunction = ({ normalized }) => {
    return [
      {
        x: normalized.x < 0 ? -1 : 1,
        y: 0,
      },
      {
        x: normalized.x < 0 ? -1 : 1,
        y: -normalized.y,
      },
    ];
  };

  export const sidewaysFlipped: PopupPlacementFunction = ({ normalized }) => {
    return [
      {
        x: normalized.x > 0 ? -1 : 1,
        y: 0,
      },
      {
        x: normalized.x > 0 ? -1 : 1,
        y: -normalized.y,
      },
    ];
  };

  export const sidewaysSmart: PopupPlacementFunction = props => {
    return props.context.main.popups.map.size > 1 ? sideways(props) : sidewaysFlipped(props);
  };

  export const topTooltip: PopupPlacementFunction = ({ normalized }) => {
    const THRESHOLD = -0.99;
    return [
      {
        x: 0,
        y: normalized.y > THRESHOLD ? -1 : 1,
      },
      {
        x: normalized.x,
        y: normalized.y > THRESHOLD ? -1 : 1,
      },
    ];
  };

  export const center: PopupPlacementFunction = ({ normalized }) => {
    const THRESHOLD = -0.99;
    return [
      {
        x: 0,
        y: normalized.y > THRESHOLD ? -1 : 1,
      },
      {
        x: normalized.x,
        y: normalized.y,
      },
    ];
  };
}
