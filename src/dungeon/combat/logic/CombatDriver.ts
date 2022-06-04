import {Combat} from "@dungeon/combat/logic/Combat";

export class CombatDriver {
  constructor(public readonly combat: Combat) {}

  public get state() { return this.combat.state; };
  public get ctrl() { return this.combat.ctrl; };
  public get faq() { return this.combat.faq; };
}
