import { enchantInstance } from "./enchantInstance";

export type EnchantableInstance = {
  destroy(...args: any[]): void;
};

export type EnchantedInstance<T extends EnchantableInstance = EnchantableInstance> = T &
  ReturnType<typeof enchantInstance>;
