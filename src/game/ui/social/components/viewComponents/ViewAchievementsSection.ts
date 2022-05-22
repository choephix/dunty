import { GameSingletons } from "@game/app/GameSingletons";
import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { nextFrame } from "@sdk/utils/promises";
import { Scrollbox } from "pixi-scrollbox";
import { AchievementBadge } from "../AchievementBadge";

export class ViewAchievementsSection extends Scrollbox {
  private readonly factory = GameSingletons.getSimpleObjectFactory();
  constructor() {
    super({
      noTicker: true,
      boxWidth: 625,
      boxHeight: 195,
      stopPropagation: true,
      divWheel: GameSingletons.getGameContext().app.view,
      overflow: "none",
    });
  }

  async addAchievements(data: Array<{ color: number; label: string }>) {
    let startX = 50;
    let startY = 25;
    for (let [index, badge] of data.entries()) {
      const achievementBadge = new AchievementBadge();
      achievementBadge.setColor(badge.color);
      const label = this.factory.createText(badge.label.toUpperCase(), {
        wordWrap: true,
        fontSize: 10,
        lineHeight: 18,
        align: "center",
        wordWrapWidth: 50,
      });
      label.anchor.set(0.5, 0.5);
      label.y += achievementBadge.height;
      achievementBadge.addChild(label);

      achievementBadge.position.set(startX, startY);
      this.content.addChild(achievementBadge);
      startX += 100;
      if ((index + 1) % 6 == 0) {
        startY += 100;
        startX = 50;
      }
      await nextFrame();
      this.update();
    }
    this.content.addChild(this.addInvisibleBox(201));
    this.update();
  }

  addInvisibleBox(px: number) {
    const box = new Sprite(Texture.EMPTY);
    box.width = this.boxWidth + 1;
    box.height = px;
    return box;
  }

  clearData() {
    const children = [...this.content.children];
    for (const child of children) {
      child.destroy({ children: true });
    }
  }
}
