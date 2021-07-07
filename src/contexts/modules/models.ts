export enum MODULE_ACTION {
  SET_CURRENT_MODULE,
  INCREASE_RELOAD_COUNT,
  FETCH_MODULES,
}

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

export interface ModulesAction {
  type: MODULE_ACTION;
  payload?: any;
}

export interface ModulesContextState {
  state: ModulesState;

  dispatch(action: ModulesAction): void;
}
