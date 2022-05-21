import { Base64Goodies } from "@game/assets/base64";
import { TextureId } from "@game/constants/paths/TextureId";

//const atlasPrefix = "assets/atlases/";
const atlasPrefix = "assets/atlases-png/";

export const assetsNamed = {
  Font_ToC_Icons: "assets/fonts/ToC_Icons.ttf",
  Font_CaviarDreams: "assets/fonts/CaviarDreams.ttf",
  Font_CaviarDreams_Bold: "assets/fonts/CaviarDreams_Bold.ttf",
  Font_Croogla: "assets/fonts/croogla.otf",
  Font_DanielBlack: "assets/fonts/DanielBlack_Fixed.ttf",
  Font_Story: "assets/fonts/Story.ttf",

  BitmapFont_Celestial: "assets/fonts-bitmap/Celestial Bitmap.fnt",

  // test: 'assets/grid.basis',

  ...Base64Goodies,

  cardSpinner: "assets/images/cardSpinner.svg",

  vignette: TextureId.Vignette,

  uSamplerMapGround: "assets/images/worldmap/grass.png",
  uSamplerMapWater: "assets/images/worldmap/water.png",
  uSamplerDiffuse: "assets/images/world/diffuse.basis",
  uSamplerNoises: "assets/images/world/noises.png",

  worldMapRiverNames: "assets/images/worldmap/river-names.png",

  tocIconPartInner: "assets/images/ui-icons/toc-logo/part-inner.png",
  tocIconPartOuter: "assets/images/ui-icons/toc-logo/part-outer.png",

  cardGlow: "assets/images/fx/card-glow.png",
  cardShade: "assets/images/fx/card-shade.png",

  glowA: "assets/images/fx/glow-a.png",
  rays: "assets/images/fx/rays.png",
  perlin: "assets/images/fx/perlin.png",

  cardsBg: "assets/images/ui-cards-loadout/bg.png",

  chooChooDraw: "assets/images/promo/choo-choo-draw.png",
  mapPoint: "assets/images/worldmap-markers/map-point.png",
  mapPointGlow: "assets/images/worldmap-markers/map-point-highlight.png",

  railTrackDirt: "assets/images/tracks/track-dirt-ld.png",
  railTrack: "assets/images/tracks/track-combined.png",
  railTrackBridge: "assets/images/tracks/track-bridge.png",
  railTrackBridgeBase: "assets/images/tracks/track-bridge-base.png",
  railTrackAbstract: "assets/images/tracks/track-abstract.png",
  railTrackSpot: "assets/images/tracks/track-spot.png",

  npc_thomas: "assets/audio/music/npc-thomas.mp3",
  npc_stranger: "assets/audio/music/npc-stranger.mp3",
  npc_otto: "assets/audio/music/npc-otto.mp3",
  npc_story_01: "assets/audio/music/story-stranger-a.mp3",
  main: "assets/audio/music/main.mp3",

  railroaderDashboardPanelBackgroundWithBase: "assets/images/ui-railroader-dashboard/page-common/panel-with-base.png",
  railroaderDashboardPanelBackgroundNoBase: "assets/images/ui-railroader-dashboard/page-common/panel-no-base.png",

  vortexBackground: "assets/images/cinematics/timeline-vortex.basis",
  meshPad: "assets/images/ui-main/mesh-pad.png",

  windowGrunge: "assets/images/ui-windows/grunge.basis",
  windowFrame: "assets/images/ui-windows/frame.basis",
  windowListPadBig: "assets/images/ui-windows/middle-big.png",
  windowListPadLong: "assets/images/ui-windows/middle-long.png",

  stationDashboardBackgroundConductorLounge: "assets/images/ui-station-dashboard/bg-conductor-lounge.basis",
  stationDashboardBackgroundRailYard: "assets/images/ui-station-dashboard/bg-rail-yard.basis",

  mutedSoundIcon: "assets/images/ui-icons/sound-off.png",
  playingSoundIcon: "assets/images/ui-icons/sound-on.png",

  thomasIntro: "assets/images/cinematics/thomas-intro.basis",

  // __pikachu: "https://upload.wikimedia.org/wikipedia/en/a/a6/Pok%C3%A9mon_Pikachu_art.png",
};

