import { RootState } from "../index";
import { isDaoModule, isDelayModule } from "./helpers";

export function getCurrentModule(state: RootState) {
  return state.modules.current;
}

export function getModulesList(state: RootState) {
  return state.modules.list;
}

export function getReloadCount(state: RootState) {
  return state.modules.reloadCount;
}

export function getIsLoadingModules(state: RootState) {
  return state.modules.loadingModules;
}

export function getDelayModules(state: RootState) {
  return getModulesList(state).filter(isDelayModule);
}

export function getDaoModules(state: RootState) {
  return getModulesList(state).filter(isDaoModule);
}

export function getOperation(state: RootState) {
  return state.modules.operation;
}
