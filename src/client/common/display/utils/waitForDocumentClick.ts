export function waitForDocumentClick() {
  return new Promise<void>(resolve => {
    const handler = () => {
      document.removeEventListener("click", handler);
      document.removeEventListener("tap", handler);
      resolve();
    };
    document.addEventListener("click", handler);
    document.addEventListener("tap", handler);
  });
}
