import { DelayModule, Module, ModuleType } from "./models";

export function isDelayModule(module: Module): module is DelayModule {
  return module.type === ModuleType.DELAY;
}

export function fetchDelayModule(address: string): DelayModule {
  // TODO: Fetch Delay Module Data
  return {
    name: "Delay Module",
    type: ModuleType.DELAY,
    address: address,
    subModules: [],
    timeout: 86400,
    cooldown: 86400,
  };
}
