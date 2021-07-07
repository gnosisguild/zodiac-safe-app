import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Module, ModulesState } from "./models";
import { fetchSafeModulesAddress } from "../../services";

const initialModulesState: ModulesState = {
  reloadCount: 0,
  loadingModules: false,
  list: [],
  current: undefined,
};

export const fetchModulesList = createAsyncThunk(
  "modules/fetchModulesList",
  async (safeAddress: string) => {
    // @TODO: Create a sanitize function which retrieve the subModules & name
    const moduleAddress = await fetchSafeModulesAddress(safeAddress);
    return moduleAddress.map(
      (module): Module => ({
        address: module,
        subModules: [],
        name: "Cool Module",
      })
    );
  }
);

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
    unsetCurrentModule(state) {
      state.current = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchModulesList.pending, (state) => {
      state.loadingModules = true;
    });
    builder.addCase(fetchModulesList.rejected, (state, action) => {
      state.loadingModules = false;
    });
    builder.addCase(fetchModulesList.fulfilled, (state, action) => {
      state.loadingModules = false;
      state.list = action.payload;
    });
  },
});

export const {
  increaseReloadCount,
  setCurrentModule,
  setModules,
  unsetCurrentModule,
} = modulesSlice.actions;
