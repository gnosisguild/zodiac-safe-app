import React, { Reducer, useContext, useReducer } from "react";

enum MODULE_ACTION {
  SET_CURRENT_MODULE,
  INCREASE_RELOAD_COUNT,
  FETCH_MODULES,
}

export interface Module {
  name: string;
  address: string;
  subModules: Module[];
}

interface ModulesState {
  current?: Module;
  list: Module[];
  reloadCount: number;
}

interface ModulesAction {
  type: MODULE_ACTION;
  payload?: any;
}

interface ModulesContextState {
  state: ModulesState;
  dispatch(action: ModulesAction): void;
}

const module2 = {
  address: "0x256B70644f5D77bc8e2bb82C731Ddf747ecb1472",
  name: "Module 2",
  subModules: [],
};
const module3 = {
  address: "0x256B70644f5D77bc8e2bb82C731Ddf747ecb1473",
  name: "Module 3",
  subModules: [],
};
const module4 = {
  address: "0x256B70644f5D77bc8e2bb82C731Ddf747ecb1474",
  name: "Module 4",
  subModules: [module3],
};

const module1 = {
  address: "0x5CC00E150CbFB64039Bdd076911ff0a81180F1b3",
  name: "Module 1",
  subModules: [module2, module4],
};

const initialModulesState: ModulesState = {
  reloadCount: 0,
  list: [],
  current: undefined,
};

const moduleReducer: Reducer<ModulesState, ModulesAction> = (
  state: ModulesState,
  action
): ModulesState => {
  switch (action.type) {
    case MODULE_ACTION.FETCH_MODULES:
      return { ...state, list: action.payload };
    case MODULE_ACTION.SET_CURRENT_MODULE:
      return { ...state, current: action.payload };
    case MODULE_ACTION.INCREASE_RELOAD_COUNT:
      return { ...state, reloadCount: state.reloadCount + 1 };
  }
};

export const ModulesContext = React.createContext<ModulesContextState>({
  dispatch(action: ModulesAction) {},
  state: initialModulesState,
});

export const ModulesProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(moduleReducer, initialModulesState);
  return (
    <ModulesContext.Provider value={{ state, dispatch }}>
      {children}
    </ModulesContext.Provider>
  );
};

export const useModules = () => useContext(ModulesContext);
export const useModulesState = () => useModules().state;

export const setCurrentModule = (module: Module): ModulesAction => {
  return {
    type: MODULE_ACTION.SET_CURRENT_MODULE,
    payload: module,
  };
};

export const increaseReloadCount = (): ModulesAction => {
  return { type: MODULE_ACTION.INCREASE_RELOAD_COUNT };
};

export const loadModules = (modules: any): ModulesAction => {
  return { type: MODULE_ACTION.FETCH_MODULES, payload: modules };
};
