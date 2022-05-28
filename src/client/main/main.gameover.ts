import { Application } from "@pixi/app";
import { Container } from "@pixi/display";
import { Text } from "@pixi/text";

export async function resolveGameOver(app: Application) {

  const text = new Text("Game Over", {
    fill: 0xffffff,
    fontFamily: "Impact, fantasy",
    fontSize: 60,
    stroke: 0x0,
    strokeThickness: 8,
  });
}
