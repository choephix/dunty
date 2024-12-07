import { CombatController } from "@dungeon/combat/logic/Combat.controller";
import { CombatFAQ } from "@dungeon/combat/logic/Combat.faq";
import { __window__ } from "@debug/__window__";
import { CombatState } from "../state/CombatState";
import { CombatAI } from "./Combat.ai";
export class Combat {
    constructor() {
        this.state = new CombatState();
        this.ctrl = new CombatController(this);
        this.faq = new CombatFAQ(this);
        this.ai = new CombatAI(this);
        Combat.current = this;
        __window__.game = this;
    }
    *iterateCombatants() {
        yield* this.state.groupA.combatants;
        yield* this.state.groupB.combatants;
    }
}
//# sourceMappingURL=Combat.js.map