import type { DisplayObject } from "@pixi/display";
import { enchantInstance } from "./enchantInstance";
export declare type EnchantableInstance = Pick<DisplayObject, "updateTransform" | "render" | "destroy">;
export declare type EnchantedInstance<T extends EnchantableInstance = EnchantableInstance> = T & ReturnType<typeof enchantInstance>;
