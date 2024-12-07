import { Combatant, CombatState } from "@dungeon/combat/state/CombatState";
import { StatusEffectKey } from "@dungeon/combat/state/StatusEffectBlueprints";
export declare function getStatusEffectEmojiOnly(statusEffect: StatusEffectKey): string;
export declare function getStatusEffectEmojifiedString(actor: Combatant, game: CombatState): string;
export declare function getIntentionEmojifiedString(actor: Combatant, game: CombatState): [string, number?];
