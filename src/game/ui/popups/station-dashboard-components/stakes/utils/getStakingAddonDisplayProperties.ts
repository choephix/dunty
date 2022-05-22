import { StakingAddonType } from "@game/asorted/StakingType";

const map = {
  [StakingAddonType.RailYard]: {
    addonDisplayName: "Rail Yard",
    cardSchemaDisplayName: "Locomotive",
  },

  [StakingAddonType.ConductorLounge]: {
    addonDisplayName: "Conductor Lounge",
    cardSchemaDisplayName: "Conductor",
  },
};

export function getStakingAddonDisplayProperties(type: StakingAddonType) {
  return map[type];
}
