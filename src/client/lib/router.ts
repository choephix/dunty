import Navigo from "navigo";
import { Application } from "pixi.js";

const __window__ = window as any;

const createApp = async () => {
  if (!__window__.APP) {
    const { boot } = await import("@sdk-pixi/core/boot");
    __window__.APP = boot();
  }
  return __window__.APP as Application;
};

export const router = new Navigo("/");

export const initializeRouter = () => {
  // Default route - redirect to combat
  router.on("/", () => {
    router.navigate("/combat");
  });

  // Combat route
  router.on("/combat", async () => {
    console.log("🚀 Launching combat...");
    const app = await createApp();

    const { initializeGameSingletons } = await import("@dungeon/core/GameSingletons");
    initializeGameSingletons(app);

    const { main } = await import("@dungeon/main/main");
    main(app);
  });

  // Floor route
  router.on("/floor", async () => {
    console.log("🏗️ Launching floor...");
    const app = await createApp();

    const { initializeGameSingletons } = await import("@dungeon/core/GameSingletons");
    initializeGameSingletons(app);

    const { initializeDungeonFloor } = await import("@dungeon/floor/testFloor");
    initializeDungeonFloor(app);
  });

  // Surface route
  router.on("/surface", async () => {
    console.log("🌍 Launching surface...");
    const app = await createApp();

    const { initializeGameSingletons } = await import("@dungeon/core/GameSingletons");
    initializeGameSingletons(app);

    const { initializeSurfaceWorld } = await import("@surface/initializeSurfaceWorld");
    initializeSurfaceWorld(app);
  });

  // Handle not found
  router.notFound(() => {
    console.log("❌ Route not found, redirecting to combat...");
    router.navigate("/combat");
  });

  // Resolve the current route
  router.resolve();
};
