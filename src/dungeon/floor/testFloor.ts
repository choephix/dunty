import { __window__ } from "@debug/__window__";
import { Application } from "@pixi/app";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { range2D } from "@sdk/math/range2d";
import { randomInt, randomSigned } from "@sdk/utils/random";
import { Viewport } from "pixi-viewport";
import { gsap } from "gsap";
import { BLEND_MODES } from "@pixi/constants";
import { getRandomItemFrom } from "@sdk/helpers/arrays";
import { range } from "@sdk/utils/range";
import { BossNode, RegularNode, Node } from "./Node";
import { Graphics } from "@pixi/graphics";

export function initializeDungeonFloor(app: Application) {
  console.log("Initializing surface world...");

  const viewport = new Viewport();
  viewport.drag().wheel().pinch().decelerate();
  viewport.position.set(window.innerWidth / 2, window.innerHeight / 2);
  __window__.viewport = viewport;
  app.stage.addChild(viewport);

  const nodesParent = new NodesParent();
  viewport.addChild(nodesParent);

  const boss = new BossNode();
  // boss.v1();
  boss.v2();
  nodesParent.addChild(boss);

  const circlesCount = 5;

  for (const circleIndex of range(circlesCount)) {
    const nodesCount = 3 * (circleIndex + 1);
    const radius = (1 + circleIndex) * 300;

    //// Arrange nodes in concentric circles
    for (const rayIndex of range(nodesCount)) {
      const fi = (rayIndex / nodesCount) * Math.PI * 2 + Math.PI / 2;
      const offset = { x: randomSigned(24), y: randomSigned(24) };
      const node = new RegularNode();
      node.init();
      node.setSelected(false);
      node.position.set(Math.cos(fi) * radius + offset.x, Math.sin(fi) * radius + offset.y);
      nodesParent.addChild(node);

      node.circleIndex = circleIndex;
      node.rayIndex = rayIndex;
      node.fi = fi;
    }
  }

  let selectedNode = null as RegularNode | null;
  for (const node of nodesParent.children) {
    if (node instanceof RegularNode) {
      node.addClickHandler(() => {
        if (selectedNode) {
          selectedNode.setSelected(false);
        }
        selectedNode = node;
        selectedNode.setSelected(true);

        const angle = Math.atan2(node.y, node.x);
        gsap.to(nodesParent, { rotation: Math.PI / 2 - angle, duration: 0.3, ease: "back.out" });
      });
    }
  }

  const g = new Graphics();
  for (const node of nodesParent.children) {
    for (const otherNode of nodesParent.children) {
      if (node instanceof Node && otherNode instanceof Node) {
        if (node == otherNode) continue;
        if (Math.abs(node.rayIndex - otherNode.rayIndex) > 1) continue;
        if (Math.abs(node.circleIndex - otherNode.circleIndex) > 1) continue;
        g.lineStyle(8, 0x102040, 0.5);
        g.moveTo(node.x, node.y);
        g.lineTo(otherNode.x, otherNode.y);
      }
    }
  }
  nodesParent.addChildAt(g, 0);
}

class NodesParent extends Container {
  onEnterFrame() {
    // this.angle += 0.1;
  }
}
