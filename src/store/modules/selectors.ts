import { RootState } from "../index";

export function getCurrentModule(state: RootState) {
  return state.modules.current;
}

export function getModulesList(state: RootState) {
  return state.modules.list;
}

export function getReloadCount(state: RootState) {
  return state.modules.reloadCount;
}
