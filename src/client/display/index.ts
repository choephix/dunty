import { Sprite } from "@pixi/sprite";
import { Texture } from "@pixi/core";
import { Combatant } from "../game/game";

const T = {
  PIKACHU: `https://upload.wikimedia.org/wikipedia/en/thumb/a/a6/Pok%C3%A9mon_Pikachu_art.png/220px-Pok%C3%A9mon_Pikachu_art.png`
}

// export class CombatantSprite extends Sprite {
//   constructor(public readonly opposite: boolean) {
//     super(Texture.from(T.PIKACHU));
//     this.anchor.set(0.5);
//   }
// }

type Props = {
  opposite: boolean;
  data: Combatant
} & Partial<Sprite>

export const Combatant_ = PixiComponent('Counter', {
  create: () => {
    return new Sprite(Texture.from(T.PIKACHU))
  },
  applyProps: (instance, oldProps: Props, newProps: Props) => {
    instance.anchor.set(0.5);
    instance.scale.x = newProps.opposite ? 1 : -1;
    Object.assign(instance, newProps);
  },
})