export enum StationPopupBackgroundType {
  NEXT_STOP = 1,
  EDIT_TRAIN_DESTINATION = 2,
  IDLE_HOVER = 3,
  IDLE_CLICK_AND_DISPATCHES = 4,
  TRAIN_LOADOUT = 5,
  TRAIN_STATS = 6,
  UNRELATED_STATION_CLICK_TEMP = 7,
  UNRELATED_STATION_CLICK = 8,
  MY_STATION_DASHBOARD = 9,
}

export const StationPopupBackgroundMods = {
  [StationPopupBackgroundType.NEXT_STOP]: { topHeight: 297, bottomHeight: 80 },
  [StationPopupBackgroundType.EDIT_TRAIN_DESTINATION]: {
    topHeight: 300,
    bottomHeight: 131,
  },
  [StationPopupBackgroundType.IDLE_HOVER]: {
    topHeight: 360,
    bottomHeight: 131,
  },
  [StationPopupBackgroundType.IDLE_CLICK_AND_DISPATCHES]: {
    topHeight: 360,
    bottomHeight: 131,
  },
  [StationPopupBackgroundType.TRAIN_LOADOUT]: {
    topHeight: 360,
    bottomHeight: 200,
  },
  [StationPopupBackgroundType.TRAIN_STATS]: {
    topHeight: 360,
    bottomHeight: 131,
  },
  [StationPopupBackgroundType.UNRELATED_STATION_CLICK_TEMP]: {
    topHeight: 300,
    bottomHeight: 160,
  },
  [StationPopupBackgroundType.UNRELATED_STATION_CLICK]: {
    topHeight: 300,
    bottomHeight: 160,
  },
  [StationPopupBackgroundType.MY_STATION_DASHBOARD]: {
    topHeight: 40,
    bottomHeight: 40,
    leftWidth: 40,
    rightWidth: 40,
  },
};
