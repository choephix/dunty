import type * as WAX from "@sdk-integration/contracts";
import type { GameContext } from "@game/app/app";

import { GameViewMode } from "@game/app/main";
import { CardType } from "@game/constants/CardType";
import { CardEntity } from "@game/data/entities/CardEntity";
import { TrainEntity } from "@game/data/entities/TrainEntity";
import { EventBus } from "@sdk/core/EventBus";
import { removeFalsies } from "@sdk/helpers/arrays";
import { CallbackList } from "@sdk/utils/callbacks/CallbackList";
import type { ReadonlyDeep } from "type-fest";
import type { CardsDrawerGroupData } from "./CardDrawerGroupData";
import type { CardsDrawer } from "./CardsDrawer";

import { __urlParams__ } from "@game/app/__urlParams__";
import { createCardsDrawerGroupsData } from "./CardsDrawerGroupFactory";
import { formatToMaxDecimals } from "@sdk-ui/utils/formatToMaxDecimals";
import { ReadonlyObjectDeep } from "type-fest/source/readonly-deep";
import { GameSingletons } from "@game/app/GameSingletons";

export type CardsDrawerState =
  | null // closed
  | {
      type: "edit-train-composition-overview";
      targetTrain: ReadonlyDeep<TrainEntity>;
    }
  | {
      type: "edit-train-composition-change-conductor";
      targetTrain: ReadonlyDeep<TrainEntity>;
    }
  | {
      type: "edit-train-composition-change-locomotive";
      targetTrain: ReadonlyDeep<TrainEntity>;
    }
  | {
      type: "edit-train-composition-change-railcars";
      targetTrain: ReadonlyDeep<TrainEntity>;
    }
  | {
      type: "edit-train-loadout-railcar-overview";
      targetTrain: ReadonlyDeep<TrainEntity>;
    }
  | {
      type: "edit-train-loadout-railcar-change-commodities";
      targetTrain: ReadonlyDeep<TrainEntity>;
      targetRailCar: CardEntity<WAX.CardAssetData_Wagon>;
      focusIndexEquipped: number | null;
    }
  | { type: "inventory" };

export class CardsDrawerManager {
  private readonly context = GameSingletons.getGameContext();

  public state = null as null | CardsDrawerState;

  public readonly changes = {
    unsavedTrain: null as TrainEntity | null,
    hypotheticalTrain: null as TrainEntity | null,
    hasUnsavedDiff: false,
  };

  readonly errors: string[] = [];

  /**
   * Use this to enqueue disposal functions for what will now the old-news state.
   */
  protected readonly onceStateChangeCallbacks = new CallbackList();

  constructor(public readonly drawer: CardsDrawer) {}

  readonly events = new EventBus<{
    changeState: (state: CardsDrawerState) => void;
    hypotheticalTrainChange: (train: TrainEntity | null) => void;
    refreshGroups: () => void;
  }>();

  addError(msg: string) {
    this.errors.unshift(msg);
  }

  initialize() {
    const { main, stage } = this.context;

    //// On VIEW MODE change ////
    stage.enchantments.watch(
      () => main.viewMode,
      async (nextViewMode, prevViewMode) => {
        //// CLEAN UP AFTER PREVIOUS STATE ////

        switch (prevViewMode) {
          case GameViewMode.LOADING_DOCK:
          case GameViewMode.EDIT_TRAIN: {
            if (nextViewMode !== GameViewMode.EDIT_TRAIN && nextViewMode !== GameViewMode.LOADING_DOCK) {
              this.setCardDrawerState(null);
              this.changes.unsavedTrain = null;
              this.changes.hasUnsavedDiff = false;
            }
          }
        }

        //// EDIT TRAIN ////

        switch (nextViewMode) {
          case GameViewMode.EDIT_TRAIN: {
            const train = main.selection.selectedTrain;
            if (!train) {
              throw new Error("No train selected");
            }

            if (this.changes.unsavedTrain == null) {
              this.changes.unsavedTrain = TrainEntity.clone(train);
              this.changes.hasUnsavedDiff = false;
            }

            this.setCardDrawerState({
              type: "edit-train-composition-overview",
              targetTrain: train,
            });

            break;
          }
          case GameViewMode.LOADING_DOCK: {
            const train = main.selection.selectedTrain;
            if (!train) {
              throw new Error("No train selected");
            }

            if (this.changes.unsavedTrain == null) {
              this.changes.unsavedTrain = TrainEntity.clone(train);
              this.changes.hasUnsavedDiff = false;
            }

            this.setCardDrawerState({
              type: "edit-train-loadout-railcar-overview",
              targetTrain: train,
            });

            break;
          }
        }
      }
    );

    this.events.on({
      refreshGroups: () => this.drawer.refreshGroupsCards(),
    });
  }

  refreshCardDrawerState(animate = true) {
    this.setCardDrawerState(undefined, animate);
  }

  setCardDrawerState(state?: CardsDrawerState, animate = true) {
    if (state === undefined) {
      state = this.state;
    } else {
      this.state = state;
    }

    //// Clean up ////

    this.onceStateChangeCallbacks.callAllAndClear();

    this.changes.hypotheticalTrain = null;
    this.events.dispatch("hypotheticalTrainChange", null);

    //// Update ////

    const { changes } = this;

    const groups = createCardsDrawerGroupsData.call(this);
    if (animate) {
      this.drawer.setGroupsDataAnimatedly(groups);
    } else {
      this.drawer.setGroupsData(groups);
      for (const [, cs] of this.drawer.cardSpritesPool) {
        cs.visible = false;
        requestAnimationFrame(() => (cs.visible = true));
      }
    }

    if (state && "targetTrain" in state) {
      changes.hasUnsavedDiff = TrainEntity.compare(changes.unsavedTrain, state.targetTrain);
    } else {
      changes.hasUnsavedDiff = false;
    }

    this.events.dispatch("changeState", this.state);
  }

