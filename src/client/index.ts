import "@client/index.css";

import { ensureSingleInstance } from "./lib/ensureSingleInstance";
import { initializeRouter } from "./lib/router";

ensureSingleInstance();
console.log("🎮 Client initializing...");

// Initialize the router which will handle all routing
initializeRouter();
