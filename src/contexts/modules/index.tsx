import React, { useContext, useReducer } from "react";
import { ModulesAction, ModulesContextState, ModulesState } from "./models";
import { initialModulesState, moduleReducer } from "./reducer";

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
