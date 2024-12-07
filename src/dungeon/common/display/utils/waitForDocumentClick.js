export function waitForDocumentClick() {
    return new Promise(resolve => {
        const handler = () => {
            document.removeEventListener("click", handler);
            document.removeEventListener("touchstart", handler);
            resolve();
        };
        document.addEventListener("click", handler);
        document.addEventListener("touchstart", handler);
    });
}
//# sourceMappingURL=waitForDocumentClick.js.map