export async function initDebugging() {
  await import("@debug/global-space/assign-game-classes-to-window");
  await import("@debug/global-space/assign-misc-classes-to-window");
  await import("@debug/global-space/assign-pixi-classes-to-window");
}
