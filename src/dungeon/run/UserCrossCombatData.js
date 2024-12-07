import { COMBATANT_TEXTURES_LOOKING_RIGHT } from "@dungeon/combat/display/entities/VCombatant.textures";
import { CardPools } from "@dungeon/run/CardPools";
import { __window__ } from "@debug/__window__";
import { getRandomItemFrom } from "@sdk/helpers/arrays";
const PLAYER_HEALTH = 3;
export class UserCrossCombatData {
    constructor() {
        this.currentFloor = 1;
        this.health = PLAYER_HEALTH;
        this.handReplenishCount = 4;
        this.energyReplenishCount = 3;
        // readonly deck = range(DECK_SIZE).map(() => generateRandomPlayerCard());
        this.deck = CardPools.playerStartingCards.map(c => Object.create(c));
        this.consumables = new Array();
        //// //// //// ////
        this.playerCharacterId = getRandomItemFrom(COMBATANT_TEXTURES_LOOKING_RIGHT);
    }
}
(function (UserCrossCombatData) {
    UserCrossCombatData.current = new UserCrossCombatData();
})(UserCrossCombatData || (UserCrossCombatData = {}));
__window__.UserCrossCombatData = UserCrossCombatData;
//# sourceMappingURL=UserCrossCombatData.js.map