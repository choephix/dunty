import { COMBATANT_TEXTURES_LOOKING_RIGHT } from "@dungeon/combat/display/entities/VCombatant.textures";
import { getRandomItemFrom } from "@sdk/helpers/arrays";
/**
 * Single instance of a combat encounter.
 */
export class CombatState {
    constructor() {
        this.groupA = new CombatGroup();
        this.groupB = new CombatGroup();
    }
}
export class CombatGroup {
    constructor() {
        this.isPlayer = false;
        this.combatants = new Array();
    }
    addCombatant(combatant) {
        this.combatants.push(combatant);
        combatant.group = this;
    }
}
export class CardPiles {
    constructor() {
        this.drawPile = new Array();
        this.hand = new Array();
        this.discardPile = new Array();
        this.void = new Array();
        this.piles = [this.drawPile, this.discardPile, this.hand];
    }
    moveCardTo(card, pile, atTheBottom = false) {
        const prevPile = this.piles.find(p => p.includes(card));
        if (prevPile) {
            prevPile.splice(prevPile.indexOf(card), 1);
        }
        else {
            console.error("Card not found in any pile");
        }
        if (atTheBottom) {
            pile.push(card);
        }
        else {
            pile.unshift(card);
        }
    }
    addCardTo(card, pile, atTheBottom = false) {
        if (pile.includes(card)) {
            return console.error("Card already in pile");
        }
        if (atTheBottom) {
            pile.push(card);
        }
        else {
            pile.unshift(card);
        }
    }
}
export class Combatant {
    constructor(initialStatus = {}, characterId = getRandomItemFrom(COMBATANT_TEXTURES_LOOKING_RIGHT)) {
        // State
        this.cards = new CardPiles();
        this.handReplenishCount = 1;
        this.energyReplenishCount = 0;
        this.energy = 0;
        this.status = {
            // ❤
            health: 1,
            // Positive
            block: 0,
            protection: 0,
            retaliation: 0,
            parry: 0,
            reflect: 0,
            leech: 0,
            regeneration: 0,
            strength: 0,
            rage: 0,
            fury: 0,
            haste: 0,
            taunt: 0,
            tactical: 0,
            daggers: 0,
            defensive: 0,
            // Negative
            weak: 0,
            brittle: 0,
            exposed: 0,
            doomed: 0,
            burning: 0,
            poisoned: 0,
            bleeding: 0,
            stunned: 0,
            frozen: 0,
            // silenced: 0,
            // disarmed: 0,
            // Neutral
            wet: 0,
            warm: 0,
            oiled: 0,
            cold: 0,
        };
        this.characterId = characterId;
        this.textureId = `https://undroop-assets.web.app/enigma/sugimori/${this.characterId}.png`;
        Object.assign(this.status, initialStatus);
    }
    get alive() {
        return this.status.health > 0;
    }
    toString() {
        return `${this.name || "?"} (${this.status.health})`;
    }
}
export var CombatantStatus;
(function (CombatantStatus) {
    function entries(obj) {
        return Object.entries(obj);
    }
    CombatantStatus.entries = entries;
})(CombatantStatus || (CombatantStatus = {}));
export var CardTarget;
(function (CardTarget) {
    CardTarget["SELF"] = "SELF";
    CardTarget["TARGET_ANYONE"] = "TARGET_ANYONE";
    CardTarget["TARGET_ENEMY"] = "TARGET_ENEMY";
    CardTarget["FRONT_ENEMY"] = "FRONT_ENEMY";
    CardTarget["ALL_ENEMIES"] = "ALL_ENEMIES";
    CardTarget["ALL_ALLIES"] = "ALL_ALLIES";
    CardTarget["ALL"] = "ALL";
})(CardTarget || (CardTarget = {}));
export var CardPileType;
(function (CardPileType) {
    CardPileType["DRAW"] = "DRAW";
    CardPileType["HAND"] = "HAND";
    CardPileType["DISCARD"] = "DISCARD";
    CardPileType["VOID"] = "VOID";
})(CardPileType || (CardPileType = {}));
//# sourceMappingURL=CombatState.js.map