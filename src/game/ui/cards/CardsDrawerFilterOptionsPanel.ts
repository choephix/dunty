import { GameSingletons } from "@game/app/GameSingletons";
import { createAnimatedButtonBehavior } from "@game/asorted/createAnimatedButtonBehavior";
import { ThemeColors } from "@game/constants/ThemeColors";
import { CardEntity } from "@game/data/entities/CardEntity";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { Rectangle } from "@pixi/math";
import { fitObjectInRectangle } from "@sdk-pixi/layout/fitObjectInRectangle";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { lerp } from "@sdk/utils/math";
import { animateTextSwap } from "../animation/animateTextSwap";

type FilterChoice = { label: string; func: (card: CardEntity) => boolean };

type FilterType = "status" | "type" | "rarity";

const filterOptions: Record<FilterType, FilterChoice[]> = {
  status: [
    { label: "Available", func: card => !card.assignedTrain },
    { label: "Equipped", func: card => !!card.assignedTrain },
    { label: "All", func: () => true },
  ],
  type: [
    { label: "All", func: () => true },
    { label: "Locos", func: card => card.schemaType === "locomotive" },
    { label: "Conductors", func: card => card.schemaType === "conductor" },
    { label: "Rail Cars", func: card => card.schemaType === "railcar" },
    { label: "P Cars", func: card => card.schemaType === "passengercar" },
    { label: "Comms", func: card => card.schemaType === "commodity" },
    { label: "Passengers", func: card => card.schemaType === "passenger" },
  ],
  rarity: [
    { label: "All", func: () => true },
    { label: "Common", func: card => card.rarityString === "common" },
    { label: "Uncommon", func: card => card.rarityString === "uncommon" },
    { label: "Rare", func: card => card.rarityString === "rare" },
    { label: "Epic", func: card => card.rarityString === "epic" },
    { label: "Legendary", func: card => card.rarityString === "legendary" },
    { label: "Mythic", func: card => card.rarityString === "mythic" },
  ],
};

export type CardFilterSelections = {
  status: FilterChoice;
  type: FilterChoice;
  rarity: FilterChoice;
};

export class CardsDrawerFilterOptionsPanel extends Container {
  private readonly context = GameSingletons.getGameContext();

  public readonly currentSelections: CardFilterSelections = {
    status: filterOptions.status[0],
    type: filterOptions.type[0],
    rarity: filterOptions.rarity[0],
  };

  constructor(public readonly onSelectionChange: (filterSelections: CardFilterSelections) => unknown) {
    super();

    //// Add background
    const bg = this.context.simpleFactory.createSprite("ui-cards-drawer/filter-box.png", { interactive: true });
    this.addChild(bg);

    //// Add status selection text
    const statusSelection = this.drawButton(filterOptions.status, "status");
    statusSelection.position.set(50, 85);
    this.addChild(statusSelection);

    //// Add type selection text
    const typeSelection = this.drawButton(filterOptions.type, "type");
    typeSelection.position.set(50, 185);
    this.addChild(typeSelection);

    //// Add rarity selection text
    const raritySelection = this.drawButton(filterOptions.rarity, "rarity");
    raritySelection.position.set(50, 285);
    this.addChild(raritySelection);

    const tweener = new TemporaryTweeener(this);
    tweener.from([statusSelection, typeSelection, raritySelection], { alpha: 0, stagger: 0.085, delay: 0.285 });
  }

  drawButton(selectionOptions: FilterChoice[], selectionType: "status" | "type" | "rarity"): Container {
    const color = ThemeColors.CARD_FILTER_BUTTON_OUTLINE.toInt();
    const WIDTH = 200;
    const HEIGHT = 50;
    const outlineArea = new Rectangle(0, 0, WIDTH, HEIGHT);

    const container = new Container();
    container.interactive = true;
    container.buttonMode = true;
    container.hitArea = outlineArea;

    //// add description text
    const descrString = selectionType.toUpperCase();
    const descr = this.context.simpleFactory.createText(descrString, { fontSize: 20 }, { y: -35 });
    descr.alpha = 0.4;
    container.addChild(descr);

    //// add highlight
    const highlight = new Graphics();
    highlight.beginFill(color);
    highlight.drawRect(0, 0, WIDTH, HEIGHT);
    highlight.alpha = 0;
    container.addChild(highlight);

    //// add outline
    const outline = new Graphics();
    outline.lineStyle(3, color);
    outline.drawRect(0, 0, WIDTH, HEIGHT);
    container.addChild(outline);

    //// add text
    const label = this.context.simpleFactory.createText("", { fontSize: 20, lineHeight: 20 });
    label.anchor.set(0.5);
    fitObjectInRectangle(label, outline);
    container.addChild(label);

    let currentSelectionIndex = 0;
    const setCurrentSelectionIndex = (index: number) => {
      const selected = selectionOptions[index];
      const selectionDisplayName = selected.label.toUpperCase();
      animateTextSwap(label, selectionDisplayName, outlineArea, { x: 1, y: 0 });

      this.currentSelections[selectionType] = selected;
      this.onSelectionChange(this.currentSelections);
    };

    createAnimatedButtonBehavior(container, {
      onClick() {
        currentSelectionIndex = currentSelectionIndex + 1;
        if (currentSelectionIndex > selectionOptions.length - 1) currentSelectionIndex = 0;
        setCurrentSelectionIndex(currentSelectionIndex);
      },
      onUpdate({ pressProgress, hoverProgress }) {
        descr.alpha = lerp(0.4, 1.0, hoverProgress);
        highlight.alpha = 0.11 * hoverProgress + 0.34 * pressProgress;
      },
    });

    setCurrentSelectionIndex(0);

    return container;
  }
}