  getCardDrawerState() {
    return this.state;
  }

  getCurrentTargetTrain() {
    const { state } = this;
    if (state === null) {
      return null;
    }
    if (state.type === "inventory") {
      return null;
    }
    return state.targetTrain;
  }

  getUnequippedCards(
    cardType: CardType.Loadable,
    replacementTrain: TrainEntity
  ): CardEntity<WAX.CardAssetData_Loadable>[];
  getUnequippedCards(
    cardType: CardType.Conductor,
    replacementTrain: TrainEntity
  ): CardEntity<WAX.CardAssetData_Conductor>[];
  getUnequippedCards(
    cardType: CardType.Locomotive,
    replacementTrain: TrainEntity
  ): CardEntity<WAX.CardAssetData_Locomotive>[];
  getUnequippedCards(cardType: CardType.Wagon, replacementTrain: TrainEntity): CardEntity<WAX.CardAssetData_Wagon>[];
  getUnequippedCards(cardType: CardType, replacementTrain: TrainEntity): CardEntity[];
  getUnequippedCards(cardType: CardType, replacementTrain: TrainEntity) {
    const { userData } = this.context;

    //// We must make a list of all cards that are not equipped
    //// which is why we're copying the list of the user's trains here
    //// making a note of the index of the real train we'll be modifying
    //// then swapping it with the hypothetical train we're working with
    //// and then filtering out the cards equipped to the
    //// hypo train + any unselected trains.
    const userTrains = [...userData.trains.values()];
    const indexOfSelectedTrain = userTrains.findIndex(train => train.name === replacementTrain.name);
    if (indexOfSelectedTrain === -1) {
      throw new Error("Selected train not found in user trains");
    }
    userTrains[indexOfSelectedTrain] = replacementTrain;

    const allCardsFilteredByType = [...userData.iterateAllCards(cardType)];

    const allCardsNotEqiuppedByAnyTrain = allCardsFilteredByType.filter(card =>
      userTrains.every(train => !train.hasEquippedCard(card))
    );

    return allCardsNotEqiuppedByAnyTrain;
  }

  async applyUnsavedTrainChanges() {
    const { main, spinner, contracts, userDataCtrl, modals } = this.context;

    const target = this.getCurrentTargetTrain();
    if (target == null) {
      throw new Error("No target train");
    }

    const changedTrain = this.changes.unsavedTrain;
    if (changedTrain == null) {
      throw new Error("Hypothetical new train composition not found");
    }

    if (!changedTrain.conductor) {
      await modals.warning("You must select a conductor for a valid train composition.");
      throw new Error("No conductor");
    }

    if (!changedTrain.locomotive) {
      await modals.warning("You must select a locomotive for a valid train composition.");
      throw new Error("No locomotive");
    }

    const changesMade = TrainEntity.compare(changedTrain, target);
    if (changesMade) {
      //Loop through all rail cars and check for errors

      for (const railcarIndex in changedTrain.railCars) {
        const railcarNumber = parseInt(railcarIndex) + 1;
        const railStats = changedTrain.getRailCarLoadStats(+railcarIndex);

        if (railStats.wagonType == "railcar") {
          if (railStats.capacityUtilized > railStats.capacityMax!) {
            return await modals.warning(
              `Railcar ${railcarNumber} can haul ${railStats.capacityMax!} volume but your chosen commodities' volume is ${
                railStats.capacityUtilized
              }`
            );
          }
        }

        if (railStats.wagonType == "passengercar") {
          if (railStats.seatsUtilized > railStats.seatsMax) {
            return await modals.warning(
              `Railcar ${railcarNumber} has ${railStats.seatsMax} seats but your have loaded ${railStats.seatsUtilized} passengers.`
            );
          }
        }
      }

      //Check conductor, carry weight, rail car number for errors

      if (changedTrain.locomotive.data.conductor_threshold > changedTrain.conductor.data.conductor_level) {
        return await modals.warning(
          `Conductor is Level ${changedTrain.conductor.data.conductor_level} but your chosen Locomotive requires ${
            changedTrain.locomotive!.data.conductor_threshold
          }`
        );
      }

      if (changedTrain.currentTotalWeight > changedTrain.maxWeight) {
        return await modals.warning(
          `Train can haul ${changedTrain.maxWeight} but your chosen commodities weigh ${changedTrain.currentTotalWeight}`
        );
      }

      const maxRailCars = target.extraSlots.rc + 1;
      if (changedTrain.railCars.length > maxRailCars) {
        return await modals.warning(
          `Train can haul ${maxRailCars} rail cars but you have attached ${changedTrain.railCars.length}`
        );
      }

      await spinner.showDuring(
        contracts.updateRailroaderTrainComposition(
          changedTrain.name,
          changedTrain.waxData.locomotives ?? [],
          changedTrain.waxData.conductors ?? [],
          changedTrain.waxData.load ?? []
        )
      );

      const originalTrain = this.context.main.selection.selectedTrain;
      if (originalTrain) TrainEntity.copyDataFromTo(changedTrain, originalTrain);

      await userDataCtrl.updateAll();
    }

    main.setViewMode(GameViewMode.NORMAL);
  }
}
