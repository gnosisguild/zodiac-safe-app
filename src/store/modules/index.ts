import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk";
import { Module, ModulesState, Operation } from "./models";
import { fetchSafeModulesAddress } from "../../services";
import { sanitizeModules } from "./helpers";

const initialModulesState: ModulesState = {
  operation: "read",
  reloadCount: 0,
  loadingModules: false,
  list: [],
  current: undefined,
};

export const fetchModulesList = createAsyncThunk(
  "modules/fetchModulesList",
  async ({
    safeSDK,
    safeAddress,
    chainId,
  }: {
    safeSDK: SafeAppsSDK;
    chainId: number;
    safeAddress: string;
  }): Promise<Module[]> => {
    const moduleAddresses = await fetchSafeModulesAddress(safeAddress);
    const requests = moduleAddresses.map(
      async (m) => await sanitizeModules(m, safeSDK, chainId)
    );
    requests.reverse();
    const modules = await Promise.all(requests);
    console.log({ modules });
    return modules;
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
      state.operation = "read";
    },
    unsetCurrentModule(state) {
      state.current = undefined;
    },
    setOperation(state, action: PayloadAction<Operation>) {
      state.operation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchModulesList.pending, (state) => {
      state.loadingModules = true;
    });
    builder.addCase(fetchModulesList.rejected, (state) => {
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
  setOperation,
} = modulesSlice.actions;
