export enum ModuleType {
  DAO,
  DELAY,
  UNKNOWN,
}

export interface Module {
  name: string;
  address: string;
  type: ModuleType;
}

export interface ModuleMetadata {
  address: string;
  implAddress: string;
  name: string;
  abi: string;
}

export interface StackableModule extends Module {
  subModules: Module[];
}

export interface DelayModule extends StackableModule {
  type: ModuleType.DELAY;
  timeout: number;
  cooldown: number;
}

export interface ModulesState {
  current?: Module;
  loadingModules: boolean;
  list: Module[];
  reloadCount: number;
}
