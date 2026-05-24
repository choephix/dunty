import { Container } from "pixi.js";
import { Graphics } from "pixi.js";
import { Rectangle } from "pixi.js";

export function drawRect(container: Container, rect: Partial<Rectangle>, color: number = ~~(0xffffff * Math.random())) {
  const graphics = new Graphics();
  graphics.beginFill(color);
  graphics.drawRect(rect.x || 0, rect.y || 0, rect.width || 100, rect.height || 100);
  graphics.endFill();
  return container.addChild(graphics);
}
