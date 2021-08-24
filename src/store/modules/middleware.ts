import { Middleware } from "@reduxjs/toolkit";
import {
  fetchModulesList,
  fetchPendingModules,
  setCurrentModule,
  setCurrentPendingModule,
  setModuleAdded,
} from "./index";
import {
  getCurrentPendingModule,
  getModuleAdded,
  getModulesList,
  getPendingCreateModuleTransactions,
} from "./selectors";
import { flatAllModules } from "./helpers";

export const modulesMiddleware: Middleware = (store) => (next) => (action) => {
  if (action.type === fetchModulesList.fulfilled.type) {
    const oldState = store.getState();
    const currentPending = getCurrentPendingModule(oldState);
    const result = next(action);
    if (currentPending) {
      const modulesList = getModulesList(store.getState());
      const allModules = flatAllModules(modulesList);
      const currentModule = allModules.find(
        (module) => module.address === currentPending.address
      );
      if (currentModule) {
        store.dispatch(setCurrentModule(currentModule));
      }
    }
    return result;
  }

  if (action.type === fetchPendingModules.fulfilled.type) {
    const oldState = store.getState();
    const result = next(action);
    if (getModuleAdded(oldState)) {
      const oldPendingModules = getPendingCreateModuleTransactions(oldState);
      const newPendingModules = getPendingCreateModuleTransactions(
        store.getState()
      );
      if (
        (!oldPendingModules.length && newPendingModules.length) ||
        (oldPendingModules.length &&
          newPendingModules.length &&
          newPendingModules[0].address !== oldPendingModules[0].address)
      ) {
        store.dispatch(setCurrentPendingModule(newPendingModules[0]));
        store.dispatch(setModuleAdded(false));
      }
    }
    return result;
  }

  return next(action);
};
