import { Graphics } from "@pixi/graphics";
export function drawRect(container, rect, color = ~~(0xffffff * Math.random())) {
    const graphics = new Graphics();
    graphics.beginFill(color);
    graphics.drawRect(rect.x || 0, rect.y || 0, rect.width || 100, rect.height || 100);
    graphics.endFill();
    return container.addChild(graphics);
}
//# sourceMappingURL=drawRect.js.map