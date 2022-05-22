import { FontIcon } from "@game/constants/FontIcon";
import { ThemeColors } from "@game/constants/ThemeColors";
import { TrainEntity } from "@game/data/entities/TrainEntity";
import { Sprite } from "@pixi/sprite";
import { EventBus, EventBusKey } from "@sdk/core/EventBus";
import { StationPopup } from "./bases/StationPopup";
import { StationPopupBackgroundType } from "./components/StationPopupBackgroundType";
import { PopupPlacementFunction } from "./util/PopupPlacementFunction";

type StationEditTrainCompositionPopupEvents = EventBus<
  EventBusKey<StationPopup["events"]> & {
    onClick_LoadingDock: () => void;
  }
>;

export class StationEditTrainCompositionPopup extends StationPopup {
  public readonly placementFunc: PopupPlacementFunction = PopupPlacementFunction.sidewaysSmart;

  public declare readonly events: StationEditTrainCompositionPopupEvents;

  async fillContent_Default() {
    const { station } = this;

    if (!station) {
      throw new Error("StationDashboardPopup: station is not set");
    }

    const { assets, main, input } = this.context;

    const getCurrentTrain = () => this.context.main.cards.changes.unsavedTrain;
    const getHypotheticalTrain = () => this.context.main.cards.changes.hypotheticalTrain;

    const train = getCurrentTrain();
    const hasTrains = !!train;

    if (!hasTrains) {
      return console.error(`No train data found on station ${station.name}.`);
    }

    this.setPadBackground(StationPopupBackgroundType.TRAIN_STATS);

    if (this.context.main.selection.selectedDestination) {
      const floatyText = `Departure`;
      const floaty = this.componentFactory.createFloatyTitle(floatyText, this.width);
      this.addChild(floaty);
    }

    {
      const titleText = station.name;
      const title = this.componentFactory.createTitle(titleText, this.width);
      this.addChild(title);
    }

    {
      const infoText = `${FontIcon.LocoLegacy}  ${train.name}`;
      const info = this.componentFactory.createInfoRibbon(infoText, "ui-popups/bg-lvl2-info.png");
      info.position.set(this.width * 0.5, 165);
      this.addChild(info);
    }

    //// STATS ////

    {
      const columnHeadersPadTexture = assets.getTexture("ui-popups/bg-lvl3-info.png");
      const columnHeadersPad = new Sprite(columnHeadersPadTexture);
      columnHeadersPad.position.set(0.5 * this.width, 189);
      columnHeadersPad.anchor.set(0.5, 0.0);
      columnHeadersPad.scale.set(0.71);
      this.addChild(columnHeadersPad);

      const COLUMNS_Y = 195;
      const COLUMNS_MARGIN_X = 61;

      //// COLORING ////
      const { NORMAL_COLOR, DANGER_COLOR, HIGHLIGHT_COLOR } = ThemeColors;
      const defaultNumericCompareFunction = (a: number | null, b: number | null) => (a && b && b - a) || 0;
      const reverseNumericCompareFunction = (a: number | null, b: number | null) => (a && b && b - a) || 0;

      const createStatsColumn = this.componentFactory.createStatsColumn_Static;
      type Column = ReturnType<typeof createStatsColumn>;
      type StatsColumnPropertiesStat =
        | {
            label: string;
            getter: (train: TrainEntity) => null | number;
            compare?: null | ((a: number | null, b: number | null) => number);
            type: "numeric";
          }
        | {
            label: string;
            getter: (train: TrainEntity) => null | string[];
            type: "icons";
            iconsCategory: "perk" | "commodity";
            maxIconsCount?: number;
          };
      type StatsColumnProperties = {
        headerIcon: string;
        stats: StatsColumnPropertiesStat[];
      };

      const data_StatColums: StatsColumnProperties[] = [
        {
          headerIcon: "conductor",
          stats: [
            {
              label: "Gear",
              getter: (train: TrainEntity) => train.conductorStats?.gearThreshold ?? null,
              type: "numeric",
            },
            {
              label: "Perk(s)",
              getter: (train: TrainEntity) => train.conductorStats?.perkTypes ?? null,
              iconsCategory: "perk",
              maxIconsCount: 2,
              type: "icons",
            },
            {
              label: "Boost",
              getter: (train: TrainEntity) => train.conductorStats?.perkBoostsSum ?? null,
              type: "numeric",
            },
          ],
        },
        {
          headerIcon: "loco",
          stats: [
            {
              label: "Gear",
              getter: (train: TrainEntity) => train.locomotiveStats?.gearLevel ?? null,
              compare: null,
              type: "numeric",
            },
            {
              label: "Distance",
              getter: (train: TrainEntity) => train.locomotiveStats?.distance ?? null,
              type: "numeric",
            },
            {
              label: "Haul",
              getter: (train: TrainEntity) => train.locomotiveStats?.haulingPower ?? null,
              type: "numeric",
            },
            {
              label: "Speed",
              getter: (train: TrainEntity) => train.locomotiveStats?.speed ?? null,
              type: "numeric",
            },
            {
              label: "Luck",
              getter: (train: TrainEntity) => train.locomotiveStats?.luckBoost ?? null,
              type: "numeric",
            },
          ],
        },
        {
          headerIcon: "rc",
          stats: [
            {
              label: "Seats",
              getter: (train: TrainEntity) => train.rcCombinedStats?.seats ?? null,
              type: "numeric",
            },
            {
              label: "Haul Capacity",
              getter: (train: TrainEntity) => train.rcCombinedStats?.haulCapacity ?? null,
              type: "numeric",
            },
            {
              label: "Types",
              getter: (train: TrainEntity) => train.rcCombinedStats?.commodityTypes ?? null,
              iconsCategory: "commodity",
              maxIconsCount: 4,
              type: "icons",
            },
          ],
        },
      ];

      const createColumn = (x: number, y: number, data: StatsColumnProperties) => {
        const column = this.componentFactory.createStatsColumn_Static();
        column.position.set(x, y);
        this.addChild(column);
        return Object.assign(column, { data });
      };

      const columns = [
        createColumn(COLUMNS_MARGIN_X, COLUMNS_Y, data_StatColums[0]),
        createColumn(0.5 * this.width, COLUMNS_Y, data_StatColums[1]),
        createColumn(this.width - COLUMNS_MARGIN_X, COLUMNS_Y, data_StatColums[2]),
      ];

      const addHeaderIcon = (column: Column, iconName: string) => {
        column.appendIcon(`ui-icons/card-type/${iconName}.png`, NORMAL_COLOR);
        column.appendSpacing(10);
      };

      const refreshColumns = (baseTrain: TrainEntity | null, hypoTrain: TrainEntity | null) => {
        for (const column of columns) {
          column.clear();

          const { headerIcon, stats } = column.data;

          addHeaderIcon(column, headerIcon);
          column.appendSpacing(10);

          for (const stat of stats) {
            column.appendSmallLabel(stat.label);
            column.appendSpacing(10);

            switch (stat.type) {
              case "numeric": {
                const { compare = defaultNumericCompareFunction } = stat;
                const baseValue = baseTrain && stat.getter(baseTrain);
                const hypoValue = hypoTrain && stat.getter(hypoTrain);
                if (baseValue === null && hypoValue === null) {
                  column.appendPlaceholderNA();
                } else {
                  const value = (hypoValue ?? baseValue)!;
                  const diff = compare?.(baseValue, hypoValue) ?? 0;
                  const color = diff === 0 ? NORMAL_COLOR : diff > 0 ? HIGHLIGHT_COLOR : DANGER_COLOR;
                  column.appendBigHugeNumber(value, color);
                }
                break;
              }
              case "icons": {
                const baseValues = baseTrain && stat.getter(baseTrain);
                const hypoValues = hypoTrain && stat.getter(hypoTrain);
                if (baseValues === null && hypoValues === null) {
                  column.appendPlaceholderNA();
                } else {
                  const values = (hypoValues ?? baseValues)!;
                  const useEllipsis = stat.maxIconsCount && values.length > stat.maxIconsCount;
                  const iconsCount = useEllipsis ? stat.maxIconsCount! - 1 : values.length;

                  for (let i = 0; i < iconsCount; i++) {
                    const value = values[i];
                    const missingFromBase = baseValues && !baseValues.includes(value);
                    const color = missingFromBase ? HIGHLIGHT_COLOR : NORMAL_COLOR;
                    column.appendIcon(`ui-icons/${stat.iconsCategory}/${value}.png`, color);
                    column.appendSpacing(10);
                  }

                  if (useEllipsis) {
                    column.appendSmallLabel(`. . .`);
                    column.appendSpacing(10);
                    break;
                  }
                }
              }
            }
          }
        }
      };

      refreshColumns(this.context.main.cards.changes.unsavedTrain, null);

      const clearEventListener = main.cards.events.on({
        hypotheticalTrainChange: hypo => refreshColumns(this.context.main.cards.changes.unsavedTrain, hypo),
      });
      this.onDestroy(clearEventListener);
    }

    //// BUTTONS ////

    {
      const buttonText = `Loading dock`;
      const button = this.componentFactory.createBottomButton("fill", buttonText, 63);
      button.setEnabled(hasTrains && !train.getInvalidReason() && train.railCars.length > 0);
      button.onClick = () => this.events.dispatch("onClick_LoadingDock");
      this.onDestroy(() => button.removeAllListeners());
      this.addChild(button);
    }

    //// X Close Button
    this.componentFactory.addXCloseButton();

    await this.fadeChildrenIn();
  }
}
