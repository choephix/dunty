import { CardEntity } from "@game/data/entities/CardEntity";
import { DisplayObject } from "@pixi/display";

export type CardsDrawerGroupData = {
  title?: string;
  cards?: Readonly<Readonly<CardEntity>[]>;

  widthWeight?: number;

  hint?: string | undefined;
  onClick?: (selectedCard: Readonly<CardEntity> | null) => unknown;
  onFocusedCardOrHoverStateChange?: (selectedCard: Readonly<CardEntity> | null, hover: boolean) => unknown;
  shouldHighlightCard?: (card: Readonly<CardEntity>) => boolean;
  shouldShowPlusButton?: boolean;
  shouldShowPlusCard?: boolean;

  initialFocusIndex?: number;

  noHitAreaQuads?: boolean;
  createAdditionalDisplayObject?: () => DisplayObject;
  filter?: (card: Readonly<CardEntity>) => boolean;
  markEquippedCards?: boolean;
};
