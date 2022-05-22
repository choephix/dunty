import { Container } from "@pixi/display";

export enum RailroaderDashPanelType {
  Settings = 1,
  Leaderboards = 2,
  ClaimCenter = 3,
  Staking = 4,
  Events = 5,
  Story = 6,
  Achievements = 7,
  Inventory = 8,
  GoldenRuns = 9,

  MySocialProfile = 10,
}

export type RailroaderDashPanel = Container & {
  init(): void;
  scaleMultiplier?: number;
  setLayoutMode?: (mode: "landscape" | "portrait") => void;
  playShowAnimation?: () => unknown;
  playHideAnimation?: () => unknown;
};
