import React, { Reducer, useContext, useReducer } from "react";

enum MODULE_ACTION {
  SET_CURRENT_MODULE,
}

export interface Module {
  name: string;
  address: string;
}

interface ModulesState {
  current?: Module;
  list: Module[];
}

interface ModulesAction {
  type: MODULE_ACTION;
  payload: any;
}

interface ModulesContextState {
  state: ModulesState;
  dispatch(action: ModulesAction): void;
}

const initialModulesState: ModulesState = {
  list: [
    { address: "0x256B70644f5D77bc8e2bb82C731Ddf747ecb1471", name: "Module 1" },
    { address: "0x256B70644f5D77bc8e2bb82C731Ddf747ecb1472", name: "Module 2" },
    { address: "0x256B70644f5D77bc8e2bb82C731Ddf747ecb1473", name: "Module 3" },
    { address: "0x256B70644f5D77bc8e2bb82C731Ddf747ecb1474", name: "Module 4" },
  ],
  current: {
    address: "0x256B70644f5D77bc8e2bb82C731Ddf747ecb1471",
    name: "Module 1",
  },
};

const moduleReducer: Reducer<ModulesState, ModulesAction> = (
  state: ModulesState,
  action
): ModulesState => {
  switch (action.type) {
    case MODULE_ACTION.SET_CURRENT_MODULE:
      return { ...state, current: action.payload };
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
