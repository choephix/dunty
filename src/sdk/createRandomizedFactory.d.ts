export declare function createRandomizedFactory<TF extends (...args: any[]) => unknown>(factoryFunctions: [weight: number, construct: TF][]): TF;
