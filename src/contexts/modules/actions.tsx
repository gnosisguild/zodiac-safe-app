import { Module, MODULE_ACTION, ModulesAction } from "./models";

export const setCurrentModule = (module: Module): ModulesAction => {
  return {
    type: MODULE_ACTION.SET_CURRENT_MODULE,
    payload: module,
  };
};

export const increaseReloadCount = (): ModulesAction => {
  return { type: MODULE_ACTION.INCREASE_RELOAD_COUNT };
};

export const loadModules = (modules: Module[]): ModulesAction => {
  return { type: MODULE_ACTION.FETCH_MODULES, payload: modules };
};
