import { Reducer } from "react";
import { MODULE_ACTION, ModulesAction, ModulesState } from "./models";

export const initialModulesState: ModulesState = {
  reloadCount: 0,
  list: [],
  current: undefined,
};

export const moduleReducer: Reducer<ModulesState, ModulesAction> = (
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
