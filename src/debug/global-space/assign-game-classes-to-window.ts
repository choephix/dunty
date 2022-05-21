import { formatDateTimeHumanReadable } from "@game/asorted/formatDateTimeHumanReadable";
import { VerticalDisplayObjectList } from "@game/asorted/VerticalDisplayObjectList";
import { LetterBoxingBars } from "@game/cinematics/components/LetterBoxingBars";
import { Region } from "@game/constants/RegionId";
import { CardEntity } from "@game/data/entities/CardEntity";
import { StakingAddonDataService } from "@game/data/staking/StakingAddonDataService";
import { DashboardButton } from "@game/ui/popups/components/dash/DashboardButton";
import { GreenButton } from "@game/ui/railroader-dash/panels/settings/components/GreenButton";
import { getSpriteFromIPFSHash } from "@game/ui/popups/station-dashboard-components/billboard/utils/getSpriteFromIPFSHash";
import { fitObjectInRectangle } from "@sdk-pixi/layout/fitObjectInRectangle";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { createSimpleTweener } from "@sdk/time/SimpleTweener";
import { checkForStoryProgress } from "@game/gameplay/checkForStoryProgress";
import { UnlockTrainsDataService } from "@game/ui/windows/market/pages/upgrades/unlock-trains/UnlockTrainsDataService";
import { makeParticlesExplosion } from "@game/ui/fx/makeParticlesExplosion";
import { createThomasEncounterRewardModal } from "@game/cinematics/utils/createThomasEncounterRewardModal";
import { playStoryEncounterCinematic } from "@game/gameplay/playStoryEncounterCinematic";
import { createDynamicStoryTextService } from "@game/cinematics/utils/dynamicStoryContentFunctions";
import { FontFamily } from "@game/constants/FontFamily";
import { RailCarStatBox } from "@game/ui/popups/components/RailCarStatBox";
import { FontIcon } from "@game/constants/FontIcon";
import { addDisplayObjectMask, createDisplayObjectMask } from "@game/asorted/createDisplayObjectMask";
import { fadeChangeSpriteTexture } from "@game/asorted/animations/fadeChangeSpriteTexture";
import { LocoBoostJar } from "@game/ui/components/LocoBoostJar";
import { createObservableObjectWrapper } from "@sdk/observers/createObservableObjectWrapper";
import { EmporiumDataService } from "@game/ui/windows/market/pages/emporium/EmporiumDataService";

Object.assign(window, {
  CardEntity,
  DashboardButton,
  GreenButton,
  VerticalDisplayObjectList,
  StakingAddonDataService,
  TemporaryTweeener,
  LetterBoxingBars,
  UnlockTrainsDataService,
  RailCarStatBox,
  FontFamily,
  FontIcon,
  Region,
  checkForStoryProgress,
  formatDateTimeHumanReadable,
  createSimpleTweener,
  getSpriteFromIPFSHash,
  fitObjectInRectangle,
  makeParticlesExplosion,
  createThomasEncounterRewardModal,
  createDynamicStoryTextService,
  playStoryEncounterCinematic,
  createDisplayObjectMask,
  addDisplayObjectMask,
  fadeChangeSpriteTexture,
  createObservableObjectWrapper,
  LocoBoostJar,
  EmporiumDataService,
});
