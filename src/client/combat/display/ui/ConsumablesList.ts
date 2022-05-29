import { game } from "@client/combat/resolveCombatEncounter";
import { ConsumableItem, ConsumableItemBlueprints } from "@client/combat/state/ConsumableItemBlueprints";
import { UserCrossCombatData } from "@client/combat/state/data";
import { GameSingletons } from "@client/core/GameSingletons";
import { createAnimatedButtonBehavior } from "@game/asorted/createAnimatedButtonBehavior";
import { createEnchantedFrameLoop } from "@game/asorted/createEnchangedFrameLoop";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Rectangle } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import { arrangeInStraightLine } from "@sdk-pixi/layout/arrangeInStraightLine";

export class ConsumablesList extends Container {
  readonly pad;
  readonly label;

  readonly onEnterFrame = createEnchantedFrameLoop(this);

  constructor(readonly consumables: ConsumableItem[] = UserCrossCombatData.current.consumables) {
    super();

    consumables.push(...ConsumableItemBlueprints)

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
    return new VConsumableItem(item, () => {
      consumables.splice(consumables.indexOf(item), 1);
      item.onPlay(game.groupA.combatants[0], game);
    });
  }
}

export class VConsumableItem extends Sprite {
  declare hitArea: Rectangle;

  constructor(readonly data: ConsumableItem, onClick?: () => void) {
    super(Texture.WHITE);

    this.texture = Texture.from(data.iconTextureUrl);
    this.hitArea = new Rectangle(-50, -50, 100, 100);
    this.anchor.set(0.5);

    GameSingletons.getTooltipManager().registerTarget(this, data.hint);

    createAnimatedButtonBehavior(
      this,
      {
        onUpdate(this, { hoverProgress }) {
          this.scale.set(0.6 + 0.2 * hoverProgress);
          this.zIndex = hoverProgress * 1000;
        },
        onClick,
      },
      true
    );
  }

  // getLocalBounds() {
  //   return this.hitArea;
  // }
}
