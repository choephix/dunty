export function createRandomizedFactory(factoryFunctions) {
    const totalWeight = factoryFunctions.reduce((acc, [weight]) => acc + weight, 0);
    const func = function (...args) {
        const rand = Math.random() * totalWeight;
        let sum = 0;
        for (const [weight, fun] of factoryFunctions) {
            sum += weight;
            if (rand < sum) {
                return fun(...args);
            }
        }
        return factoryFunctions[0][1](...args);
    };
    return func;
}
//# sourceMappingURL=createRandomizedFactory.js.map