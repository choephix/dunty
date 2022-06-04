import { GameSingletons } from "@dungeon/core/GameSingletons";

export function waitForDocumentClick() {
  return new Promise<void>(resolve => {
    const handler = () => {
      document.removeEventListener("click", handler);
      document.removeEventListener("touchstart", handler);
      resolve();
    };
    document.addEventListener("click", handler);
    document.addEventListener("touchstart", handler);
  });
}
