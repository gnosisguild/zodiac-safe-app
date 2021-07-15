export enum ModuleType {
  DAO,
  DELAY,
  UNKNOWN,
}

export interface Module {
  name: string;
  address: string;
  subModules: Module[];
  type: ModuleType;
}

export interface ModulesState {
  current?: Module;
  loadingModules: boolean;
  list: Module[];
  reloadCount: number;
}
