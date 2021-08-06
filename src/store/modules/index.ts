import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk";
import { Module, ModulesState, Operation, PendingModule } from "./models";
import {
  fetchSafeInfo,
  fetchSafeModulesAddress,
  fetchSafeTransactions,
} from "../../services";
import {
  getModulesToBeRemoved,
  getPendingModulesToEnable,
  sanitizeModule,
} from "./helpers";
import { getModulesList } from "./selectors";
import { RootState } from "../index";

const initialModulesState: ModulesState = {
  operation: "read",
  reloadCount: 0,
  safeThreshold: 1,
  loadingModules: true,
  list: [],
  current: undefined,
  pendingModules: [],
  moduleAdded: false,
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

    const requests = moduleAddresses.map(async (moduleAddress) => {
      try {
        return await sanitizeModule(moduleAddress, safeSDK, chainId);
      } catch (error) {
        console.log("error sanitizing module", moduleAddress);
      }
    });
    requests.reverse();
    const responses = await Promise.all(requests);
    return responses.filter((module): module is Module => module !== undefined);
  }
);

export const fetchPendingModules = createAsyncThunk(
  "modules/fetchPendingModules",
  async (
    {
      safeAddress,
      chainId,
      retry = true,
    }: {
      chainId: number;
      safeAddress: string;
      retry?: boolean;
    },
    store
  ) => {
    const safeInfo = await fetchSafeInfo(chainId, safeAddress);
    const transactions = await fetchSafeTransactions(chainId, safeAddress, {
      nonce__gte: safeInfo.nonce.toString(),
    });

    const state = store.getState() as RootState;
    const modules = getModulesList(state);

    const pendingEnableModules = getPendingModulesToEnable(
      transactions,
      safeAddress,
      chainId
    );

    const pendingRemoveModules = getModulesToBeRemoved(
      modules,
      transactions,
      safeAddress
    );

    const pendingModules: PendingModule[] = [
      ...pendingEnableModules,
      ...pendingRemoveModules,
    ];

    if (retry) {
      setTimeout(() => {
        store.dispatch(
          fetchPendingModules({ safeAddress, chainId, retry: false })
        );
      }, 4000);
    }

    return { safeInfo, pendingModules };
  }
);

export const modulesSlice = createSlice({
  name: "modules",
  initialState: initialModulesState,
  reducers: {
    increaseReloadCount: (state) => {
      state.reloadCount += 1;
    },
    setCurrentModule(state, action: PayloadAction<Module>) {
      state.current = action.payload;
      state.operation = "read";
      state.currentPendingModule = undefined;
    },
    unsetCurrentModule(state) {
      state.current = undefined;
      state.currentPendingModule = undefined;
    },
    setOperation(state, action: PayloadAction<Operation>) {
      state.operation = action.payload;
    },
    setCurrentPendingModule(state, action: PayloadAction<PendingModule>) {
      state.currentPendingModule = action.payload;
      state.current = undefined;
    },
    setModuleAdded(state, action: PayloadAction<boolean>) {
      state.moduleAdded = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchModulesList.rejected, (state) => {
      state.loadingModules = false;
    });
    builder.addCase(fetchModulesList.fulfilled, (state, action) => {
      state.loadingModules = false;
      state.list = action.payload;
      const current = state.current;
      if (current) {
        // Check if current module got removed
        const isPresent = action.payload.some(
          (module) => module.address === current.address
        );
        if (!isPresent) {
          state.current = undefined;
        }
      }
    });
    builder.addCase(fetchPendingModules.fulfilled, (state, action) => {
      const { safeInfo, pendingModules } = action.payload;
      state.safeThreshold = safeInfo.threshold;
      state.pendingModules = pendingModules;
    });
  },
});

export const {
  increaseReloadCount,
  setCurrentModule,
  unsetCurrentModule,
  setOperation,
  setCurrentPendingModule,
  setModuleAdded,
} = modulesSlice.actions;
