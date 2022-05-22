import type * as WAX from "@sdk-integration/contracts";

import { CardType } from "@game/constants/CardType";
import { CardEntity } from "@game/data/entities/CardEntity";
import { TrainEntity } from "@game/data/entities/TrainEntity";
import { removeFalsies } from "@sdk/helpers/arrays";
import type { CardsDrawerGroupData } from "./CardDrawerGroupData";
import type { CardsDrawerManager } from "./CardsDrawerManager";

import { GameSingletons } from "@game/app/GameSingletons";
import { __urlParams__ } from "@game/app/__urlParams__";
import { CardsDrawerFilterOptionsPanel } from "./CardsDrawerFilterOptionsPanel";

const __AVOID_DRAWER_ANIMATION = !!__urlParams__.avoidDrawerAnimation;

function setTrainCard(train: TrainEntity, card: CardEntity): void {
  if (CardEntity.isTypeLocomotive(card)) {
    train.locomotive = card;
  } else if (CardEntity.isTypeConductor(card)) {
    train.conductor = card;
  } else {
    throw new Error("Cannot equip train with card of type " + card.type);
  }
}

export function createCardsDrawerGroupsData(this: CardsDrawerManager): CardsDrawerGroupData[] | null {
  const { changes, state } = this;
  const { userData, input } = GameSingletons.getGameContext();

  if (state === null) {
    return null;
  }

  const setCardDrawerState = this.setCardDrawerState.bind(this);
  const refreshCardDrawerState = this.refreshCardDrawerState.bind(this);
  const onConfirmInput = (cb: () => unknown) => {
    const stopListeningToInput = input.on({ confirm: cb });
    this.onceStateChangeCallbacks.push(stopListeningToInput);
  };

  const getTrainPair = () => {
    if (!("targetTrain" in state)) {
      throw new Error("Cannot get train pair without targetTrain in state");
    }

    const { targetTrain } = state;
    const { unsavedTrain } = this.changes;

    if (unsavedTrain === null) {
      throw new Error("No unsaved train object");
    }

    return {
      targetTrain, // targetTrain is the train that changes will eventually be applied to
      unsavedTrain, // unsavedTrain is the train that is being edited
    };
  };

  /**
   * The curlies inside the switch are used to block the scope for each case.
   * That is to say, it prevents 'const', 'let' and function declarations from
   * leaking into outside that case's scope.
   */
  switch (state.type) {
    //// Main wallet view — presents a list of all owned cards
    case "inventory": {
      const allCards = [...userData.iterateAllCards()];

      let filterSelections: CardsDrawerFilterOptionsPanel["currentSelections"];

      return [
        {
          noHitAreaQuads: true,
          createAdditionalDisplayObject: () => {
            const pane = new CardsDrawerFilterOptionsPanel(() => this.events.dispatch("refreshGroups"));
            pane.pivot.x = pane.width / 2;
            pane.pivot.y = pane.height;
            pane.zIndex = Number.MAX_SAFE_INTEGER;
            filterSelections = pane.currentSelections;
            return pane;
          },
        },
        {
          title: "My wallet",
          cards: allCards,
          filter: card => {
            if (filterSelections === null) return true;
            for (const filter of Object.values(filterSelections)) {
              if (!filter.func(card)) return false;
            }
            return true;
          },
          markEquippedCards: true,
        },
      ];
    }

    //// Main Edit Train section -- see current Conductor, Locomotive and Rail Car(s)
    case "edit-train-composition-overview": {
      const { targetTrain, unsavedTrain } = getTrainPair();

      onConfirmInput(this.applyUnsavedTrainChanges.bind(this));

      return [
        {
          title: "Conductor",
          cards: unsavedTrain.conductors,
          onClick: () =>
            setCardDrawerState({
              targetTrain,
              type: "edit-train-composition-change-conductor",
            }),
          shouldHighlightCard: (card: CardEntity) => !targetTrain.hasEquippedCard(card),
          shouldShowPlusButton: true,
        },
        {
          title: "Locomotive",
          cards: unsavedTrain.locomotives,
          onClick: () =>
            setCardDrawerState({
              targetTrain,
              type: "edit-train-composition-change-locomotive",
            }),
          shouldHighlightCard: (card: CardEntity) => !targetTrain.hasEquippedCard(card),
          shouldShowPlusButton: true,
        },
        {
          title: "Rail Cars",
          cards: unsavedTrain.railCars,
          onClick: () =>
            setCardDrawerState({
              targetTrain,
              type: "edit-train-composition-change-railcars",
            }),
          shouldHighlightCard: (card: CardEntity) => !targetTrain.hasEquippedCard(card),
          shouldShowPlusButton: true,
        },
      ];
    }

    case "edit-train-composition-change-conductor": {
      const { targetTrain, unsavedTrain } = getTrainPair();
      const hypotheticalTrain = (changes.hypotheticalTrain = TrainEntity.clone(unsavedTrain));

      const equippedCardOfSelectedType = hypotheticalTrain.conductor;
      const equippedCards = removeFalsies([equippedCardOfSelectedType]);
      const unequippedCards = this.getUnequippedCards(CardType.Conductor, hypotheticalTrain || unsavedTrain);

      onConfirmInput(async () => {
        setCardDrawerState({
          targetTrain,
          type: "edit-train-composition-overview",
        });
      });

      return [
        {
          title: `Equipped Conductor`,
          cards: equippedCards,
          // hint: "Go back",
          shouldHighlightCard: (card: CardEntity) => !targetTrain.hasEquippedCard(card),
        },
        {
          title: `Unequipped Conductors`,
          cards: unequippedCards,
          widthWeight: 1.67,
          hint: "Click to equip",
          onClick: card => {
            if (card) {
              setTrainCard(unsavedTrain, card);
              refreshCardDrawerState(!__AVOID_DRAWER_ANIMATION);
            }
          },
          onFocusedCardOrHoverStateChange: (card, hover) => {
            if (card) {
              setTrainCard(hypotheticalTrain, card);
            }
            this.events.dispatch("hypotheticalTrainChange", hover ? hypotheticalTrain : null);
          },
        },
      ];
    }

    case "edit-train-composition-change-locomotive": {
      const { targetTrain, unsavedTrain } = getTrainPair();
      const hypotheticalTrain = (changes.hypotheticalTrain = TrainEntity.clone(unsavedTrain));

      const equippedCardOfSelectedType = hypotheticalTrain.locomotive;
      const equippedCards = removeFalsies([equippedCardOfSelectedType]);
      const unequippedCards = this.getUnequippedCards(CardType.Locomotive, hypotheticalTrain || unsavedTrain);

      onConfirmInput(async () => {
        setCardDrawerState({
          targetTrain,
          type: "edit-train-composition-overview",
        });
      });

      return [
        {
          title: `Equipped Loco`,
          cards: equippedCards,
          // hint: "Go back",
          shouldHighlightCard: (card: CardEntity) => !targetTrain.hasEquippedCard(card),
        },
        {
          title: `Unequipped Locos`,
          cards: unequippedCards,
          widthWeight: 1.67,
          hint: "Click to equip",
          onClick: card => {
            if (card) {
              setTrainCard(unsavedTrain, card);
              refreshCardDrawerState(!__AVOID_DRAWER_ANIMATION);
            }
          },
          onFocusedCardOrHoverStateChange: (card, hover) => {
            if (card) {
              setTrainCard(hypotheticalTrain, card);
            }
            this.events.dispatch("hypotheticalTrainChange", hover ? hypotheticalTrain : null);
          },
        },
      ];
    }

    case "edit-train-composition-change-railcars": {
      const { targetTrain, unsavedTrain } = getTrainPair();
      const hypotheticalTrain = (changes.hypotheticalTrain = TrainEntity.clone(unsavedTrain));

      const equippedCards = removeFalsies(hypotheticalTrain.railCars);
      const unequippedCards = this.getUnequippedCards(CardType.Wagon, hypotheticalTrain || unsavedTrain);

      onConfirmInput(async () => {
        setCardDrawerState({
          targetTrain,
          type: "edit-train-composition-overview",
        });
      });

      const unequipRailCarCard = (card: CardEntity<WAX.CardAssetData_Wagon>) => {
        unsavedTrain.removeRailCar(card);
        refreshCardDrawerState(false);
      };

      const equipRailCarCard = (card: CardEntity<WAX.CardAssetData_Wagon>) => {
        unsavedTrain.addRailCar(card);
        refreshCardDrawerState(false);
      };

      return [
        {
          title: `Equipped Rail Cars`,
          cards: equippedCards,
          // hint: "Go back",
          onClick: card => card && unequipRailCarCard(card as any),
          shouldHighlightCard: (card: CardEntity) => !targetTrain.hasEquippedCard(card),
        },
        {
          title: `Unequipped Rail Cars`,
          cards: unequippedCards,
          widthWeight: 1.67,
          hint: "Click to equip",
          onClick: card => card && equipRailCarCard(card as any),
          onFocusedCardOrHoverStateChange: (card, hover) => {
            // if (card) {
            //   equipTrainCard(hypotheticalTrain, card);
            // }
            this.events.dispatch("hypotheticalTrainChange", hover ? hypotheticalTrain : null);
          },
        },
      ];
    }

    //// Select rail car to edit its commodities
    case "edit-train-loadout-railcar-overview": {
      const { targetTrain } = state;
      const { unsavedTrain } = this.changes;

      if (unsavedTrain === null) {
        throw new Error("No unsaved train object");
      }

      const equippedCards = removeFalsies(unsavedTrain.railCars);

      onConfirmInput(this.applyUnsavedTrainChanges.bind(this));

      const selectRailCar = (targetRailCar: CardEntity<WAX.CardAssetData_Wagon>) => {
        this.setCardDrawerState({
          type: "edit-train-loadout-railcar-change-commodities",
          targetTrain: targetTrain,
          targetRailCar: targetRailCar,
          focusIndexEquipped: null,
        });
      };

      return [
        {
          title: "Equipped Rail Cars",
          cards: equippedCards,
          onClick: targetRailCar => selectRailCar(targetRailCar as any),
          shouldHighlightCard: (card: CardEntity) => !targetTrain.hasEquippedCard(card),
        },
      ];
    }

    case "edit-train-loadout-railcar-change-commodities": {
      const { targetTrain, targetRailCar, focusIndexEquipped } = state;
      const { unsavedTrain } = this.changes;

      state.focusIndexEquipped = null;

      if (unsavedTrain === null) {
        throw new Error("No unsaved train object");
      }

      if (targetRailCar === null) {
        throw new Error("No target rail car");
      }

      onConfirmInput(() =>
        this.setCardDrawerState({
          type: "edit-train-loadout-railcar-overview",
          targetTrain: targetTrain,
        })
      );

      //// Switch or remove selected equipped commodity

      // const hypotheticalTrain = (changes.hypotheticalTrain = TrainEntity.clone(unsavedTrain));
      // const hypotheticalTrain = null;

      const isProperLoadableType = (card: CardEntity<WAX.CardAssetData_Loadable>) => {
        if (CardEntity.isTypePassengerWagon(targetRailCar)) {
          return CardEntity.isTypePassengerLoadable(card);
        }
        if (CardEntity.isTypeCommodityWagon(targetRailCar)) {
          return (
            CardEntity.isTypeCommodityLoadable(card) &&
            (card.stats.type === targetRailCar.stats.commodity_type ||
              card.stats.type === targetRailCar.stats.commodity_type2)
          );
        }
        throw new Error("Selected rail car is neither passenger nor commodity wagon type");
      };

      const equippedCards = [...unsavedTrain.iterateLoadedCommodities(targetRailCar)];
      const unequippedCards = this.getUnequippedCards(CardType.Loadable, unsavedTrain);
      const unequippedCardsThatFit = unequippedCards.filter(isProperLoadableType);

      const unequipCommodityCard = (commodity: CardEntity<WAX.CardAssetData_Loadable>) => {
        unsavedTrain.unloadCommodity(targetRailCar, commodity);
        refreshCardDrawerState(false);

        const equippedCardsGroup = this.drawer.groups[0];
        if (equippedCardsGroup.hitQuad) {
          equippedCardsGroup.hoverFactorAnimated.set(1);
          equippedCardsGroup.hitQuad.behavior.isHover.value = true;
        }
      };

      const equipCommodityCard = (commodity: CardEntity<WAX.CardAssetData_Loadable>) => {
        //// Before the refresh
        {
          const equippedCardsGroup = this.drawer.groups[0];
          const newCardIndex = equippedCardsGroup.focus.cardIndex + 1;
          unsavedTrain.loadCommodity(targetRailCar, commodity, newCardIndex);
          refreshCardDrawerState(false);
        }

        //// After the refresh
        {
          const equippedCardsGroup = this.drawer.groups[0];
          const newCardIndex = equippedCardsGroup.data.cards?.indexOf(commodity) ?? -1;
          if (newCardIndex > -1) {
            equippedCardsGroup.focus.set(newCardIndex);
          }

          const unequippedCardsGroup = this.drawer.groups[1];
          if (unequippedCardsGroup.hitQuad) {
            unequippedCardsGroup.hoverFactorAnimated.set(1);
            unequippedCardsGroup.hitQuad.behavior.isHover.value = true;
          }
        }
      };

      const equippedCardsGroup = this.drawer.groups[0];
      const equippedCardsFocusIndex = equippedCardsGroup.focus.cardIndex;
      const unequippedCardsGroup = this.drawer.groups[1];
      const unequippedCardsFocusIndex = unequippedCardsGroup?.focus.cardIndex ?? 0;

      const isPassengerTypeWagon = CardEntity.isTypePassengerLoadable(targetRailCar);

      return [
        {
          title: isPassengerTypeWagon ? `Loaded Passengers` : `Loaded Commodities`,
          cards: equippedCards,
          hint: equippedCards.length == 0 ? undefined : "Click to unequip",
          onClick: card => card && unequipCommodityCard(card as CardEntity<WAX.CardAssetData_Loadable>),
          shouldHighlightCard: (card: CardEntity) => !targetTrain.hasEquippedCard(card),
          initialFocusIndex: focusIndexEquipped ?? equippedCardsFocusIndex ?? ~~(0.5 * equippedCards.length),
        },
        {
          title: isPassengerTypeWagon ? `Unloaded Passengers` : `Unloaded Commodities`,
          cards: unequippedCardsThatFit,
          widthWeight: 1.27,
          hint: unequippedCardsThatFit.length == 0 ? undefined : "Click to equip",
          onClick: card => card && equipCommodityCard(card as CardEntity<WAX.CardAssetData_Loadable>),
          initialFocusIndex: unequippedCardsFocusIndex ?? ~~(0.5 * unequippedCards.length),
        },
      ];
    }
  }
}
