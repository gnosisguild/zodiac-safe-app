export interface Module {
  name: string;
  address: string;
  subModules: Module[];
}

export interface ModulesState {
  current?: Module;
  list: Module[];
  reloadCount: number;
}
