import { Container } from "@pixi/display";
import { Enchantments } from "./Enchantments";
import { EnchantableInstance } from "./interfaces";
export declare function enchantInstance<T extends EnchantableInstance>(target: T): Container<import("@pixi/display").DisplayObject> & T & {
    __enchantedInstance__: true;
    enchantments: Enchantments;
    onEnterFrame: (() => void) & {
        enabled: boolean;
        callbacks: (() => void)[];
        add: (...cbs: (() => void)[]) => () => void;
        remove: (...cbs: (() => void)[]) => void;
        clear: () => void;
    };
    destroy(options?: boolean | import("@pixi/display").IDestroyOptions): void;
};
