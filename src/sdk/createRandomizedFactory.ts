export function createRandomizedFactory<TF extends (...args: any[]) => unknown>(
  factoryFunctions: [weight: number, construct: TF][]
): TF {
  const totalWeight = factoryFunctions.reduce((acc, [weight]) => acc + weight, 0);
  const func: TF = function (...args: any[]) {
    const rand = Math.random() * totalWeight;
    let sum = 0;
    for (const [weight, fun] of factoryFunctions) {
      sum += weight;
      if (rand < sum) {
        return fun(...args);
      }
    }
    return factoryFunctions[0][1](...args);
  } as any;
  return func;
}
