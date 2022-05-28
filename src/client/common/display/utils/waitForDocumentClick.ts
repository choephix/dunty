export function waitForDocumentClick() {
  return new Promise<void>(resolve => {
    const handler = () => {
      document.removeEventListener("click", handler);
      resolve();
    };
    document.addEventListener("click", handler);
  });
}
