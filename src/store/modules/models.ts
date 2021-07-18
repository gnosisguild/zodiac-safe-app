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

export interface StackableModule extends ModuleWithCooldown {
  subModules: Module[];
}

export interface ModuleWithCooldown extends Module {
  timeout: number;
  cooldown: number;
}

export interface DelayModule extends StackableModule {
  type: ModuleType.DELAY;
}

export interface DaoModule extends ModuleWithCooldown {
  type: ModuleType.DAO;
  executor: string;
  oracle: string;
  expiration: number;
  bond: string;
  templateId: string;
}

export interface ModulesState {
  operation: Operation;
  current?: Module;
  loadingModules: boolean;
  list: Module[];
  reloadCount: number;
}

export type Operation = "read" | "write";
