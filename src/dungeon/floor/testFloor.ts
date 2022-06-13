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
    const nodesCount = 6 * (circleIndex + 1);
    const radius = (1 + circleIndex) * 300;
    const fiDelta = (Math.PI * 2) / nodesCount;

    //// Arrange nodes in concentric circles
    for (const rayIndex of range(nodesCount)) {
      const fi = rayIndex * fiDelta + Math.PI / 2;
      const offset = { x: randomSigned(24), y: randomSigned(24) };

      const node = new RegularNode();
      node.rx = Math.cos(fi) * radius;
      node.ry = Math.sin(fi) * radius;
      node.init();
      node.setSelected(false);
      node.position.set(node.rx + offset.x, node.ry + offset.y);
      nodesParent.addChild(node);

      node.circleIndex = circleIndex;
      node.rayIndex = rayIndex;
      node.fi = fi;
      node.linkRange = fiDelta / nodesCount;
    }
  }

  let selectedNode = null as RegularNode | null;
  for (const node of nodesParent.children) {
    if (node instanceof RegularNode) {
      node.addClickHandler(async () => {
        if (selectedNode) {
          selectedNode.setSelected(false);
        }

        if (selectedNode == node) {
          selectedNode = null;
          return;
        }

        const containerRotation = Math.PI / 2 - Math.atan2(node.y, node.x);
        await gsap.to(nodesParent, { rotation: containerRotation, duration: 0.43, ease: "back.out" });

        selectedNode = node;
        selectedNode.setSelected(true);
      });
    }
  }

  const links = new Map<Node, Node[]>();

  const g = new Graphics();
  for (const node of nodesParent.children) {
    for (const otherNode of nodesParent.children) {
      if (node instanceof Node && otherNode instanceof Node) {
        if (node == otherNode) continue;

        if (links.get(otherNode)?.includes(node)) continue;

        if (!links.has(node)) links.set(node, []);

        links.get(node)!.push(otherNode);

        //// Check if other node is in link range
        const dx = node.rx - otherNode.rx;
        const dy = node.ry - otherNode.ry;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 400 + 20 * node.circleIndex) continue;

        g.lineStyle(16, 0x102040, 0.5);
        g.moveTo(node.x, node.y);
        g.lineTo(otherNode.x, otherNode.y);

        g.lineStyle(6, 0x204080, 0.35);
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
