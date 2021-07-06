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
      return { ...state, list: action.payload, current: action.payload[0] };
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

export function useModulesSelector<T>(selector: (state: ModulesState) => T): T {
  const { state } = useModules();
  return selector(state);
}

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
