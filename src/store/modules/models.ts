export interface Module {
  name: string;
  address: string;
  subModules: Module[];
}

export interface ModulesState {
  current?: Module;
  loadingModules: boolean;
  list: Module[];
  reloadCount: number;
}
