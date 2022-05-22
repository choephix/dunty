import { GameSingletons } from "@game/app/GameSingletons";
import { ThemeColors } from "@game/constants/ThemeColors";
import { CardSprite } from "./CardSprite";

export function markCardSpriteIfEquippedOnTrain(cardSprite: CardSprite, subtle: boolean = false) {
  if (!cardSprite.entity) return;
  const { userData } = GameSingletons.getDataHolders();
  const equippedTrain = userData.getTrainEquippedWithCard(cardSprite.entity);
  if (equippedTrain) {
    if (subtle) {
      cardSprite.setSubtleOverlayMessage(`Equipped on\n${equippedTrain.name}`, ThemeColors.HIGHLIGHT_COLOR_LIGHT.toInt());
    } else {
      cardSprite.setErrorOverlayMessage(`Equipped on\n${equippedTrain.name}`, ThemeColors.HIGHLIGHT_COLOR.toInt());
    }
  }
}
