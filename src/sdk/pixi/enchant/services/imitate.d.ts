import { Container } from "@pixi/display";
import { EnchantedInstance } from "../interfaces";
declare type CleanUpFunction = () => unknown;
declare type ITicker = {
    add: (callback: () => unknown) => CleanUpFunction;
};
export declare function makeImitateService(ticker: ITicker): (<T1 extends EnchantedInstance<Container<import("@pixi/display").DisplayObject>>, T2>(imitator: T1, source: T2, sourceKeys: (keyof T1 & keyof T2)[]) => CleanUpFunction) & {
    _ticker: ITicker;
};
export {};
