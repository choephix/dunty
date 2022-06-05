export function createRandomizedFactory<TF extends (...args: any[]) => unknown>(
  factoryFunctions: [weight: number, construct: TF][]
) {
  const totalWeight = factoryFunctions.reduce((acc, [weight]) => acc + weight, 0);

  return (...args: Parameters<TF>) => {
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
}
