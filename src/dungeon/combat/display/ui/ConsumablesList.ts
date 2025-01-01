import { Combat } from "@dungeon/combat/logic/Combat";
import { ConsumableItem } from "@dungeon/combat/state/ConsumableItemBlueprints";
import { UserCrossCombatData } from "@dungeon/run/UserCrossCombatData";
import { GameSingletons } from "@dungeon/core/GameSingletons";
import { createAnimatedButtonBehavior } from "@sdk-pixi/asorted/createAnimatedButtonBehavior";
import { createEnchantedFrameLoop } from "@sdk-pixi/asorted/createEnchangedFrameLoop";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Rectangle } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import { arrangeInStraightLine } from "@sdk-pixi/layout/arrangeInStraightLine";

export class ConsumablesList extends Container {
  // readonly pad;
  // readonly label;

  readonly onEnterFrame = createEnchantedFrameLoop(this);

  constructor(readonly consumables: ConsumableItem[] = UserCrossCombatData.current.consumables) {
    super();

    // consumables.push(...ConsumableItemBlueprints);

    this.onEnterFrame.watch.array(
      () => this.consumables,
      () => this.update(),
      true
    );

    this.sortableChildren = true;
  }

  readonly sprites = new Map<ConsumableItem, ReturnType<typeof this.createConsumableIcon>>();

  async update() {
    console.log("update");

    await Promise.all(this.consumables.map(o => Texture.fromURL(o.iconTextureUrl)));

    for (const [index, item] of this.consumables.entries()) {
      let sprite = this.sprites.get(item);
      if (!sprite) {
        sprite = this.createConsumableIcon(item);
        this.addChild(sprite);
        this.sprites.set(item, sprite);

        console.log("create");
      }
    }

    for (const [key, sprite] of this.sprites) {
      if (!this.consumables.includes(key)) {
        this.removeChild(sprite);
        this.sprites.delete(key);

        console.log("remove");
      }
    }

    const spritesArray = Array.from(this.sprites.values());
    arrangeInStraightLine(spritesArray, { vertical: false, alignment: [0.5, 0.5] });

    this.pivot.x = (0.5 * this.width) / this.scale.x;
    this.pivot.y = (0.8 * this.height) / this.scale.y;
  }

  private createConsumableIcon(item: ConsumableItem) {
    const { consumables } = this;
    const icon = new VConsumableItem(item);
    icon.buttonize(() => {
      consumables.splice(consumables.indexOf(item), 1);

      const game = Combat.current!
      item.onPlay(game.state.groupA.combatants[0], game);
    });
    return icon;
  }
}

export class VConsumableItem extends Sprite {
  declare hitArea: Rectangle;

  scaleMultiplier = 1.0;

  constructor(readonly data: ConsumableItem) {
    super(Texture.WHITE);

    this.texture = Texture.from(data.iconTextureUrl);
    this.hitArea = new Rectangle(-50, -50, 100, 100);
    this.anchor.set(0.5);

    this.buttonMode = true;

    GameSingletons.getTooltipManager().registerTarget(this, { content: data.hint, delay: .17 });
  }

  buttonize(onClick?: () => void) {
    createAnimatedButtonBehavior(
      this,
      {
        onUpdate(this, { hoverProgress }) {
          this.scale.set(this.scaleMultiplier * (0.6 + 0.2 * hoverProgress));
          this.zIndex = hoverProgress * 1000;
        },
        onClick,
      },
      true
    );
  }
}
