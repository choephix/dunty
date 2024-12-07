export function makeImitateService(ticker) {
    /**
     * @param condition primise will resolve the first time this returns true
     */
    function imitate(imitator, source, sourceKeys) {
        function copyPropertiesFromSourceToImitator() {
            for (const key of sourceKeys) {
                imitator[key] = source[key];
            }
        }
        return ticker.add(copyPropertiesFromSourceToImitator);
    }
    return Object.assign(imitate, { _ticker: ticker });
}
//# sourceMappingURL=imitate.js.map