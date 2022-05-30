import { CombatController } from "@client/combat/logic/Combat.controller";
import { CombatFAQ } from "@client/combat/logic/Combat.faq";
import { __window__ } from "@debug/__window__";
import { CombatState } from "../state/CombatState";
import { CombatAI } from "./Combat.ai";

export class Combat {
  public readonly state = new CombatState();

  public readonly ctrl = new CombatController(this);
  public readonly faq = new CombatFAQ(this);
  public readonly ai = new CombatAI(this);

  *iterateCombatants() {
    yield* this.state.groupA.combatants;
    yield* this.state.groupB.combatants;
  }

  public static current?: Combat;
  constructor() {
    Combat.current = this;
    __window__.game = this;
  }
}
