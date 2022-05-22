import "./index.css";

import { boot } from "@client/boot";
import { main } from "@client/main";

const __window__ = window as any;

export module GameSingletons {
  const pixiStuff = Object.freeze({
    app: (__window__.app = boot()),
  });

  export function getPixiStuff() {
    return pixiStuff;
  }
}

main();