export const assetsUnnamed = [
  "assets/images/station-popups/common.basis",
  "assets/images/station-popups/uncommon.basis",
  "assets/images/station-popups/rare.basis",
  "assets/images/station-popups/epic.basis",
  "assets/images/station-popups/legendary.basis",
  "assets/images/station-popups/mythic.basis",

  "assets/images/empty-cards.basis",

  atlasPrefix + "atlas-hud-common.json",
  atlasPrefix + "atlas-hud-cards-drawer.json",
  atlasPrefix + "atlas-map-decoration-sprites.json",
  atlasPrefix + "atlas-map-station-sprites.json",
  atlasPrefix + "atlas-station-dashboard.json",
  atlasPrefix + "atlas-station-dashboard-staking.json",
  atlasPrefix + "atlas-station-popup-elements.json",
  atlasPrefix + "atlas-ui-asorted.json",
  atlasPrefix + "atlas-ui-railroader-dashboard.json",
  atlasPrefix + "atlas-ui-railroader-dashboard-staking.json",
  atlasPrefix + "atlas-ui-staking-hub-conductor-lounge.json",
  atlasPrefix + "atlas-ui-staking-hub-rail-yard.json",
  atlasPrefix + "atlas-ui-staking-previews-conductors.json",
  atlasPrefix + "atlas-ui-staking-previews-locomotives.json",
  atlasPrefix + "atlas-ui-staking-requests.json",
  atlasPrefix + "atlas-station-billboard.json",
  atlasPrefix + "atlas-ui-market-window.json",
  atlasPrefix + "atlas-ui-market-window-character.json",
  atlasPrefix + "atlas-ui-market-window-compositions.json",
  atlasPrefix + "atlas-ui-market-window-ct-parts.json",
  atlasPrefix + "atlas-ui-market-window-unlock-trains.json",
  atlasPrefix + "atlas-ui-market-window-emporium.json",
  atlasPrefix + "atlas-ui-railruns-window.json",
  atlasPrefix + "atlas-ui-golden-runs.json",
  atlasPrefix + "atlas-npc-encounters-mysterious-stranger.json",
  atlasPrefix + "atlas-npc-encounters-otto.json",
  atlasPrefix + "atlas-npc-encounters-thomas.json",
  atlasPrefix + "atlas-npc-encounters-story-chapter-01.json",
  atlasPrefix + "atlas-century-vials.json",

  "assets/images/ui-staking-hub/bg-rim.png",

  "assets/images/ui-common/dropdown-pad.png",
  "assets/images/ui-common/btn-blue.png",
  "assets/images/ui-common/btn-green.png",
  "assets/images/ui-common/btn-red.png",
];

export const assetsAudio = {
  clickRegular: "assets/audio/sfx/click-regular.wav",
  clickRegularDown: "assets/audio/sfx/click-regular-down.wav",
  clickRegularUp: "assets/audio/sfx/click-regular-up.wav",
  clickTiny: "assets/audio/sfx/click-tiny.wav",
  chooChoo: "assets/audio/sfx/choo-choo.wav",
  cogWheelActivate: "assets/audio/sfx/cog-wheel-activate.wav",
  cogWheelRRDash: "assets/audio/sfx/cog-wheel-rr-dash.wav",
  paper: "assets/audio/sfx/paper.wav",

  ottoCinematicRiser: "assets/audio/sfx/npc-cinematic-otto/transition-riser.wav",
  ottoCinematicWarp: "assets/audio/sfx/npc-cinematic-otto/transition-warp.wav",
  thomasCinematicRunning: "assets/audio/sfx/npc-cinematic-thomas/running.wav",

  newStory: "assets/audio/sfx/npc-cinematic-stories/new-story.wav",
  ticking: "assets/audio/sfx/npc-cinematic-stories/ticking.wav",
};
