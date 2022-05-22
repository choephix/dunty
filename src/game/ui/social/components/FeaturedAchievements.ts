import { Container } from "@pixi/display";
import { AchievementBadge } from "./AchievementBadge";

export class FeaturedAchievements extends Container {
  constructor() {
    super();

    //// Add first row of badges
    let startX = 0;
    let startY = 0;
    for (let i = 0; i < 5; i++) {
      const badge = new AchievementBadge();
      badge.position.set(startX, startY);
      this.addChild(badge);
      startX += 75;
    }
    startY += 60;
    startX = 40;
    //// Add second row of badges
    for (let i = 0; i < 4; i++) {
      const badge = new AchievementBadge();
      badge.position.set(startX, startY);
      this.addChild(badge);
      startX += 75;
    }
  }

  // populate(achievementsData: AchievementData[]) {

  // }
}
