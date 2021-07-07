import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Module, ModulesState } from "./models";

const initialModulesState: ModulesState = {
  reloadCount: 0,
  list: [],
  current: undefined,
};

export const modulesSlice = createSlice({
  name: "modules",
  initialState: initialModulesState,
  reducers: {
    increaseReloadCount: (state) => {
      state.reloadCount += 1;
    },
    setModules(state, action: PayloadAction<Module[]>) {
      state.list = action.payload;
    },
    setCurrentModule(state, action: PayloadAction<Module>) {
      state.current = action.payload;
    },
  },
});

export const { increaseReloadCount, setCurrentModule, setModules } =
  modulesSlice.actions;
