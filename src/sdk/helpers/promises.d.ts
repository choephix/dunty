export declare type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U> ? U : T extends (...args: any) => infer U ? U : any;
export declare function isPromiseLike(subject: any): subject is PromiseLike<unknown>;
